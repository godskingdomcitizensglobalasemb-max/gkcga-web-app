// src/components/home/BenefitsShowcase.jsx
import React from 'react';

const BenefitsShowcase = () => {
  const benefits = [
    { level: 1, count: 5, name: 'Foundation', color: 'blue' },
    { level: 2, count: 4, name: 'Development', color: 'green' },
    { level: 3, count: 4, name: 'Influence', color: 'purple' },
    { level: 4, count: 2, name: 'Leadership', color: 'gold' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {benefits.map(level => (
          <div key={level.level} className="text-center flex-1">
            <div className={`relative mb-2`}>
              <div className={`w-12 h-12 mx-auto rounded-full bg-${level.color}-100 flex items-center justify-center`}>
                <span className={`text-${level.color}-600 font-bold`}>{level.count}</span>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className={`bg-${level.color}-500 text-white text-xs px-2 py-1 rounded-full`}>
                  Level {level.level}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium mt-2">{level.name}</p>
          </div>
        ))}
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            Progress
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              35% Complete
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div style={{ width: '35%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsShowcase;