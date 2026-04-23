// src/pages/SpheresPage.jsx
import React from 'react';
import SpheresGrid from '../components/home/SpheresGrid';

const SpheresPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">13 Spheres of Influence</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find your domain and connect with like-minded Dominion Builders
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpheresGrid />
        </div>
      </section>
    </div>
  );
};

export default SpheresPage;