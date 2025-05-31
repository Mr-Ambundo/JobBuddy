// src/contexts/JobContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from '../types';
import { useAuth } from './authContext';

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: Omit<Job, 'id'>) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  removeJob: (id: string) => Promise<void>;
  fetchJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth(); // Get token directly from auth context

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  // Helper function to get the auth token
  const getAuthToken = () => {
    // First try to get token from auth context (preferred)
    if (token) {
      return token;
    }
    // Fall back to localStorage if context doesn't have it
    return localStorage.getItem('authToken');
  };

  const fetchJobs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (job: Omit<Job, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      console.log('Sending with token:', authToken);
      
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(job),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(prevJobs => [data.job || data, ...prevJobs]);
    } catch (err) {
      setError('Failed to add job');
      console.error('Error adding job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: string, updatedJob: Partial<Job>) => {
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedJob),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === id ? { ...job, ...(data.job || data) } : job)
      );
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to remove job');
      console.error('Error removing job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    jobs,
    loading,
    error,
    addJob,
    updateJob,
    removeJob,
    fetchJobs
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};