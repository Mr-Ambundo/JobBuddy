import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Briefcase, Mail, Phone, MapPin, Users, Star, Award } from 'lucide-react';
import { useAuth } from '../contexts/authContext'; // Import the same auth hook used in navbar

export default function MentorProfile() {
  const { user, token } = useAuth(); // Use the auth hook to get user and token
  const [mentor, setMentor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchMentorData = async () => {
      if (!token || !user) {
        setLoading(false);
        setError("Authentication required");
        return;
      }

      try {
        setLoading(true);
        // Use the same API endpoint pattern as expected by your backend
        const response = await fetch(`http://localhost:5000/api/users/${user?.userid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        console.log(response);
        const data = await response.json();
        setMentor(data);
        setFormData(data);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [token, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim());
    setFormData(prev => prev ? { ...prev, skills: skillsArray } : null);
  };
  
  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const experienceString = e.target.value;
    const experienceArray = experienceString.split('\n').filter(exp => exp.trim() !== '');
    setFormData(prev => prev ? { ...prev, experience: experienceArray } : null);
  };
  
  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specializationString = e.target.value;
    const specializationArray = specializationString.split(',').map(spec => spec.trim());
    setFormData(prev => prev ? { ...prev, specialization: specializationArray } : null);
  };

  const handleSave = async () => {
    if (!formData || !token || !user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedMentor = await response.json();
      setMentor(updatedMentor);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving mentor data:', error);
      setError("Failed to save profile data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice: </strong>
        <span className="block sm:inline">Profile data not found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={mentor.profilePicture || '/default-avatar.png'}
              alt={mentor.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
              <p className="text-gray-600 mt-1">{mentor.profession}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {mentor.email}
                </div>
                {mentor.contactNumber && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    {mentor.contactNumber}
                  </div>
                )}
                {mentor.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    {mentor.location}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditMode(prev => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {editMode && formData && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Full Name"
              />
              <input
                type="text"
                name="profession"
                value={formData.profession || ''}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Profession"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Email"
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber || ''}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Contact Number"
              />
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Location"
              />
              <input
                type="number"
                name="menteeCapacity"
                value={formData.menteeCapacity || 0}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Mentee Capacity"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills?.join(', ') || ''}
                onChange={handleSkillChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Leadership, Frontend Development, etc."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization (comma separated)</label>
              <input
                type="text"
                value={formData.specialization?.join(', ') || ''}
                onChange={handleSpecializationChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Web Development, Career Transition, etc."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (one per line)</label>
              <textarea
                value={formData.experience?.join('\n') || ''}
                onChange={handleExperienceChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Technical Lead at Enterprise Solutions (2018-Present)"
                rows={4}
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Tell us about yourself and your mentoring experience"
                rows={4}
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Active Mentees</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{mentor.activeMentees || 0}</p>
            <p className="text-sm text-gray-600">Capacity: {mentor.menteeCapacity || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Mentorship Rating</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{mentor.rating?.toFixed(1) || 'N/A'}</p>
            <p className="text-sm text-gray-600">From {mentor.reviewCount || 0} reviews</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Success Rate</h3>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{mentor.successRate ? `${mentor.successRate}%` : 'N/A'}</p>
            <p className="text-sm text-gray-600">Career advancement rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            {mentor.experience && mentor.experience.length > 0 ? (
              <div className="space-y-4">
                {mentor.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <p className="text-gray-800">{exp}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No experience information available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Specialization</h2>
            {mentor.specialization && mentor.specialization.length > 0 ? (
              <div className="space-y-2">
                {mentor.specialization.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specialization information available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
          {mentor.skills && mentor.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills information available</p>
          )}
        </div>
      </div>
    </div>
  );
}