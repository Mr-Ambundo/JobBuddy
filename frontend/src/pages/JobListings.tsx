import React, { useState } from 'react';
import { Plus, Briefcase, Filter, Users, X, Download, ExternalLink } from 'lucide-react';
import JobForm from '../components/JobForm';
import JobApplicationForm from '../components/JobApplicationForm';
import { useAuth } from '../contexts/authContext';

// Sample static job data
const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'NAnyuki, KE',
    description: 'We are looking for a skilled frontend developer with experience in React, TypeScript, and modern CSS frameworks.',
    requirements: ['React', 'TypeScript', 'CSS'],
    postedDate: '2025-04-15T00:00:00Z',
    applicants: 12,
    isPWDFriendly: true,
    creatorId: 'user123'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'Remote',
    description: 'Join our team to build scalable backend solutions using Node.js and MongoDB.',
    requirements: ['Node.js', 'MongoDB', 'Express'],
    postedDate: '2025-04-20T00:00:00Z',
    applicants: 8,
    isPWDFriendly: false,
    creatorId: 'user456'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'CreativeStudio',
    location: 'Kisumu, KE',
    description: 'Help us create intuitive and beautiful user experiences for our products.',
    requirements: ['Figma', 'UI/UX', 'User Research'],
    postedDate: '2025-04-25T00:00:00Z',
    applicants: 5,
    isPWDFriendly: true,
    creatorId: 'user123'
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Kakamega, KE',
    description: 'Looking for an experienced data scientist to help us extract insights from large datasets and build predictive models.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    postedDate: '2025-04-28T00:00:00Z',
    applicants: 14,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudSolutions',
    location: 'Eldoret, KE',
    description: 'Join our team to build and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    postedDate: '2025-04-22T00:00:00Z',
    applicants: 7,
    isPWDFriendly: false,
    creatorId: 'user123'
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Naivasha, KE',
    description: 'Lead product development initiatives, gather requirements, and coordinate between development, design, and business teams.',
    requirements: ['Product Management', 'Agile', 'User Stories', 'Market Research'],
    postedDate: '2025-04-18T00:00:00Z',
    applicants: 22,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '7',
    title: 'Mobile Developer (iOS)',
    company: 'AppWorks',
    location: 'Momabasa, KE',
    description: 'Build and maintain native iOS applications with a focus on performance and user experience.',
    requirements: ['Swift', 'iOS', 'UIKit', 'SwiftUI'],
    postedDate: '2025-04-10T00:00:00Z',
    applicants: 9,
    isPWDFriendly: false,
    creatorId: 'user123'
  },
  {
    id: '8',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    description: 'Join our team to work on both frontend and backend aspects of our web applications, from database to user interface.',
    requirements: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    postedDate: '2025-04-05T00:00:00Z',
    applicants: 18,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '9',
    title: 'Technical Writer',
    company: 'DocuTech',
    location: 'Remote',
    description: 'Create clear, concise documentation for software products, APIs, and developer tools.',
    requirements: ['Technical Writing', 'Markdown', 'API Documentation', 'English Proficiency'],
    postedDate: '2025-04-12T00:00:00Z',
    applicants: 6,
    isPWDFriendly: true,
    creatorId: 'user123'
  },
  {
    id: '10',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'REmote',
    description: 'Monitor and protect our systems and data from security threats. Perform security assessments and recommend improvements.',
    requirements: ['Network Security', 'Penetration Testing', 'SIEM', 'Security Certifications'],
    postedDate: '2025-04-17T00:00:00Z',
    applicants: 11,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '11',
    title: 'Database Administrator',
    company: 'DataCore',
    location: 'Denver, CO',
    description: 'Manage, optimize, and secure our database systems. Ensure high performance and availability of production databases.',
    requirements: ['SQL', 'PostgreSQL', 'Database Optimization', 'Backup & Recovery'],
    postedDate: '2025-04-08T00:00:00Z',
    applicants: 5,
    isPWDFriendly: false,
    creatorId: 'user123'
  },
  {
    id: '12',
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Momabasa, KE',
    description: 'Design and implement test plans, automated tests, and quality assurance processes for our software products.',
    requirements: ['Selenium', 'Test Automation', 'QA Methodologies', 'JIRA'],
    postedDate: '2025-04-21T00:00:00Z',
    applicants: 10,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '13',
    title: 'Blockchain Developer',
    company: 'ChainInnovate',
    location: 'Nakuru, KE',
    description: 'Develop and implement blockchain solutions for our finance and supply chain applications.',
    requirements: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'],
    postedDate: '2025-04-19T00:00:00Z',
    applicants: 4,
    isPWDFriendly: false,
    creatorId: 'user123'
  },
  {
    id: '14',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'NAirobi, KE',
    description: 'Design and implement machine learning models and algorithms for our product suite. Work with large datasets and deploy models to production.',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'ML Ops'],
    postedDate: '2025-04-16T00:00:00Z',
    applicants: 15,
    isPWDFriendly: true,
    creatorId: 'user456'
  },
  {
    id: '15',
    title: 'Project Manager',
    company: 'ProjectMasters',
    location: 'Nairobi, KE',
    description: 'Lead software development projects from planning to delivery. Manage timelines, resources, and stakeholder communication.',
    requirements: ['Project Management', 'Agile', 'Scrum', 'MS Project'],
    postedDate: '2025-04-14T00:00:00Z',
    applicants: 19,
    isPWDFriendly: true,
    creatorId: 'user123'
  },
  {
    id: '16',
    title: 'Systems Analyst',
    company: 'SysTech',
    location: 'Mombasa, KE',
    description: 'Analyze business requirements and translate them into technical specifications. Design and improve system processes and workflows.',
    requirements: ['Business Analysis', 'Systems Design', 'UML', 'Process Modeling'],
    postedDate: '2025-04-23T00:00:00Z',
    applicants: 8,
    isPWDFriendly: false,
    creatorId: 'user456'
  },
  {
    id: '17',
    title: 'AR/VR Developer',
    company: 'ImmerseTech',
    location: 'Kisumu, KE',
    description: 'Create immersive augmented reality and virtual reality experiences for our entertainment and training applications.',
    requirements: ['Unity', 'AR Kit', 'VR Development', '3D Modeling'],
    postedDate: '2025-04-09T00:00:00Z',
    applicants: 7,
    isPWDFriendly: true,
    creatorId: 'user123'
  },
  {
    id: '18',
    title: 'Technical Support Specialist',
    company: 'SupportHub',
    location: 'Phoenix, AZ',
    description: 'Provide technical assistance to our customers. Troubleshoot issues, document solutions, and improve our support processes.',
    requirements: ['Customer Service', 'Troubleshooting', 'Communication Skills', 'Support Ticketing Systems'],
    postedDate: '2025-04-27T00:00:00Z',
    applicants: 13,
    isPWDFriendly: true,
    creatorId: 'user456'
  }
];

