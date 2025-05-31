import React, { createContext, useContext, useEffect, useState } from 'react';

interface MentorshipApplication {
  id: string;
  userId: string;
  mentorId: string;
  status: 'under review' | 'accepted' | 'rejected';
  createdAt: string;
}

interface MentorshipContextType {
  applications: MentorshipApplication[];
  error: string | null;
  acceptApplication: (id: string) => Promise<void>;
  declineApplication: (id: string) => Promise<void>;
  addApplication: (mentorId: string) => Promise<void>;
}

const MentorshipContext = createContext<MentorshipContextType | undefined>(undefined);

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error('useMentorship must be used within a MentorshipProvider');
  }
  return context;
};

export const MentorshipProvider: React.FC<{ user: { id: string } | null }> = ({ user, children }) => {
  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchApplications = async (controller?: AbortController) => {
    if (!token) {
      setError('User is not authenticated');
      return;
    }

    try {
      const res = await fetch('/api/mentorship-applications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller?.signal,
      });

      if (!res.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await res.json();
      setApplications(data);
      setError(null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch applications');
        console.error('Error fetching applications:', err);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      fetchApplications(controller);
    }
    return () => controller.abort();
  }, [user]);

  const acceptApplication = async (id: string) => {
    if (!token) {
      setError('User is not authenticated');
      return;
    }

    try {
      const res = await fetch(`/api/mentorship-applications/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to accept application');
      }

      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'accepted' } : app
        )
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to accept application');
      console.error('Error accepting application:', err);
    }
  };

  const declineApplication = async (id: string) => {
    if (!token) {
      setError('User is not authenticated');
      return;
    }

    try {
      const res = await fetch(`/api/mentorship-applications/${id}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to decline application');
      }

      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'rejected' } : app
        )
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to decline application');
      console.error('Error declining application:', err);
    }
  };

  const addApplication = async (mentorId: string) => {
    if (!token || !user) {
      setError('User is not authenticated');
      return;
    }

    try {
      const res = await fetch('/api/mentorship-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mentorId }),
      });

      if (!res.ok) {
        throw new Error('Failed to create application');
      }

      const newApplication: MentorshipApplication = {
        id: self.crypto?.randomUUID?.() || Math.random().toString(36).substr(2, 9),
        userId: user.id,
        mentorId,
        status: 'under review',
        createdAt: new Date().toISOString(),
      };

      setApplications(prev => [...prev, newApplication]);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create application');
      console.error('Error creating application:', err);
    }
  };

  return (
    <MentorshipContext.Provider value={{ applications, error, acceptApplication, declineApplication, addApplication }}>
      {children}
    </MentorshipContext.Provider>
  );
};
