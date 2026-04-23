// src/pages/ProjectsPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const ProjectsPage = () => {
  const { isAuthenticated } = useAuth();

  const projects = [
    { id: 1, name: 'Tech for Kingdom', description: 'Developing software solutions for churches', members: 12, status: 'Active' },
    { id: 2, name: 'Media Impact', description: 'Creating content for global outreach', members: 8, status: 'Recruiting' },
    { id: 3, name: 'Leadership Academy', description: 'Training next-gen leaders', members: 15, status: 'Active' },
    { id: 4, name: 'Creative Collective', description: 'Design and branding for ministries', members: 6, status: 'Planning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Kingdom Projects</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Collaborate on impactful projects that advance the kingdom
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isAuthenticated && (
            <div className="mb-8 text-right">
              <Button variant="primary">Create New Project</Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'Active' ? 'bg-green-100 text-green-800' :
                    project.status === 'Recruiting' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{project.members} members</span>
                  <Button variant="outline" size="sm" disabled={!isAuthenticated}>
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;