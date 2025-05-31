import React, { useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { Building, Mail, Phone, MapPin } from 'lucide-react';
import { AuthContext } from '../contexts/authContext'; // Assuming you have an AuthContext for token/user info

export default function EmployerProfile() {
  const { user, token } = useContext(AuthContext); // 👈 get the logged-in user and token
  const [employer, setEmployer] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/users/${user?.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        const data = await response.json();
        setEmployer(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    };

    fetchEmployerData();
  }, [token, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!formData || !token) return;
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user?.userId}`, // 👈 Use your actual endpoint
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (!response.ok) throw new Error('Failed to save changes');
  
      const updatedEmployer = await response.json();
      
      // Update both employer (display) and formData (edit) states
      setEmployer(updatedEmployer);
      setFormData(updatedEmployer);
      setEditMode(false);
      
      console.log('Changes saved successfully!');
      // Optionally: Show a success toast (e.g., using react-toastify)
    } catch (error) {
      console.error('Error saving changes:', error);
      // Optionally: Show an error toast
    }
  };
  
  if (!employer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={employer.profileImage}
              alt={employer.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{employer.name}</h1>
              <p className="text-gray-600 mt-1">{employer.position}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Building className="w-5 h-5 mr-2" />
                  {employer.company}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {employer.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {employer.contactNumber}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {employer.location}
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
                placeholder="Company Name"
              />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Position"
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Company"
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
                value={formData.contactNumber}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Contact Number"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Location"
              />
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-4 border rounded-lg p-2 w-full"
              placeholder="Company Bio"
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
          <h2 className="text-xl font-semibold mb-4">About Company</h2>
          <p className="text-gray-600">{employer.bio}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Company Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-gray-600">Active Job Listings</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-gray-600">Total Applications</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">42</div>
              <div className="text-gray-600">Positions Filled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
