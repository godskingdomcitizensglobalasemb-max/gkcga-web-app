// src/pages/BenefitsPage.jsx
import React from 'react';
import BenefitsShowcase from '../components/home/BenefitsShowcase';

const BenefitsPage = () => {
  const benefits = [
    { level: 1, name: 'Foundation', benefits: [
      'Invitation to post-event Leadership Council',
      'Leadership Award and Global Recognition',
      'Priority seating at 3-day conference',
      'Public acknowledgement on stage',
      'End-of-event roundtable at top Lagos hotel'
    ]},
    { level: 2, name: 'Development', benefits: [
      'Free access to one premium skill training',
      'Access to industry mentors',
      'Media and branding exposure',
      'Global network exposure'
    ]},
    { level: 3, name: 'Influence', benefits: [
      'Post-event project collaborations',
      'Sponsored gifts and gadgets',
      'Appointment into GKCGA leadership track',
      'Personal brand amplification'
    ]},
    { level: 4, name: 'Leadership', benefits: [
      'Future event leadership roles',
      'Speaking opportunities'
    ]}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-900 to-teal-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">15 Benefits for Dominion Builders</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Track your progression from foundation to leadership
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BenefitsShowcase />
          
          <div className="mt-16 space-y-8">
            {benefits.map(level => (
              <div key={level.level} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4">
                  Level {level.level}: {level.name}
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  {level.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                      </span>
                      <span className="text-gray-700">{benefit}</span>
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

export default BenefitsPage;