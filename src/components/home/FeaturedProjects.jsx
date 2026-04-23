// src/components/home/FeaturedProjects.jsx
import React from 'react';

const FeaturedProjects = () => {
  const projects = [
    { name: 'Tech for Kingdom', members: 12, status: 'Active' },
    { name: 'Media Impact', members: 8, status: 'Recruiting' },
    { name: 'Leadership Academy', members: 15, status: 'Active' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.name} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.members} members</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'Active' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjects;