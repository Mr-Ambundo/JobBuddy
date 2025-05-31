import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JobApplication } from '../types';
import { useAuth } from './authContext';

interface ApplicationContextType {
  applications: JobApplication[];
  applyForJob: (jobId: string, coverLetter: string, resume: File) => Promise<boolean>;
  isApplying: boolean;
  error: string | null;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const applyForJob = async (jobId: string, coverLetter: string, resume: File): Promise<boolean> => {
    if (!token) {
      setError("Authentication required. Please log in to apply for jobs.");
      return false;
    }

    setIsApplying(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to submit application. Status: ${response.status}`);
      }

      const newApplication = await response.json();
      setApplications(prev => [...prev, newApplication]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error applying for job:', err);
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  const value = {
    applications,
    applyForJob,
    isApplying,
    error
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};