// src/components/home/Testimonials.jsx
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Pastor Michael',
      role: 'Dominion Builder',
      content: 'This platform has transformed how I view my influence in the marketplace. The mentorship and resources are invaluable.',
      image: 'https://via.placeholder.com/100'
    },
    {
      name: 'Sarah Johnson',
      role: 'Tech Sphere Leader',
      content: 'Being part of Dominion Builders has connected me with like-minded professionals who share my faith and vision.',
      image: 'https://via.placeholder.com/100'
    },
    {
      name: 'David Okafor',
      role: 'Media Professional',
      content: 'The 15 benefits track has given me a clear path to growth and leadership. I\'m now mentoring others!',
      image: 'https://via.placeholder.com/100'
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-12">What Dominion Builders Say</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;