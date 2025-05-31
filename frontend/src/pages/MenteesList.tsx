import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Search, Filter, UserPlus, MessageCircle } from 'lucide-react';

// Mock data to replace the dynamic data from context
const initialApplications = [
  {
    id: '1',
    menteeId: '101',
    menteeName: 'Alex Johnson',
    date: new Date('2025-04-15').toISOString(),
    status: 'pending',
    isPWD: false,
    skills: ['JavaScript', 'React', 'UI Design'],
    message: 'I would love to learn more about advanced React patterns and state management. I have been coding for 2 years and want to take my skills to the next level.'
  },
  {
    id: '2',
    menteeId: '102',
    menteeName: 'Taylor Smith',
    date: new Date('2025-04-10').toISOString(),
    status: 'pending',
    isPWD: true,
    skills: ['Python', 'Data Analysis', 'Machine Learning'],
    message: 'Looking for guidance in transitioning from data analysis to machine learning engineering. I have a background in statistics and would appreciate mentorship in practical ML applications.'
  },
  {
    id: '3',
    menteeId: '103',
    menteeName: 'Jordan Rivera',
    date: new Date('2025-04-05').toISOString(),
    status: 'accepted',
    isPWD: false,
    skills: ['Node.js', 'Express', 'MongoDB'],
    message: 'I am building my first full-stack application and would love some guidance on backend architecture and database design best practices.'
  },
  {
    id: '4',
    menteeId: '104',
    menteeName: 'Morgan Lee',
    date: new Date('2025-04-01').toISOString(),
    status: 'pending',
    isPWD: false,
    skills: ['UX Research', 'Figma', 'UI Design'],
    message: 'I want to improve my UX research methodologies and learn how to better incorporate research findings into my design process.'
  },
  {
    id: '5',
    menteeId: '105',
    menteeName: 'Casey Wong',
    date: new Date('2025-03-28').toISOString(),
    status: 'declined',
    isPWD: true,
    skills: ['Java', 'Spring Boot', 'Microservices'],
    message: 'Looking for mentorship in enterprise Java development and microservices architecture. I have 1 year of experience in backend development.'
  },
];

export default function MenteesList() {
  // State for applications with our own implementation instead of context
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    isPWD: false,
    skills: []
  });

  // Mock navigation function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, this would use react-router's navigate
  };

  const acceptApplication = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'accepted' } : app
    ));
  };

  const declineApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const messageApplication = (application) => {
    alert(`Messaging ${application.menteeName}...`);
  };

  const handleAccept = (id) => {
    acceptApplication(id);
    const mentee = applications.find(app => app.id === id);
    alert(`Accepted mentorship application from ${mentee.menteeName}`);
  };

  const handleDecline = (id) => {
    const mentee = applications.find(app => app.id === id);
    const menteeName = mentee.menteeName;
    declineApplication(id);
    alert(`Declined and removed mentorship application from ${menteeName}`);
  };

  const handleMessage = (application) => {
    alert(`Opening chat with ${application.menteeName}...`);
  };

  const viewMenteeProfile = (menteeId) => {
    const mentee = applications.find(app => app.menteeId === menteeId);
    alert(`Viewing profile of ${mentee.menteeName}`);
  };

  const filteredApplications = applications.filter(app => {
    // Search filter
    if (searchTerm && !app.menteeName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && app.status !== filters.status) {
      return false;
    }
    
    // PWD filter
    if (filters.isPWD && !app.isPWD) {
      return false;
    }
    
    // Skills filter
    if (filters.skills.length > 0 && !filters.skills.some(skill => app.skills.includes(skill))) {
      return false;
    }
    
    return true;
  });

  const getStatusCounts = () => {
    const counts = { all: applications.length, pending: 0, accepted: 0, declined: 0 };
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Toggle skill in filters
  const toggleSkillFilter = (skill) => {
    setFilters(prevFilters => {
      const updatedSkills = prevFilters.skills.includes(skill)
        ? prevFilters.skills.filter(s => s !== skill)
        : [...prevFilters.skills, skill];
      
      return { ...prevFilters, skills: updatedSkills };
    });
  };

  // Get all unique skills for filter options
  const allSkills = [...new Set(applications.flatMap(app => app.skills))];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mentee Applications</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/mentor/find-mentees')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Find Mentees
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search mentees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 md:w-auto"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Expanded filter options */}
      {showFilters && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Filters</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isPWD}
                onChange={() => setFilters({...filters, isPWD: !filters.isPWD})}
                className="h-4 w-4 rounded text-blue-600"
              />
              <span className="ml-2">Person with Disability (PWD)</span>
            </label>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.skills.includes(skill)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {(['all', 'pending', 'accepted', 'declined']).map(status => (
            <button
              key={status}
              onClick={() => setFilters({...filters, status})}
              className={`${
                filters.status === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-gray-100">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {applications.length === 0 
                ? "No applications yet" 
                : "No applications match your filters"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {applications.length === 0 
                ? "New mentorship applications will appear here." 
                : "Try adjusting your search or filters to see more results."}
            </p>
            {applications.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/mentor/find-mentees')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Find Mentees
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                        onClick={() => viewMenteeProfile(application.menteeId)}
                      >
                        {application.menteeName}
                      </h2>
                      {application.isPWD && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          PWD
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500">
                      Applied on {new Date(application.date).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{application.message}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleMessage(application)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message
                </button>
                
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(application.id)}
                      className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(application.id)}
                      className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Decline
                    </button>
                  </>
                )}

                {application.status === 'accepted' && (
                  <button
                    onClick={() => alert(`Viewing training progress for ${application.menteeName}...`)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    View Training Progress
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