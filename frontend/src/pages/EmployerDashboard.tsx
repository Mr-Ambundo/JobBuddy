import React, { useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { Users, Briefcase, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext'; // Adjust if your path is different

export default function EmployerDashboard() {
  const [applications, setApplications] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications'); // Replace with your endpoint
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const totalApplications = applications.length;
  const pwdApplications = applications.filter(app => app.isPWD).length;
  const activeJobs = 8; // Replace with dynamic data if you have it later

  if (loading || !user) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="w-10 h-10 text-blue-500" />} label="Total Applications" value={totalApplications} />
        <StatCard icon={<Briefcase className="w-10 h-10 text-green-500" />} label="Active Jobs" value={activeJobs} />
        <StatCard icon={<AlertCircle className="w-10 h-10 text-purple-500" />} label="PWD Applications" value={pwdApplications} />
      </div>

      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Skills</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">PWD</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((applicant) => (
                  <tr key={applicant.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{applicant.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        {applicant.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {applicant.isPWD && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Yes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    {icon}
    <div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  </div>
);
