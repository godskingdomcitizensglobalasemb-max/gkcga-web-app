// src/pages/ResourcesPage.jsx
import React from 'react';

const ResourcesPage = () => {
  const resources = [
    { category: 'Training Materials', items: ['Leadership Manual', 'Sphere Guides', 'Skill Development Videos'] },
    { category: 'Toolkits', items: ['Branding Toolkit', 'Project Planning Guide', 'Mentorship Handbook'] },
    { category: 'Vault', items: ['Conference Recordings', 'Expert Interviews', 'Case Studies'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Resource Library</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Access training materials, toolkits, and exclusive content
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map(category => (
              <div key={category.category} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-600">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map(item => (
                    <li key={item}>
                      <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </a>
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

export default ResourcesPage;