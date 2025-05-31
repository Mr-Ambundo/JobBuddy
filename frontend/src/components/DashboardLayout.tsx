import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Home, Briefcase, Users, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/authContext'; // Assuming you have this store
import {NotificationProvider} from '../contexts/NotificationContext';
import { MentorshipProvider } from '../contexts/MentorshipContext';
import { JobProvider } from '../contexts/JobContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userType = location.pathname.split('/')[1];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <NotificationProvider>
      <MentorshipProvider>
        <JobProvider>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{userType} Dashboard</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link to={`/${userType}`} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Home className="w-5 h-5 mr-3" />
              Overview
            </Link>
            
            {userType === 'employer' && (
              <Link to="/employer/jobs" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Briefcase className="w-5 h-5 mr-3" />
                Job Listings
              </Link>
            )}
            {userType === 'mentor' && (
              <Link to="/mentor/mentees" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 mr-3" />
                Mentees
              </Link>
            )}
            <Link to={`/${userType}/settings`} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
    </JobProvider>
    </MentorshipProvider>
    </NotificationProvider>
  );
}
