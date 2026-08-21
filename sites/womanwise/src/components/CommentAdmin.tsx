import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { allArticles } from '@/data/allArticles';
import { 
  MessageCircle, 
  Check, 
  X, 
  Trash2, 
  RefreshCw, 
  Filter, 
  Clock, 
  ThumbsUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  AlertTriangle,
  Bug,
  Eye,
  Reply,
  Send,
  Shield,
  CornerDownRight,
  Loader2,
  Mail,
  Bell,
  BellOff,
  MailCheck,
  MailX
} from 'lucide-react';

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  author_email?: string;
  email_notifications_enabled?: boolean;
  comment_text: string;
  created_at: string;
  is_approved: boolean;
  is_spam_flagged?: boolean;
  spam_score?: number;
  spam_reasons?: string[];
  likes_count: number;
  parent_comment_id?: string | null;
  is_admin_reply?: boolean;
}

interface Stats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  spamFlaggedComments: number;
  totalLikes: number;
  recentComments: number;
  avgSpamScore: number;
  articleStats: Record<string, { total: number; approved: number; pending: number; spam: number }>;
  spamReasonCounts: Record<string, number>;
  adminReplies?: number;
  totalReplies?: number;
  commentsWithEmail?: number;
  commentsWithNotifications?: number;
}

