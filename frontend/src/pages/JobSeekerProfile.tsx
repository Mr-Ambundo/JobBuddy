import React, { useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { Briefcase, Mail, Phone, MapPin, GraduationCap, Award } from 'lucide-react';
import { AuthContext } from '../contexts/authContext';

export default function JobSeekerProfile() {
  const { user, token } = useContext(AuthContext);
  const [jobSeeker, setJobSeeker] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/users/${user?.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setJobSeeker(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching job seeker data:', error);
      }
    };

    fetchJobSeekerData();
  }, [token, user?.userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const response = await fetch(`/api/users/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const updatedJobSeeker = await response.json();
        setJobSeeker(updatedJobSeeker);
        setEditMode(false);
        console.log('Saved:', updatedJobSeeker);
      } catch (error) {
        console.error('Error saving job seeker data:', error);
      }
    }
  };

  if (!jobSeeker) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={jobSeeker.profileImage}
              alt={jobSeeker.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{jobSeeker.name}</h1>
              <p className="text-gray-600 mt-1">{jobSeeker.profession}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {jobSeeker.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {jobSeeker.contactNumber}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {jobSeeker.location}
                </div>
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
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Email"
              />
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Profession"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Location"
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Contact Number"
              />
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-4 border rounded-lg p-2 w-full"
              placeholder="Bio"
              rows={4}
            />
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

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <p className="text-gray-600">{jobSeeker.bio}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              {jobSeeker.education?.map((edu, idx) => (
                <li key={idx}>{edu}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Experience
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              {jobSeeker.experience?.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Skills
            </h2>
            <ul className="flex flex-wrap gap-2">
              {jobSeeker.skills?.map((skill, idx) => (
                <li key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
