import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Send, User, Clock, ThumbsUp, Loader2, AlertTriangle, CheckCircle, Shield, CornerDownRight, Mail, Bell, BellOff } from 'lucide-react';

interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
  likes_count: number;
  is_admin_reply?: boolean;
  parent_comment_id?: string | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  articleId: string;
  articleTitle: string;
  onCommentAdded?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId, articleTitle, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [showEmailField, setShowEmailField] = useState(false);

  useEffect(() => {
    fetchComments();
    // Load liked comments from localStorage
    const stored = localStorage.getItem(`liked_comments_${articleId}`);
    if (stored) {
      setLikedComments(new Set(JSON.parse(stored)));
    }
  }, [articleId]);

  // Check for unsubscribe token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const unsubscribeToken = urlParams.get('unsubscribe');
    if (unsubscribeToken) {
      handleUnsubscribe(unsubscribeToken);
    }
  }, []);

  const handleUnsubscribe = async (token: string) => {
    try {
      const { data } = await supabase.functions.invoke('comment-notification', {
        body: { action: 'unsubscribe', token }
      });

      if (data?.success) {
        // Show success message
        setSuccess(true);
        setError('');
        // Remove token from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('unsubscribe');
        window.history.replaceState({}, '', url.toString());
        // Show temporary message
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error unsubscribing:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('article-comments', {
        body: { action: 'get', articleId }
      });

      if (data?.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setPendingReview(false);

    if (!authorName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (commentText.length > 2000) {
      setError('Comment is too long (max 2000 characters)');
      return;
    }

    if (authorEmail && !validateEmail(authorEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (enableNotifications && !authorEmail) {
      setError('Please enter your email to receive notifications');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: submitError } = await supabase.functions.invoke('article-comments', {
        body: {
          action: 'add',
          articleId,
          authorName: authorName.trim(),
          commentText: commentText.trim(),
          authorEmail: authorEmail.trim() || null,
          enableNotifications: enableNotifications && !!authorEmail.trim()
        }
      });

      if (data?.success) {
        // Check if comment is pending review (flagged by spam filter)
        if (data.pendingReview) {
          setPendingReview(true);
          setCommentText('');
          // Save author name and email for future comments
          localStorage.setItem('comment_author_name', authorName);
          if (authorEmail) {
            localStorage.setItem('comment_author_email', authorEmail);
            localStorage.setItem('comment_notifications_enabled', String(enableNotifications));
          }
          setTimeout(() => setPendingReview(false), 8000);
        } else {
          // Comment was approved immediately
          setComments([{ ...data.comment, replies: [] }, ...comments]);
          setCommentText('');
          setSuccess(true);
          // Save author name and email for future comments
          localStorage.setItem('comment_author_name', authorName);
          if (authorEmail) {
            localStorage.setItem('comment_author_email', authorEmail);
            localStorage.setItem('comment_notifications_enabled', String(enableNotifications));
          }
          if (onCommentAdded) {
            onCommentAdded();
          }
          setTimeout(() => setSuccess(false), 3000);
        }
      } else if (data?.isSpam) {
        // Comment was rejected as obvious spam
        setError(data.error || 'Your comment was flagged as spam. Please revise and try again.');
      } else {
        setError(data?.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedComments.has(commentId)) return;

    try {
      await supabase.functions.invoke('article-comments', {
        body: { action: 'like', commentId }
      });

      // Update local state - need to handle nested replies
      const updateLikes = (commentsList: Comment[]): Comment[] => {
        return commentsList.map(c => {
          if (c.id === commentId) {
            return { ...c, likes_count: (c.likes_count || 0) + 1 };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateLikes(c.replies) };
          }
          return c;
        });
      };

      setComments(updateLikes(comments));

      // Track liked comment
      const newLiked = new Set(likedComments).add(commentId);
      setLikedComments(newLiked);
      localStorage.setItem(`liked_comments_${articleId}`, JSON.stringify([...newLiked]));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string, isAdmin: boolean = false) => {
    if (isAdmin) return 'bg-gradient-to-br from-indigo-600 to-purple-600';
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-red-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Load saved author name and email on mount
  useEffect(() => {
    const savedName = localStorage.getItem('comment_author_name');
    const savedEmail = localStorage.getItem('comment_author_email');
    const savedNotifications = localStorage.getItem('comment_notifications_enabled');
    
    if (savedName) {
      setAuthorName(savedName);
    }
    if (savedEmail) {
      setAuthorEmail(savedEmail);
      setShowEmailField(true);
    }
    if (savedNotifications === 'true') {
      setEnableNotifications(true);
    }
  }, []);

  // Count total comments including replies
  const countTotalComments = (commentsList: Comment[]): number => {
    return commentsList.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countTotalComments(comment.replies) : 0);
    }, 0);
  };

  const totalCommentCount = countTotalComments(comments);

  // Render a single comment with its replies
  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 md:ml-12 mt-4' : ''}`}>
      <div className={`flex gap-3 md:gap-4 ${comment.is_admin_reply ? 'bg-gradient-to-r from-indigo-50 to-purple-50 -mx-2 px-2 py-3 rounded-xl border border-indigo-100' : ''}`}>
        {/* Reply indicator for replies */}
        {isReply && (
          <div className="flex-shrink-0 w-4 flex items-start justify-center pt-3">
            <CornerDownRight className="w-4 h-4 text-gray-300" />
          </div>
        )}
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full ${getAvatarColor(comment.author_name, comment.is_admin_reply)} flex items-center justify-center relative`}>
          <span className="text-white font-medium text-xs md:text-sm">
            {comment.is_admin_reply ? (
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              getInitials(comment.author_name)
            )}
          </span>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`font-medium ${comment.is_admin_reply ? 'text-indigo-700' : 'text-gray-900'}`}>
              {comment.author_name}
            </span>
            {comment.is_admin_reply && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
            <span className="text-gray-300">•</span>
            <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className={`whitespace-pre-wrap break-words text-sm md:text-base ${comment.is_admin_reply ? 'text-indigo-800' : 'text-gray-700'}`}>
            {comment.comment_text}
          </p>
          <div className="mt-2">
            <button
              onClick={() => handleLike(comment.id)}
              disabled={likedComments.has(comment.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                likedComments.has(comment.id)
                  ? 'text-blue-600 cursor-default'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
              <span>{comment.likes_count || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-gray-100 ml-4 md:ml-5">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Comments</h3>
            <p className="text-blue-100 text-sm">
              {totalCommentCount} {totalCommentCount === 1 ? 'comment' : 'comments'} on this article
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400 font-normal">(optional - for reply notifications)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  id="authorEmail"
                  value={authorEmail}
                  onChange={(e) => {
                    setAuthorEmail(e.target.value);
                    if (!e.target.value) {
                      setEnableNotifications(false);
                    }
                  }}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  maxLength={255}
                />
              </div>
            </div>
          </div>

          {/* Notification toggle - only show if email is entered */}
          {authorEmail && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors relative ${
                  enableNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    enableNotifications ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {enableNotifications ? (
                    <Bell className="w-4 h-4 text-blue-600" />
                  ) : (
                    <BellOff className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`text-sm font-medium ${enableNotifications ? 'text-blue-700' : 'text-gray-600'}`}>
                    {enableNotifications ? 'Notifications enabled' : 'Notifications disabled'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {enableNotifications 
                    ? "You'll receive an email when someone replies to your comment. You can unsubscribe anytime."
                    : "Enable to get notified when someone replies to your comment."}
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts on this article..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {commentText.length}/2000 characters
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Your comment has been posted successfully!</span>
            </div>
          )}

          {pendingReview && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Comment submitted for review</p>
                <p className="text-amber-600 mt-1">Your comment has been submitted and is pending review by a moderator. It will appear once approved.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
            
            {enableNotifications && authorEmail && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Bell className="w-3 h-3" />
                You'll be notified at {authorEmail}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-gray-900 font-medium mb-1">No comments yet</h4>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
