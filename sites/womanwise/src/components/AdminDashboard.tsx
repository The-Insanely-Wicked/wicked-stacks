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
  Mail,
  Users,
  Send,
  Settings,
  Shield
} from 'lucide-react';

// Types
interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  is_approved: boolean;
  likes_count: number;
}

interface CommentStats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalLikes: number;
  recentComments: number;
  articleStats: Record<string, { total: number; approved: number; pending: number }>;
}

interface Subscriber {
  email: string;
  first_name: string | null;
  subscribed_at: string;
  is_active: boolean;
}

interface Broadcast {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  recipient_count: number;
  status: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  recentSubscribers: number;
  unsubscribed: number;
}

interface NewsletterData {
  stats: NewsletterStats;
  recentSubscribers: Subscriber[];
  broadcasts: Broadcast[];
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'comments' | 'newsletter'>('comments');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify password by making a test request to comment admin
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminGetStats', adminPassword: password }
      });

      if (fnError) throw fnError;
      if (data?.error === 'Unauthorized') throw new Error('Invalid password');
      if (data?.success) {
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800">Admin Dashboard</h2>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-stone-500 text-center">
            Default password: womanwise-admin-2024
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-3 border-b border-stone-200 flex gap-4 bg-stone-50">
          <button
            onClick={() => setActiveSection('comments')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeSection === 'comments'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Comment Moderation
          </button>
          <button
            onClick={() => setActiveSection('newsletter')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeSection === 'newsletter'
                ? 'bg-rose-100 text-rose-700'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            Newsletter Admin
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'comments' ? (
            <CommentAdminSection adminPassword={password} />
          ) : (
            <NewsletterAdminSection adminPassword={password} />
          )}
        </div>
      </div>
    </div>
  );
};

