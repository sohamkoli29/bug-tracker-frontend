import { createContext, useState, useContext } from "react";
import axios from "axios";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Get config with token
  const getConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Get all tickets for a project
  const getTickets = async (projectId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/projects/${projectId}/tickets`,
        getConfig(),
      );
      setTickets(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch tickets",
      };
    }
  };

  // Get single ticket
  const getTicket = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/tickets/${id}`, getConfig());
      setCurrentTicket(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch ticket",
      };
    }
  };

  // Create ticket
  const createTicket = async (projectId, ticketData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/projects/${projectId}/tickets`,
        ticketData,
        getConfig(),
      );
      setTickets([data, ...tickets]);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create ticket",
      };
    }
  };

  // Update ticket
  const updateTicket = async (id, ticketData) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/tickets/${id}`,
        ticketData,
        getConfig(),
      );
      setTickets(tickets.map((t) => (t._id === id ? data : t)));
      if (currentTicket?._id === id) {
        setCurrentTicket(data);
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update ticket",
      };
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    try {
      await axios.delete(`${API_URL}/tickets/${id}`, getConfig());
      setTickets(tickets.filter((t) => t._id !== id));
      if (currentTicket?._id === id) {
        setCurrentTicket(null);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete ticket",
      };
    }
  };

  // Get ticket stats
  const getTicketStats = async (projectId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/projects/${projectId}/tickets/stats`,
        getConfig(),
      );
      setTicketStats(data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch stats",
      };
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        currentTicket,
        ticketStats,
        loading,
        getTickets,
        getTicket,
        createTicket,
        updateTicket,
        deleteTicket,
        getTicketStats,
        setCurrentTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export default TicketContext;
