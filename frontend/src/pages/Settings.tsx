import React, { useState } from 'react';
import { Shield, Mail, Eye, Bell, Lock, Smartphone } from 'lucide-react';

export default function Settings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    jobAlerts: true,
    mentorshipRequests: true,
    messages: true,
    newsletters: false,
  });
  const [visibility, setVisibility] = useState({
    profile: 'public',
    email: 'contacts',
    phone: 'private',
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
          {/* Security Section */}
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Notifications
            </h2>
            <div className="mt-4 space-y-4">
              {Object.entries(emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={(e) => setEmailNotifications(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Visibility */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Privacy & Visibility
            </h2>
            <div className="mt-4 space-y-4">
              {Object.entries(visibility).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium capitalize">{key}</h3>
                  </div>
                  <select
                    value={value}
                    onChange={(e) => setVisibility(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="contacts">Contacts</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Account Status */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold text-red-600">Account Status</h2>
            <div className="mt-4">
              <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}