interface CommentAdminProps {
  adminPassword: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

const CommentAdmin: React.FC<CommentAdminProps> = ({ adminPassword, onClose, isEmbedded = false }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'moderation' | 'statistics' | 'spam-test'>('moderation');
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [expandedComment, setExpandedComment] = useState<string | null>(null);
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('Admin');
  const [replyLoading, setReplyLoading] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  
  // Spam test state
  const [testAuthorName, setTestAuthorName] = useState('');
  const [testCommentText, setTestCommentText] = useState('');
  const [testResult, setTestResult] = useState<{
    isSpam: boolean;
    score: number;
    reasons: string[];
    wouldBeApproved: boolean;
    wouldBeRejected: boolean;
  } | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [filter]);

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminGetAll', adminPassword, filter }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setComments(data.comments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminGetStats', adminPassword }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleApprove = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminApprove', adminPassword, commentId }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, is_approved: true, is_spam_flagged: false } : c
        ));
        fetchStats();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to approve comment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminReject', adminPassword, commentId }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, is_approved: false } : c
        ));
        fetchStats();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject comment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkSpam = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminMarkSpam', adminPassword, commentId }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, is_approved: false, is_spam_flagged: true, spam_score: 100 } : c
        ));
        fetchStats();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark comment as spam');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) return;
    
    setActionLoading(commentId);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminDelete', adminPassword, commentId }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setComments(comments.filter(c => c.id !== commentId));
        setSelectedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        fetchStats();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!replyText.trim()) {
      setError('Please enter a reply');
      return;
    }

    const parentComment = comments.find(c => c.id === parentCommentId);
    const articleTitle = parentComment ? getArticleTitle(parentComment.article_id) : 'an article';

    setReplyLoading(true);
    setSuccessMessage('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { 
          action: 'adminReply', 
          adminPassword, 
          parentCommentId,
          commentText: replyText.trim(),
          authorName: replyAuthorName.trim() || 'Admin',
          articleTitle,
          sendNotification
        }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        // Add the new reply to the comments list
        setComments([data.reply, ...comments]);
        setReplyText('');
        setReplyingTo(null);
        fetchStats();

        // Show notification status
        if (data.notificationSent) {
          setSuccessMessage('Reply posted and email notification sent successfully!');
        } else if (data.hasEmail && data.notificationsEnabled) {
          setSuccessMessage('Reply posted. Email notification could not be sent.');
        } else {
          setSuccessMessage('Reply posted successfully!');
        }
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(data?.error || 'Failed to post reply');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleBulkAction = async (bulkAction: 'approve' | 'reject' | 'delete' | 'markSpam') => {
    if (selectedComments.size === 0) return;
    
    if (bulkAction === 'delete' && !confirm(`Are you sure you want to permanently delete ${selectedComments.size} comments?`)) {
      return;
    }

    setActionLoading('bulk');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { 
          action: 'adminBulkAction', 
          adminPassword, 
          commentIds: Array.from(selectedComments),
          bulkAction 
        }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        if (bulkAction === 'delete') {
          setComments(comments.filter(c => !selectedComments.has(c.id)));
        } else if (bulkAction === 'markSpam') {
          setComments(comments.map(c => 
            selectedComments.has(c.id) 
              ? { ...c, is_approved: false, is_spam_flagged: true, spam_score: 100 } 
              : c
          ));
        } else {
          setComments(comments.map(c => 
            selectedComments.has(c.id) 
              ? { ...c, is_approved: bulkAction === 'approve', is_spam_flagged: bulkAction === 'approve' ? false : c.is_spam_flagged } 
              : c
          ));
        }
        setSelectedComments(new Set());
        fetchStats();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to perform bulk action');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTestSpam = async () => {
    if (!testAuthorName.trim() || !testCommentText.trim()) {
      setError('Please enter both author name and comment text to test');
      return;
    }

    setTestLoading(true);
    setTestResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { 
          action: 'testSpamDetection', 
          adminPassword,
          authorName: testAuthorName,
          commentText: testCommentText
        }
      });

      if (fnError) throw fnError;
      if (data?.success) {
        setTestResult(data.spamCheck);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to test spam detection');
    } finally {
      setTestLoading(false);
    }
  };

  const toggleSelectComment = (commentId: string) => {
    setSelectedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const getArticleTitle = (articleId: string) => {
    const article = allArticles.find(a => a.id === articleId);
    return article?.title || `Article ${articleId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      comment.author_name.toLowerCase().includes(query) ||
      comment.comment_text.toLowerCase().includes(query) ||
      (comment.author_email?.toLowerCase().includes(query)) ||
      getArticleTitle(comment.article_id).toLowerCase().includes(query)
    );
  });

  const toggleArticleExpand = (articleId: string) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const getSpamScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 30) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  const content = (
    <div className={isEmbedded ? '' : 'bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col'}>
      {/* Header */}
      {!isEmbedded && (
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Comment Moderation</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-stone-200 flex gap-4 bg-stone-50 flex-wrap">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'bg-blue-100 text-blue-700'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Moderation
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'statistics'
              ? 'bg-blue-100 text-blue-700'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('spam-test')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'spam-test'
              ? 'bg-blue-100 text-blue-700'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bug className="w-4 h-4" />
          Spam Tester
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-500 hover:text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search comments, emails..."
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'approved' | 'spam')}
                  className="px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Comments</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="spam">Spam Flagged</option>
                </select>
              </div>

              {/* Refresh */}
              <button
                onClick={() => { fetchComments(); fetchStats(); }}
                disabled={loading}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedComments.size > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-wrap">
                <span className="text-sm font-medium text-blue-700">
                  {selectedComments.size} selected
                </span>
                <div className="flex gap-2 ml-auto flex-wrap">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('markSpam')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Mark Spam
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Comments Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedComments.size === filteredComments.length && filteredComments.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Comment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Article</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Spam</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                          Loading comments...
                        </td>
                      </tr>
                    ) : filteredComments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                          No comments found
                        </td>
                      </tr>
                    ) : (
                      filteredComments.map((comment) => (
                        <React.Fragment key={comment.id}>
                          <tr className={`hover:bg-stone-50 ${comment.is_spam_flagged ? 'bg-red-50/50' : !comment.is_approved ? 'bg-amber-50/50' : ''} ${comment.is_admin_reply ? 'bg-indigo-50/50' : ''}`}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedComments.has(comment.id)}
                                onChange={() => toggleSelectComment(comment.id)}
                                className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${comment.is_admin_reply ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                                  {comment.is_admin_reply ? (
                                    <Shield className="w-4 h-4" />
                                  ) : (
                                    comment.author_name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium text-stone-800 text-sm">{comment.author_name}</span>
                                  {comment.is_admin_reply && (
                                    <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                      Admin
                                    </span>
                                  )}
                                  {comment.author_email && (
                                    <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                                      <Mail className="w-3 h-3" />
                                      <span className="truncate max-w-[120px]">{comment.author_email}</span>
                                      {comment.email_notifications_enabled ? (
                                        <Bell className="w-3 h-3 text-green-500" title="Notifications enabled" />
                                      ) : (
                                        <BellOff className="w-3 h-3 text-stone-300" title="Notifications disabled" />
                                      )}
                                    </div>
                                  )}
                                  {comment.parent_comment_id && (
                                    <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                                      <CornerDownRight className="w-3 h-3" />
                                      Reply to comment
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <p className="text-sm text-stone-600 truncate" title={comment.comment_text}>
                                {comment.comment_text}
                              </p>
                              {comment.likes_count > 0 && (
                                <span className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  {comment.likes_count}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-stone-600 truncate block max-w-[150px]" title={getArticleTitle(comment.article_id)}>
                                {getArticleTitle(comment.article_id)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {comment.is_approved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {comment.is_spam_flagged ? (
                                <button
                                  onClick={() => setExpandedComment(expandedComment === comment.id ? null : comment.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full hover:bg-red-200 transition-colors"
                                >
                                  <ShieldAlert className="w-3 h-3" />
                                  Score: {comment.spam_score || 0}
                                  <Eye className="w-3 h-3 ml-1" />
                                </button>
                              ) : comment.spam_score && comment.spam_score > 0 ? (
                                <button
                                  onClick={() => setExpandedComment(expandedComment === comment.id ? null : comment.id)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full hover:opacity-80 transition-colors ${getSpamScoreColor(comment.spam_score)}`}
                                >
                                  Score: {comment.spam_score}
                                  <Eye className="w-3 h-3 ml-1" />
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  Clean
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-stone-500">{formatDate(comment.created_at)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {/* Reply button - only for non-reply comments */}
                                {!comment.parent_comment_id && (
                                  <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${replyingTo === comment.id ? 'bg-indigo-100 text-indigo-600' : 'text-indigo-600 hover:bg-indigo-100'}`}
                                    title="Reply"
                                  >
                                    <Reply className="w-4 h-4" />
                                  </button>
                                )}
                                {!comment.is_approved && (
                                  <button
                                    onClick={() => handleApprove(comment.id)}
                                    disabled={actionLoading === comment.id}
                                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {comment.is_approved && (
                                  <button
                                    onClick={() => handleReject(comment.id)}
                                    disabled={actionLoading === comment.id}
                                    className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                                {!comment.is_spam_flagged && (
                                  <button
                                    onClick={() => handleMarkSpam(comment.id)}
                                    disabled={actionLoading === comment.id}
                                    className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Mark as Spam"
                                  >
                                    <ShieldAlert className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(comment.id)}
                                  disabled={actionLoading === comment.id}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* Reply form row */}
                          {replyingTo === comment.id && (
                            <tr className="bg-indigo-50">
                              <td colSpan={8} className="px-4 py-4">
                                <div className="ml-12 p-4 bg-white border border-indigo-200 rounded-xl">
                                  <h4 className="text-sm font-medium text-indigo-700 mb-3 flex items-center gap-2">
                                    <Reply className="w-4 h-4" />
                                    Reply to {comment.author_name}
                                    {comment.author_email && comment.email_notifications_enabled && (
                                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                        <Bell className="w-3 h-3" />
                                        Will be notified
                                      </span>
                                    )}
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-medium text-stone-600 mb-1">Reply as:</label>
                                        <input
                                          type="text"
                                          value={replyAuthorName}
                                          onChange={(e) => setReplyAuthorName(e.target.value)}
                                          placeholder="Admin"
                                          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                      </div>
                                      {comment.author_email && comment.email_notifications_enabled && (
                                        <div className="flex items-end">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={sendNotification}
                                              onChange={(e) => setSendNotification(e.target.checked)}
                                              className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-stone-600 flex items-center gap-1">
                                              <Mail className="w-4 h-4" />
                                              Send email notification
                                            </span>
                                          </label>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-stone-600 mb-1">Your reply:</label>
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        maxLength={2000}
                                      />
                                      <p className="text-xs text-stone-400 mt-1">{replyText.length}/2000 characters</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        onClick={() => handleReply(comment.id)}
                                        disabled={replyLoading || !replyText.trim()}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                      >
                                        {replyLoading ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Posting...
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-4 h-4" />
                                            Post Reply
                                            {sendNotification && comment.author_email && comment.email_notifications_enabled && (
                                              <Mail className="w-4 h-4 ml-1" />
                                            )}
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyText('');
                                        }}
                                        className="px-4 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          {/* Expanded spam details row */}
                          {expandedComment === comment.id && comment.spam_reasons && comment.spam_reasons.length > 0 && (
                            <tr className="bg-stone-50">
                              <td colSpan={8} className="px-4 py-3">
                                <div className="ml-12 p-3 bg-white border border-stone-200 rounded-lg">
                                  <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    Spam Detection Reasons
                                  </h4>
                                  <ul className="space-y-1">
                                    {comment.spam_reasons.map((reason, idx) => (
                                      <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
                <p className="text-sm text-blue-600 font-medium">Total Comments</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalComments}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-700">{stats.approvedComments}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-700">{stats.pendingComments}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl">
                <p className="text-sm text-red-600 font-medium">Spam Flagged</p>
                <p className="text-3xl font-bold text-red-700">{stats.spamFlaggedComments}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl">
                <p className="text-sm text-purple-600 font-medium">Total Likes</p>
                <p className="text-3xl font-bold text-purple-700">{stats.totalLikes}</p>
              </div>
            </div>

            {/* Second row of stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-5 rounded-xl">
                <p className="text-sm text-rose-600 font-medium">Last 7 Days</p>
                <p className="text-3xl font-bold text-rose-700">{stats.recentComments}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl">
                <p className="text-sm text-indigo-600 font-medium">Admin Replies</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.adminReplies || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl">
                <p className="text-sm text-teal-600 font-medium">Total Replies</p>
                <p className="text-3xl font-bold text-teal-700">{stats.totalReplies || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-xl">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  <p className="text-sm text-cyan-600 font-medium">With Email</p>
                </div>
                <p className="text-3xl font-bold text-cyan-700">{stats.commentsWithEmail || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl">
                <div className="flex items-center gap-1">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <p className="text-sm text-emerald-600 font-medium">Notifications On</p>
                </div>
                <p className="text-3xl font-bold text-emerald-700">{stats.commentsWithNotifications || 0}</p>
              </div>
            </div>

            {/* Spam Reasons Breakdown */}
            {stats.spamReasonCounts && Object.keys(stats.spamReasonCounts).length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                  <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    Spam Detection Breakdown
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(stats.spamReasonCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([reason, count]) => (
                        <div key={reason} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                          <span className="text-sm text-stone-700 truncate flex-1 mr-2">{reason}</span>
                          <span className="text-sm font-semibold text-stone-800 bg-white px-2 py-1 rounded-full border border-stone-200">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Article Stats */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h3 className="font-semibold text-stone-800">Comments by Article</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {Object.entries(stats.articleStats).length === 0 ? (
                  <p className="px-6 py-8 text-center text-stone-500">No article statistics available</p>
                ) : (
                  Object.entries(stats.articleStats)
                    .sort((a, b) => b[1].total - a[1].total)
                    .map(([articleId, articleStat]) => (
                      <div key={articleId} className="px-6 py-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleArticleExpand(articleId)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-800 truncate">{getArticleTitle(articleId)}</p>
                          </div>
                          <div className="flex items-center gap-4 ml-4 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-stone-500">{articleStat.total} total</span>
                              <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {articleStat.approved} approved
                              </span>
                              {articleStat.pending > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                  {articleStat.pending} pending
                                </span>
                              )}
                              {articleStat.spam > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  {articleStat.spam} spam
                                </span>
                              )}
                            </div>
                            {expandedArticles.has(articleId) ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                        </div>
                        {expandedArticles.has(articleId) && (
                          <div className="mt-3 pt-3 border-t border-stone-100">
                            <div className="w-full bg-stone-100 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{ width: `${(articleStat.approved / articleStat.total) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-stone-500 mt-2">
                              {Math.round((articleStat.approved / articleStat.total) * 100)}% approval rate
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spam-test' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Spam Detection Tester
              </h3>
              <p className="text-purple-600 text-sm mb-4">
                Test the spam detection system by entering sample comment data. This won't create an actual comment.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={testAuthorName}
                    onChange={(e) => setTestAuthorName(e.target.value)}
                    placeholder="Enter author name to test..."
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Comment Text</label>
                  <textarea
                    value={testCommentText}
                    onChange={(e) => setTestCommentText(e.target.value)}
                    placeholder="Enter comment text to test for spam patterns..."
                    rows={4}
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  onClick={handleTestSpam}
                  disabled={testLoading}
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {testLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Bug className="w-4 h-4" />
                      Test Spam Detection
                    </>
                  )}
                </button>
              </div>
            </div>

            {testResult && (
              <div className={`border rounded-xl p-6 ${testResult.isSpam ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${testResult.isSpam ? 'text-red-800' : 'text-green-800'}`}>
                  {testResult.isSpam ? (
                    <>
                      <ShieldAlert className="w-5 h-5" />
                      Spam Detected
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Clean Comment
                    </>
                  )}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`p-4 rounded-lg ${testResult.isSpam ? 'bg-red-100' : 'bg-green-100'}`}>
                    <p className={`text-sm font-medium ${testResult.isSpam ? 'text-red-600' : 'text-green-600'}`}>Spam Score</p>
                    <p className={`text-3xl font-bold ${testResult.isSpam ? 'text-red-700' : 'text-green-700'}`}>{testResult.score}/100</p>
                  </div>
                  <div className={`p-4 rounded-lg ${testResult.wouldBeApproved ? 'bg-green-100' : 'bg-amber-100'}`}>
                    <p className={`text-sm font-medium ${testResult.wouldBeApproved ? 'text-green-600' : 'text-amber-600'}`}>Would Be</p>
                    <p className={`text-xl font-bold ${testResult.wouldBeApproved ? 'text-green-700' : 'text-amber-700'}`}>
                      {testResult.wouldBeApproved ? 'Auto-Approved' : 'Held for Review'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${testResult.wouldBeRejected ? 'bg-red-100' : 'bg-green-100'}`}>
                    <p className={`text-sm font-medium ${testResult.wouldBeRejected ? 'text-red-600' : 'text-green-600'}`}>Rejection</p>
                    <p className={`text-xl font-bold ${testResult.wouldBeRejected ? 'text-red-700' : 'text-green-700'}`}>
                      {testResult.wouldBeRejected ? 'Would Be Rejected' : 'Would Not Reject'}
                    </p>
                  </div>
                </div>

                {testResult.reasons.length > 0 && (
                  <div>
                    <h5 className={`text-sm font-medium mb-2 ${testResult.isSpam ? 'text-red-700' : 'text-stone-700'}`}>
                      Detection Reasons:
                    </h5>
                    <ul className="space-y-1">
                      {testResult.reasons.map((reason, idx) => (
                        <li key={idx} className={`text-sm flex items-start gap-2 ${testResult.isSpam ? 'text-red-600' : 'text-stone-600'}`}>
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {testResult.reasons.length === 0 && (
                  <p className="text-green-600 text-sm">No spam patterns detected in this comment.</p>
                )}
              </div>
            )}

            {/* Example spam patterns */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h4 className="font-semibold text-stone-800 mb-4">Spam Detection Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium text-stone-700">Keywords Checked:</h5>
                  <ul className="text-stone-600 space-y-1">
                    <li>• Commercial phrases (buy now, click here, free money)</li>
                    <li>• Gambling/casino terms</li>
                    <li>• Pharmaceutical spam</li>
                    <li>• SEO/backlink spam</li>
                    <li>• Adult content keywords</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-stone-700">Patterns Detected:</h5>
                  <ul className="text-stone-600 space-y-1">
                    <li>• Multiple URLs (3+ links)</li>
                    <li>• Shortened URL domains</li>
                    <li>• Repeated characters/words</li>
                    <li>• Excessive CAPS or punctuation</li>
                    <li>• Email addresses and phone numbers</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700 text-sm">
                  <strong>Threshold:</strong> Comments with spam score ≥30 are flagged for review. 
                  Comments with score &gt;70 are automatically rejected.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {content}
    </div>
  );
};

export default CommentAdmin;