// Sample static applications data
const SAMPLE_APPLICATIONS = [
  {
    id: 'app1',
    userId: 'user789',
    appliedDate: '2025-04-26T10:30:00Z',
    status: 'pending',
    user: {
      name: 'Sami Ambundo',
      email: 'samie@gmail.com',
      portfolioUrl: 'https://johndoe.portfolio.com'
    }
  },
  {
    id: 'app2',
    userId: 'user101',
    appliedDate: '2025-04-27T15:45:00Z',
    status: 'accepted',
    user: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      portfolioUrl: null
    }
  }
];

export default function JobListings() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [applyingToJob, setApplyingToJob] = useState(null);
  const [viewingApplicationsForJob, setViewingApplicationsForJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    isPWDFriendly: false,
    skills: []
  });
  const [error, setError] = useState(null);
  const [applicationError, setApplicationError] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // Get user role from auth context
  const { user } = useAuth();
  
  // Check if user has employer privileges
  const isEmployer = user?.role === 'employer';
  const isJobSeeker = user?.role === 'jobseeker';

  // Add a check to see if the current user is the job creator
  const isJobCreator = (job) => {
    return user?.id === job.creatorId;
  };

  // Effect to clear success message after 5 seconds
  React.useEffect(() => {
    if (applicationSuccess) {
      const timer = setTimeout(() => {
        setApplicationSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationSuccess]);

  const handleSubmit = (job) => {
    // Return early if not an employer
    if (!isEmployer) {
      setError("You don't have permission to perform this action");
      return;
    }

    // If editing, check ownership
    if (editingJob && !isJobCreator(editingJob)) {
      setError("You can only edit job listings that you've created");
      return;
    }

    if (editingJob) {
      // Update existing job in state
      setJobs(prevJobs => 
        prevJobs.map(j => j.id === editingJob.id ? {...job, id: editingJob.id} : j)
      );
    } else {
      // Add new job to state
      const newJob = {
        ...job,
        id: `job${Date.now()}`,
        postedDate: new Date().toISOString(),
        applicants: 0,
        creatorId: user?.id
      };
      setJobs(prevJobs => [...prevJobs, newJob]);
    }

    setShowForm(false);
    setEditingJob(null);
  };

  const handleEdit = (job) => {
    // First check if user is an employer
    if (!isEmployer) {
      setError("You don't have permission to edit job listings");
      return;
    }

    // Then check if they are the creator of this specific job
    if (!isJobCreator(job)) {
      setError("You can only edit job listings that you've created");
      return;
    }

    setEditingJob(job);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = (id) => {
    // Find the job to check ownership
    const jobToDelete = jobs.find(job => job.id === id);

    // First check if user is an employer
    if (!isEmployer) {
      setError("You don't have permission to delete job listings");
      return;
    }

    // Then check if they are the creator of this specific job
    if (!jobToDelete || !isJobCreator(jobToDelete)) {
      setError("You can only delete job listings that you've created");
      return;
    }

    if (window.confirm('Are you sure you want to remove this job listing?')) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    }
  };

  const handleViewApplications = (jobId) => {
    // Find the job to check ownership
    const jobToView = jobs.find(job => job.id === jobId);

    // Check if user is an employer
    if (!isEmployer) {
      setError("You don't have permission to view applications");
      return;
    }

    // Check if they are the creator of this specific job
    if (!jobToView || !isJobCreator(jobToView)) {
      setError("You can only view applications for job listings that you've created");
      return;
    }

    setViewingApplicationsForJob(jobId);
    // Use sample applications data instead of fetching
    setApplications(SAMPLE_APPLICATIONS);
  };

  const handleDownloadResume = (userId, userName) => {
    // Only employers should be able to download resumes
    if (!isEmployer) {
      alert("You don't have permission to download resumes");
      return;
    }

    // Mock downloading a resume
    alert(`Downloading resume for ${userName}`);
  };

  const handleUpdateApplicationStatus = (applicationId, status) => {
    // Only employers should be able to update application status
    if (!isEmployer) {
      alert("You don't have permission to update application status");
      return;
    }

    // Check if the current job is owned by this employer
    const currentJob = jobs.find(job => job.id === viewingApplicationsForJob);
    if (!currentJob || !isJobCreator(currentJob)) {
      alert("You can only update applications for job listings that you've created");
      return;
    }

    // Update the local applications state
    setApplications(prevApplications =>
      prevApplications.map(app =>
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  const handleApplyForJob = (job) => {
    // Check if user is logged in and is a job seeker
    if (!user) {
      setError("You need to be logged in to apply for jobs");
      return;
    }


    setApplyingToJob(job);
  };

  const handleApplicationSuccess = () => {
    setApplicationSuccess("Your application has been submitted successfully!");

    // Update the job's applicant count
    if (applyingToJob) {
      const updatedJob = {
        ...applyingToJob,
        applicants: (applyingToJob.applicants || 0) + 1
      };
      
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
    }
    
    setApplyingToJob(null);
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.location && job.location !== filters.location) return false;
    if (filters.isPWDFriendly && !job.isPWDFriendly) return false;
    if (filters.skills.length > 0 && !filters.skills.some(skill => job.requirements.includes(skill))) return false;
    return true;
  });

  const currentJob = viewingApplicationsForJob ? jobs.find(job => job.id === viewingApplicationsForJob) : null;

  // If showing the form, render the JobForm component
  if (showForm) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <JobForm
          onSubmit={handleSubmit}
          initialData={editingJob || undefined}
          error={error}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
            setError(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {applicationSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {applicationSuccess}
        </div>
      )}

      {/* Application Form Modal */}
      {applyingToJob && (
        <JobApplicationForm
          job={applyingToJob}
          onClose={() => setApplyingToJob(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Applications Modal */}
      {viewingApplicationsForJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Applications for {currentJob?.title}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {applications.length} applicant{applications.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <button
                onClick={() => setViewingApplicationsForJob(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-grow">
              {applicationError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {applicationError}
                </div>
              )}

              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">No applications received for this job yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {application.user.name
                                    ? application.user.name.charAt(0).toUpperCase()
                                    : application.user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {application.user.name || 'Anonymous User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {application.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={application.status}
                              onChange={(e) => handleUpdateApplicationStatus(
                                application.id,
                                e.target.value
                              )}
                              className={`px-2 py-1 text-sm rounded-full ${
                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleDownloadResume(
                                application.userId,
                                application.user.name || "User"
                              )}
                              className="inline-flex items-center text-blue-600 hover:text-blue-900"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Resume
                            </button>
                            {application.user.portfolioUrl && (
                              <a
                                href={application.user.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-900 ml-3"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Portfolio
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setViewingApplicationsForJob(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          {/* Only show Post New Job button for employers */}
          {isEmployer && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>{filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found</p>
        <div className="flex items-center">
          <span>Sort by: </span>
          <select className="ml-2 border-none bg-transparent">
            <option>Newest</option>
            <option>Most Relevant</option>
            <option>Most Applicants</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {jobs.length === 0 ? "No jobs posted" : "No jobs match your filters"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {jobs.length === 0
                ? isEmployer ? "Get started by posting a new job." : "No job listings available at the moment."
                : "Try adjusting your filters to see more results."}
            </p>
            {jobs.length === 0 && isEmployer && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Post New Job
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                  <div className="mt-1 flex items-center justify-end text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{job.applicants || 0} applicants</span>
                  </div>
                  {job.isPWDFriendly && (
                    <span className="mt-2 inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      PWD Friendly
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-gray-600">{job.description}</p>
              <div className="mt-4 flex justify-end space-x-3">
                {/* Show different buttons based on user role AND job ownership */}
                {isEmployer && isJobCreator(job) ? (
                  // Employer who created the job gets full access
                  <>
                    <button
                      onClick={() => handleViewApplications(job.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      View Applications
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </>
                ) : isEmployer ? (
                  // Employer who did NOT create the job can only see basic info
                  <div className="text-sm text-gray-500 italic">
                    This job was posted by another employer
                  </div>
                ) : (
                  // Job seekers see apply button
                  <button
                    onClick={() => handleApplyForJob(job)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}