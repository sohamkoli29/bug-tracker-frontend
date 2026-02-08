import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;


  // Get config with token
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Get all projects
  const getProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, getConfig());
      setProjects(data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch projects',
      };
    }
  };

  // Get single project
  const getProject = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/${id}`, getConfig());
      setCurrentProject(data);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch project',
      };
    }
  };

  // Create project
  const createProject = async (projectData) => {
    try {
      const { data } = await axios.post(API_URL, projectData, getConfig());
      setProjects([data, ...projects]);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create project',
      };
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, projectData, getConfig());
      setProjects(projects.map((p) => (p._id === id ? data : p)));
      if (currentProject?._id === id) {
        setCurrentProject(data);
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update project',
      };
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      setProjects(projects.filter((p) => p._id !== id));
      if (currentProject?._id === id) {
        setCurrentProject(null);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project',
      };
    }
  };

  // Add team member
  const addTeamMember = async (projectId, memberData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/${projectId}/members`,
        memberData,
        getConfig()
      );
      setProjects(projects.map((p) => (p._id === projectId ? data : p)));
      if (currentProject?._id === projectId) {
        setCurrentProject(data);
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add team member',
      };
    }
  };

  // Remove team member
  const removeTeamMember = async (projectId, memberId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/${projectId}/members/${memberId}`,
        getConfig()
      );
      setProjects(projects.map((p) => (p._id === projectId ? data : p)));
      if (currentProject?._id === projectId) {
        setCurrentProject(data);
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove team member',
      };
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        addTeamMember,
        removeTeamMember,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;