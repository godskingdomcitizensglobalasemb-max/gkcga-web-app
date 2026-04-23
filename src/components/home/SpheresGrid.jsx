// src/components/home/SpheresGrid.jsx
import React from 'react';

const SpheresGrid = () => {
  const spheres = [
    { name: 'AI & Prompt Engineering', pillar: 'Digital & Tech', icon: '🤖' },
    { name: 'Software & Web Development', pillar: 'Digital & Tech', icon: '💻' },
    { name: 'Data Analysis', pillar: 'Digital & Tech', icon: '📊' },
    { name: 'Digital Marketing', pillar: 'Digital & Tech', icon: '📱' },
    { name: 'Video Editing & Content Creation', pillar: 'Media & Creativity', icon: '🎬' },
    { name: 'Graphic Design & Branding', pillar: 'Media & Creativity', icon: '🎨' },
    { name: 'Photography & Creative Direction', pillar: 'Media & Creativity', icon: '📸' },
    { name: 'Public Speaking & Personal Branding', pillar: 'Media & Creativity', icon: '🎤' },
    { name: 'Leadership & Strategic Thinking', pillar: 'Leadership & Finance', icon: '👔' },
    { name: 'Entrepreneurship & Branding', pillar: 'Leadership & Finance', icon: '🚀' },
    { name: 'Fashion Designing & Styling', pillar: 'Craft & Culture', icon: '👗' },
    { name: 'Interior Decoration', pillar: 'Craft & Culture', icon: '🏠' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {spheres.map(sphere => (
        <div
          key={sphere.name}
          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start">
            <span className="text-2xl mr-3">{sphere.icon}</span>
            <div>
              <h3 className="font-semibold">{sphere.name}</h3>
              <p className="text-sm text-gray-600">{sphere.pillar}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpheresGrid;