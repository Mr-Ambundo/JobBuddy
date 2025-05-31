import React, { useState } from 'react';
import { Search, Star, Users, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  totalMentees: number;
  experience: string;
  availability: string;
  imageUrl: string;
  bio: string;
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['Web Development', 'React', 'System Design'],
    rating: 4.9,
    totalMentees: 24,
    experience: '10+ years',
    availability: '5 hours/week',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Passionate about helping others grow in their tech careers. Specialized in frontend development and system architecture.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Microsoft',
    expertise: ['Product Strategy', 'UX Design', 'Agile'],
    rating: 4.8,
    totalMentees: 18,
    experience: '8+ years',
    availability: '3 hours/week',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Helping aspiring product managers navigate their career path and develop essential skills.'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Data Scientist',
    company: 'Amazon',
    expertise: ['Machine Learning', 'Python', 'Data Analysis'],
    rating: 4.7,
    totalMentees: 15,
    experience: '6+ years',
    availability: '4 hours/week',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Dedicated to helping individuals transition into data science and machine learning roles.'
  }
];

const MentorListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  const expertiseAreas = ['All', 'Web Development', 'Product Management', 'Data Science', 'UX Design', 'Machine Learning'];

  const filteredMentors = mockMentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExpertise = !selectedExpertise || 
      selectedExpertise === 'All' || 
      mentor.expertise.includes(selectedExpertise);

    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Mentor</h1>
          <p className="mt-4 text-lg text-gray-600">
            Connect with experienced professionals who can guide you on your career journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, expertise, or role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="block w-full md:w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              <option value="">All Expertise Areas</option>
              {expertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <Link
              to={`/mentors/${mentor.id}`}
              key={mentor.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <img
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{mentor.name}</h2>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                    <p className="text-sm text-gray-500">{mentor.company}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{mentor.rating} rating</span>
                    <span className="mx-2">•</span>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{mentor.totalMentees} mentees</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {mentor.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {mentor.experience}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {mentor.availability}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorListings;