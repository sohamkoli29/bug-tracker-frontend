import { createContext, useState } from 'react';
import axios from 'axios';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

 const API_URL = `${import.meta.env.VITE_API_URL}/api`;


  // Get config with token
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Get all comments for a ticket
  const getComments = async (ticketId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/tickets/${ticketId}/comments`,
        getConfig()
      );
      setComments(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch comments',
      };
    }
  };

  // Create comment
  const createComment = async (ticketId, commentData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/tickets/${ticketId}/comments`,
        commentData,
        getConfig()
      );
      setComments([...comments, data]);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create comment',
      };
    }
  };

  // Update comment
  const updateComment = async (commentId, commentData) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/comments/${commentId}`,
        commentData,
        getConfig()
      );
      setComments(comments.map((c) => (c._id === commentId ? data : c)));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update comment',
      };
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, getConfig());
      setComments(comments.filter((c) => c._id !== commentId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete comment',
      };
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        getComments,
        createComment,
        updateComment,
        deleteComment,
        setComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContext;