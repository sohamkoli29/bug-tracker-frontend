import { useState, useEffect, useContext } from 'react';
import { MessageSquare, Send, Edit2, Trash2, Reply, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CommentContext from '../context/CommentContext';
import AuthContext from '../context/AuthContext';

function Comments({ ticketId }) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { comments, loading, getComments, createComment, updateComment, deleteComment } =
    useContext(CommentContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (ticketId) {
      getComments(ticketId);
    }
  }, [ticketId]);

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const result = await createComment(ticketId, { text: newComment });

    if (result.success) {
      toast.success('Comment added!');
      setNewComment('');
      getComments(ticketId);
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    const result = await updateComment(commentId, { text: editText });

    if (result.success) {
      toast.success('Comment updated!');
      setEditingComment(null);
      setEditText('');
      getComments(ticketId);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    const result = await deleteComment(commentId);

    if (result.success) {
      toast.success('Comment deleted!');
      getComments(ticketId);
    } else {
      toast.error(result.message);
    }
  };

  const handleReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    const result = await createComment(ticketId, {
      text: replyText,
      parentComment: parentCommentId,
    });

    if (result.success) {
      toast.success('Reply added!');
      setReplyingTo(null);
      setReplyText('');
      getComments(ticketId);
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  // Organize comments into threads
  const topLevelComments = comments.filter((c) => !c.parentComment);
  const getReplies = (commentId) => {
    return comments.filter((c) => c.parentComment?._id === commentId);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-bold text-slate-800">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div key={comment._id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {getInitials(comment.user.name)}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {comment.user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(comment.createdAt)}
                        {comment.edited && (
                          <span className="ml-2 italic">(edited)</span>
                        )}
                      </p>
                    </div>
                    {comment.user._id === user?._id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditText(comment.text);
                          }}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingComment === comment._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {comment.text}
                      </p>
                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment._id && (
                <div className="ml-12 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      autoFocus
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReply(comment._id)}
                        disabled={!replyText.trim() || submitting}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Replying...' : 'Reply'}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {getReplies(comment._id).map((reply) => (
                <div key={reply._id} className="ml-12 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(reply.user.name)}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {reply.user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(reply.createdAt)}
                          {reply.edited && (
                            <span className="ml-2 italic">(edited)</span>
                          )}
                        </p>
                      </div>
                      {reply.user._id === user?._id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingComment(reply._id);
                              setEditText(reply.text);
                            }}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(reply._id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingComment === reply._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(reply._id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditText('');
                            }}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">
                        {reply.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;