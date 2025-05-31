import React from 'react';
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import {useAuth, AuthProvider} from './contexts/authContext';
import { RoleProtectedRoute } from './components/ProtectedRoute';
import { JobProvider } from './contexts/JobContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import MentorDashboard from './pages/MentorDashboard';
//import EmployerProfile from './pages/EmployerProfile';
//import JobSeekerProfile from './pages/JobSeekerProfile';
//import MentorProfile from './pages/MentorProfile';
import JobListings from './pages/JobListings';
import MenteesList from './pages/MenteesList';
import Settings from './pages/Settings';

function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
      <JobProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/jobs" element={<JobListings />} />

            <Route element={<RoleProtectedRoute allowedRoles={['jobSeeker']} />}>
            <Route path="/jobseeker/*" element={<DashboardLayout><JobSeekerDashboard /></DashboardLayout>} />
            
            <Route path="/jobseeker/jobs" element={<JobListings />} />
            <Route path="/jobseeker/mentors" element={<JobListings />} />
            <Route path="/jobseeker/settings" element={<DashboardLayout><Settings/></DashboardLayout>} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={['employer']} />}>
            <Route path="/employer/*" element={<DashboardLayout><EmployerDashboard /></DashboardLayout>} />
            
            <Route path="/employer/jobs" element={<DashboardLayout><JobListings /></DashboardLayout>} />
            <Route path="/employer/settings" element={<DashboardLayout><Settings/></DashboardLayout>} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={['mentor']} />}>
            <Route path="/mentor/*" element={<DashboardLayout><MentorDashboard /></DashboardLayout>} />
            
            <Route path="/mentor/mentees" element={<DashboardLayout><MenteesList /></DashboardLayout>} />
            <Route path="/mentor/settings" element={<DashboardLayout><Settings/></DashboardLayout>} />
            </Route>

             {/* Redirect root to appropriate dashboard based on role */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </JobProvider>
    </BrowserRouter>
    </AuthProvider>
    
  );
}

// Component to redirect based on user role
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  switch(user.role) {
    case 'jobSeeker':
      return <Navigate to="/jobseeker" />;
    case 'employer':
      return <Navigate to="/employer" />;
    case 'mentor':
      return <Navigate to="/mentor" />;
    default:
      return <Navigate to="/login" />;
  }
}
export default App;