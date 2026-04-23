// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfilePage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    sphere: user?.sphere || '',
    bio: '',
    website: ''
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification('Profile updated successfully!', 'success');
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl text-blue-600 font-bold">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p>{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {!editing ? (
            <div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profile.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sphere</p>
                  <p className="font-medium">{profile.sphere || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium">{profile.website || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">January 2024</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600">Bio</p>
                <p className="font-medium">{profile.bio || 'No bio provided'}</p>
              </div>

              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
              <Input
                label="Website"
                name="website"
                value={profile.website}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;