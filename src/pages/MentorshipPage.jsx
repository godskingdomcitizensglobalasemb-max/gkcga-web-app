// src/pages/MentorshipPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const MentorshipPage = () => {
  const { isAuthenticated } = useAuth();

  const mentors = [
    { id: 1, name: 'John Doe', sphere: 'Software Development', experience: '10+ years', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Smith', sphere: 'Digital Marketing', experience: '8 years', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Peter Jones', sphere: 'Leadership', experience: '15 years', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Mary Johnson', sphere: 'Content Creation', experience: '7 years', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Mentorship Program</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connect with industry experts who will guide your journey
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
              <p className="text-blue-800 mb-4">Please login to connect with mentors</p>
              <Button variant="primary" onClick={() => window.location.href = '/auth/login'}>
                Login to Access Mentorship
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(mentor => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={mentor.image} alt={mentor.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{mentor.name}</h3>
                  <p className="text-blue-600 mb-2">{mentor.sphere}</p>
                  <p className="text-gray-600 mb-4">Experience: {mentor.experience}</p>
                  <Button 
                    variant="outline" 
                    fullWidth
                    disabled={!isAuthenticated}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipPage;