// src/services/onboardingService.js
export const onboardingService = {
  async submitInterest(formData) {
    // Store in localStorage for demo
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    
    const newSubmission = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      adminNotes: '',
    };
    
    submissions.push(newSubmission);
    localStorage.setItem('interested_users', JSON.stringify(submissions));
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: newSubmission });
      }, 1000);
    });
  },

  async getSubmissionStatus(email) {
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    return submissions.find(s => s.email === email);
  },
};