// Comment Admin Section
const CommentAdminSection: React.FC<{ adminPassword: string }> = ({ adminPassword }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'moderation' | 'statistics'>('moderation');
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());

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
          c.id === commentId ? { ...c, is_approved: true } : c
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

  const handleBulkAction = async (bulkAction: 'approve' | 'reject' | 'delete') => {
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
        } else {
          setComments(comments.map(c => 
            selectedComments.has(c.id) 
              ? { ...c, is_approved: bulkAction === 'approve' } 
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
    const article = allArticles.find(a => a.slug === articleId || a.id === articleId);
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

  return (
    <div className="p-6">
      {/* Sub-tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Moderation Queue
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'statistics'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
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
                placeholder="Search comments..."
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'approved')}
                className="px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Comments</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
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
            <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-sm font-medium text-indigo-700">
                {selectedComments.size} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reject All
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              </div>
            </div>
          )}

          {/* Comments Table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedComments.size === filteredComments.length && filteredComments.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Comment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Article</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading comments...
                    </td>
                  </tr>
                ) : filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      No comments found
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((comment) => (
                    <tr key={comment.id} className={`hover:bg-stone-50 ${!comment.is_approved ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedComments.has(comment.id)}
                          onChange={() => toggleSelectComment(comment.id)}
                          className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-stone-800 text-sm">{comment.author_name}</span>
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
                        <span className="text-sm text-stone-500">{formatDate(comment.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'statistics' && stats && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl">
              <p className="text-sm text-indigo-600 font-medium">Total Comments</p>
              <p className="text-3xl font-bold text-indigo-700">{stats.totalComments}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-700">{stats.approvedComments}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
              <p className="text-sm text-amber-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-amber-700">{stats.pendingComments}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl">
              <p className="text-sm text-purple-600 font-medium">Total Likes</p>
              <p className="text-3xl font-bold text-purple-700">{stats.totalLikes}</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-5 rounded-xl">
              <p className="text-sm text-rose-600 font-medium">Last 7 Days</p>
              <p className="text-3xl font-bold text-rose-700">{stats.recentComments}</p>
            </div>
          </div>

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
                        <div className="flex items-center gap-4 ml-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-500">{articleStat.total} total</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              {articleStat.approved} approved
                            </span>
                            {articleStat.pending > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                {articleStat.pending} pending
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
    </div>
  );
};

// Newsletter Admin Section
const NewsletterAdminSection: React.FC<{ adminPassword: string }> = ({ adminPassword }) => {
  const [adminData, setAdminData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'broadcast' | 'subscribers'>('dashboard');
  
  // Broadcast form
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; message: string } | null>(null);

  // All subscribers
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-admin', {
        body: { action: 'getStats', adminPassword }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setAdminData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-admin', {
        body: { action: 'getSubscribers', adminPassword }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setAllSubscribers(data.subscribers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleSendPreview = async () => {
    if (!previewEmail || !broadcastSubject || !broadcastContent) {
      setBroadcastResult({ success: false, message: 'Please fill in all fields and preview email' });
      return;
    }

    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-broadcast', {
        body: {
          adminPassword,
          subject: broadcastSubject,
          content: broadcastContent,
          previewEmail
        }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setBroadcastResult({ success: true, message: data.message });
    } catch (err: any) {
      setBroadcastResult({ success: false, message: err.message || 'Failed to send preview' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastSubject || !broadcastContent) {
      setBroadcastResult({ success: false, message: 'Please fill in subject and content' });
      return;
    }

    if (!confirm(`Are you sure you want to send this email to ${adminData?.stats.activeSubscribers || 0} subscribers?`)) {
      return;
    }

    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-broadcast', {
        body: {
          adminPassword,
          subject: broadcastSubject,
          content: broadcastContent
        }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setBroadcastResult({ success: true, message: data.message });
      setBroadcastSubject('');
      setBroadcastContent('');

      // Refresh stats
      fetchStats();
    } catch (err: any) {
      setBroadcastResult({ success: false, message: err.message || 'Failed to send broadcast' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subscribers' && allSubscribers.length === 0) {
      loadSubscribers();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-rose-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Sub-tabs */}
      <div className="flex gap-4 mb-6">
        {(['dashboard', 'broadcast', 'subscribers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-rose-100 text-rose-700'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab === 'dashboard' && <BarChart3 className="w-4 h-4" />}
            {tab === 'broadcast' && <Send className="w-4 h-4" />}
            {tab === 'subscribers' && <Users className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {activeTab === 'dashboard' && adminData && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl">
              <p className="text-sm text-rose-600 font-medium">Total Subscribers</p>
              <p className="text-3xl font-bold text-rose-700">{adminData.stats.totalSubscribers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-green-700">{adminData.stats.activeSubscribers}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <p className="text-sm text-blue-600 font-medium">Last 7 Days</p>
              <p className="text-3xl font-bold text-blue-700">{adminData.stats.recentSubscribers}</p>
            </div>
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-xl">
              <p className="text-sm text-stone-600 font-medium">Unsubscribed</p>
              <p className="text-3xl font-bold text-stone-700">{adminData.stats.unsubscribed}</p>
            </div>
          </div>

          {/* Recent Subscribers */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-800">Recent Subscribers</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {adminData.recentSubscribers.length === 0 ? (
                <p className="px-6 py-8 text-center text-stone-500">No subscribers yet</p>
              ) : (
                adminData.recentSubscribers.map((sub, index) => (
                  <div key={index} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-800">{sub.email}</p>
                      {sub.first_name && <p className="text-sm text-stone-500">{sub.first_name}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        sub.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Broadcast History */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-800">Broadcast History</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {adminData.broadcasts.length === 0 ? (
                <p className="px-6 py-8 text-center text-stone-500">No broadcasts sent yet</p>
              ) : (
                adminData.broadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-stone-800">{broadcast.subject}</p>
                      <span className="text-sm text-stone-500">
                        {broadcast.recipient_count} recipients
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(broadcast.sent_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Email Content</label>
            <textarea
              value={broadcastContent}
              onChange={(e) => setBroadcastContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              placeholder="Write your email content here..."
            />
          </div>

          <div className="bg-stone-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-stone-700 mb-2">Send Preview To</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="your@email.com"
              />
              <button
                onClick={handleSendPreview}
                disabled={sendingBroadcast}
                className="px-6 py-2 bg-stone-600 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                Send Preview
              </button>
            </div>
          </div>

          {broadcastResult && (
            <div className={`p-4 rounded-lg ${
              broadcastResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {broadcastResult.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              This will be sent to <strong>{adminData?.stats.activeSubscribers || 0}</strong> active subscribers
            </p>
            <button
              onClick={handleSendBroadcast}
              disabled={sendingBroadcast || !broadcastSubject || !broadcastContent}
              className="px-8 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {sendingBroadcast ? 'Sending...' : 'Send Broadcast'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">All Subscribers</h3>
            <button
              onClick={loadSubscribers}
              disabled={loadingSubscribers}
              className="px-4 py-2 text-sm bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSubscribers ? 'animate-spin' : ''}`} />
              {loadingSubscribers ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loadingSubscribers ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading...
                    </td>
                  </tr>
                ) : allSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-stone-500">No subscribers yet</td>
                  </tr>
                ) : (
                  allSubscribers.map((sub, index) => (
                    <tr key={index} className="hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm text-stone-800">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{sub.first_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          sub.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
