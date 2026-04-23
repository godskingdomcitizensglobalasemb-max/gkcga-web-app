// src/services/adminService.js
export const adminService = {
  async getDashboardStats() {
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    
    return {
      totalMembers: submissions.length,
      pendingReview: submissions.filter(s => s.status === 'pending').length,
      zoomInvitesSent: submissions.filter(s => s.status === 'invited').length,
      completedOnboarding: submissions.filter(s => s.status === 'onboarded').length,
    };
  },

  async getInterestedUsers() {
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    return submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async updateUserStatus(userId, data) {
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    const index = submissions.findIndex(s => s.id === userId);
    
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...data };
      localStorage.setItem('interested_users', JSON.stringify(submissions));
    }
    
    return { success: true };
  },

  async sendZoomInvite(userId) {
    const submissions = JSON.parse(localStorage.getItem('interested_users') || '[]');
    const user = submissions.find(s => s.id === userId);
    
    if (user) {
      // In production, this would trigger actual Zoom API call
      console.log(`Sending Zoom invite to ${user.email}`);
      
      // Update status
      const updatedSubmissions = submissions.map(s => 
        s.id === userId ? { ...s, status: 'invited', zoomInviteSent: new Date().toISOString() } : s
      );
      localStorage.setItem('interested_users', JSON.stringify(updatedSubmissions));
    }
    
    return { success: true };
  },
};