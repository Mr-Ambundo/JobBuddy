import React, { useContext, useEffect, useState } from 'react';
import { Briefcase, UserCheck, BookOpen, Search } from 'lucide-react';
import { AuthContext } from '../contexts/authContext';
import { Job, Mentor, User } from '../types';
import { useNavigate } from 'react-router-dom';

export default function JobSeekerDashboard() {
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [jobSeekerProfile, setJobSeekerProfile] = useState<User | null>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [suggestedMentors, setSuggestedMentors] = useState<Mentor[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);

  // API base URL - adjust if needed
  const API_BASE_URL = '/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job seeker profile');
        }

        const data = await response.json();
        setJobSeekerProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchSuggestedJobs = async () => {
      try {
        // Note: You might need to create this endpoint in your backend
        const response = await fetch(`${API_BASE_URL}/jobs/suggested`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggested jobs');
        }

        const data = await response.json();
        setSuggestedJobs(data);
      } catch (error) {
        console.error('Error fetching suggested jobs:', error);
        // Fallback to showing all jobs if suggested endpoint fails
        fetchAllJobs();
      }
    };

    const fetchSuggestedMentors = async () => {
      try {
        // Note: You might need to create this endpoint in your backend
        const response = await fetch(`${API_BASE_URL}/mentors/suggested`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggested mentors');
        }

        const data = await response.json();
        setSuggestedMentors(data);
      } catch (error) {
        console.error('Error fetching suggested mentors:', error);
        // Set empty array if endpoint fails
        setSuggestedMentors([]);
      }
    };

    const fetchAllJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch all jobs');
        }

        const data = await response.json();
        setAllJobs(data);
      } catch (error) {
        console.error('Error fetching all jobs:', error);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      if (user?.id && token) {
        await Promise.all([
          fetchProfile(),
          fetchSuggestedJobs(),
          fetchSuggestedMentors(),
          fetchAllJobs()
        ]);
      }
      setLoading(false);
    };

    fetchAllData();
  }, [user?.id, token]);

  const handleJobSelect = async (jobId: string) => {
    if (jobId === selectedJobId) {
      setSelectedJobId(null);
      setJobDetails(null);
      return;
    }
    
    setSelectedJobId(jobId);
    setJobDetailsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      setJobDetails(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setJobDetailsLoading(false);
    }
  };

  const applyForJob = async (jobId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply for job');
      }

      alert('Successfully applied for job!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    }
  };

  // Helper function to get job ID consistently
  const getJobId = (job: Job) => job._id || job.id;
  
  // Extract employer name safely
  const getEmployerName = (job: Job) => {
    return job.company || 'Unknown Company';
  };

  // Filter jobs based on search term and category
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Recently posted';
    }
  };

  if (loading || !user) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}!</h1>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeSection === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('jobs')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeSection === 'jobs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Jobs
          </button>
        </nav>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<Briefcase className="w-10 h-10 text-blue-500" />} label="Applications" value={jobSeekerProfile?.applications?.length || 0} />
            <StatCard icon={<UserCheck className="w-10 h-10 text-green-500" />} label="Mentor Sessions" value={jobSeekerProfile?.mentorSessions?.length || 0} />
            <StatCard icon={<BookOpen className="w-10 h-10 text-purple-500" />} label="Skills" value={jobSeekerProfile?.skills?.length || 0} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Suggested Jobs</h2>
                {suggestedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedJobs.map((job) => (
                      <div key={getJobId(job)} className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-gray-500">
                              {getEmployerName(job)} - {job.location}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">{job.description}</p>
                          </div>
                          {job.isPWDFriendly && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              PWD Friendly
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No suggested jobs available at the moment.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Suggested Mentors</h2>
                {suggestedMentors.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedMentors.map((mentor) => (
                      <div key={mentor.id} className="border rounded-lg p-4 hover:border-purple-500 cursor-pointer">
                        <div>
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-gray-500">{mentor.profession}</p>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {mentor.expertise?.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No suggested mentors available at the moment.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Jobs Section */}
      {activeSection === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold">Available Jobs</h2>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="relative w-full md:w-auto">
                <input 
                  type="search" 
                  placeholder="Search jobs..." 
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select 
                className="px-4 py-2 border rounded-lg w-full md:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="tech">Technology</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {filteredJobs.length > 0 ? (
              <div className="divide-y">
                {filteredJobs.map((job) => (
                  <div 
                    key={getJobId(job)} 
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${selectedJobId === getJobId(job) ? 'border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleJobSelect(getJobId(job))}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">
                          {getEmployerName(job)} - {job.location}
                        </p>
                        
                        <div className="flex gap-2 mt-2">
                          {job.category && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {job.category}
                            </span>
                          )}
                          {job.salaryRange && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {job.salaryRange}
                            </span>
                          )}
                          {job.isPWDFriendly && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              PWD Friendly
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-3">{job.description}</p>
                        
                        {selectedJobId === getJobId(job) && (
                          <div className="mt-4 space-y-3">
                            {jobDetailsLoading ? (
                              <div className="text-center py-4">Loading job details...</div>
                            ) : (
                              <>
                                <h4 className="font-medium">Requirements:</h4>
                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                  {jobDetails?.requirements?.length > 0 ? (
                                    jobDetails.requirements.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))
                                  ) : (
                                    <li>No specific requirements listed</li>
                                  )}
                                </ul>
                                
                                <div className="flex justify-end mt-4">
                                  <button 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      applyForJob(getJobId(job));
                                    }}
                                  >
                                    Apply Now
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500">
                          {formatDate(job.createdAt || job.postedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No jobs available</h3>
                <p className="text-gray-500">Check back later for new opportunities</p>
              </div>
            )}
          </div>
        </div>
      )}
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