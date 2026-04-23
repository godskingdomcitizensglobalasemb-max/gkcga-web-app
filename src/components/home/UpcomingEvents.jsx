// src/components/home/UpcomingEvents.jsx
import React from 'react';

const UpcomingEvents = () => {
  const events = [
    { name: 'Sound of Revival Conference', date: '2024-06-15', location: 'Calabar' },
    { name: 'Leadership Roundtable', date: '2024-07-20', location: 'Lagos' },
    { name: 'Digital Dominion Summit', date: '2024-08-10', location: 'Virtual' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.name} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold">{event.name}</h3>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <svg className="w-4 h-4 ml-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;