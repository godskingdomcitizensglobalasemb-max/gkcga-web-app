// src/pages/PillarsPage.jsx
import React, { useState } from 'react';
import PillarsVisualization from '../components/home/PillarsVisualization';

const PillarsPage = () => {
  const pillars = [
    {
      id: 1,
      name: 'Digital & Tech Dominion',
      color: 'blue',
      spheres: [
        'AI & Prompt Engineering',
        'Software & Web Development',
        'Data Analysis',
        'Digital Marketing'
      ]
    },
    {
      id: 2,
      name: 'Media, Creativity & Influence',
      color: 'purple',
      spheres: [
        'Video Editing & Content Creation',
        'Graphic Design & Branding',
        'Photography & Creative Direction',
        'Public Speaking & Personal Branding'
      ]
    },
    {
      id: 3,
      name: 'Leadership, Strategy & Finance',
      color: 'yellow',
      spheres: [
        'Leadership & Strategic Thinking',
        'Entrepreneurship & Branding'
      ]
    },
    {
      id: 4,
      name: 'Craft, Culture & Commerce',
      color: 'green',
      spheres: [
        'Fashion Designing & Styling',
        'Interior Decoration'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">The 4 Pillars of Dominance</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover your path to influence across 13 Spheres of Secular Influence
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PillarsVisualization />
          
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {pillars.map(pillar => (
              <div key={pillar.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className={`text-2xl font-bold mb-4 text-${pillar.color}-600`}>
                  {pillar.name}
                </h3>
                <ul className="space-y-2">
                  {pillar.spheres.map(sphere => (
                    <li key={sphere} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {sphere}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PillarsPage;