// src/components/home/PillarsVisualization.jsx
import React, { useState } from 'react';

const PillarsVisualization = () => {
  const [activePillar, setActivePillar] = useState(null);

  const pillars = [
    { id: 1, name: 'Digital & Tech Dominion', color: 'blue', icon: '💻', spheres: 4 },
    { id: 2, name: 'Media, Creativity & Influence', color: 'purple', icon: '🎨', spheres: 4 },
    { id: 3, name: 'Leadership, Strategy & Finance', color: 'yellow', icon: '📊', spheres: 2 },
    { id: 4, name: 'Craft, Culture & Commerce', color: 'green', icon: '🛠️', spheres: 2 },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 border-blue-500 text-blue-700',
    purple: 'bg-purple-100 border-purple-500 text-purple-700',
    yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    green: 'bg-green-100 border-green-500 text-green-700',
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {pillars.map(pillar => (
        <div
          key={pillar.id}
          className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 ${
            activePillar === pillar.id ? 'ring-4 ring-offset-2 ring-' + pillar.color + '-500' : ''
          }`}
          onMouseEnter={() => setActivePillar(pillar.id)}
          onMouseLeave={() => setActivePillar(null)}
        >
          <div className={`p-6 ${colorClasses[pillar.color]}`}>
            <div className="text-4xl mb-4">{pillar.icon}</div>
            <h3 className="text-xl font-bold mb-2">{pillar.name}</h3>
            <p className="text-sm opacity-75">{pillar.spheres} Spheres</p>
          </div>
          
          {activePillar === pillar.id && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold">
                Click to explore
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PillarsVisualization;