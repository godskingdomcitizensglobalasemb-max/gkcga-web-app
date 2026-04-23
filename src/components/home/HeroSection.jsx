// src/components/home/HeroSection.jsx
import React from 'react';
import Button from '../common/Button';

const HeroSection = ({ onInterestClick }) => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Dominion Builders
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          A global movement of kingdom citizens dominating in all 13 spheres of secular influence
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onInterestClick}
            variant="primary"
            size="lg"
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
          >
            I Am Interested
          </Button>
          <Button
            onClick={() => window.location.href = '/pillars'}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900"
          >
            Explore Pillars
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;