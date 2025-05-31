import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/authContext'; // Adjust path if needed
import NotificationCenter from './NotificationCenter'; // Assuming you have this component
import {NotificationProvider} from '../contexts/NotificationContext';


const Navbar = () => {

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  const handleProfileClick = () => {
    if (user?.role === 'employer') {
      navigate('/employer');
    } else if (user?.role === 'mentor') {
      navigate('/mentor');
    } else if (user?.role === 'jobSeeker'){
      // default for normal users like 'youth', 'women', 'pwd'
      navigate('/jobseeker');
    } else{
      console.log(`server error: Input correct role`)
    }
  };

  return (
    <NotificationProvider>
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JobBuddy</span>
            </Link>
            <div className="hidden md:flex md:ml-6 space-x-4">
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Find Jobs
              </Link>
              <Link to="/mentors" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Find Mentors
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="ml-4 flex items-center">
                <NotificationCenter></NotificationCenter>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >

                <div className="ml-4 flex items-center">
                </div>
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                      {user?.name?.[0]}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
    </NotificationProvider>
  );
};


export default Navbar;
