// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getDatabase, 
  ref, 
  set, 
  push, 
  update, 
  get, 
  query, 
  orderByChild, 
  equalTo, 
  limitToLast,
  onValue,
  remove,
  child,
  orderByKey,
  startAt,
  endAt,
  limitToFirst
} from 'firebase/database';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

// Debug: Check if environment variables are loading
console.log('Environment Variables Check:');
console.log('REACT_APP_YOUTUBE_API_KEY exists:', !!process.env.REACT_APP_YOUTUBE_API_KEY);
console.log('REACT_APP_FIREBASE_API_KEY exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);

// Your Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://gkcga-d290d-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate required Firebase config
const requiredFirebaseConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfig = requiredFirebaseConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig);
  console.error('Please check your .env file and ensure all required variables are set');
} else {
  console.log('Firebase configuration loaded successfully');
}

// Initialize Firebase
console.log('Initializing Firebase...');
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize services
let analytics;
let db;
let auth;

try {
  analytics = getAnalytics(app);
  db = getDatabase(app);
  auth = getAuth(app);
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase services:', error);
}

// Export YouTube API key
export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// Check if YouTube API key is available
if (!YOUTUBE_API_KEY) {
  console.error('YouTube API key not found in environment variables!');
  console.error('Please add REACT_APP_YOUTUBE_API_KEY to your .env file');
} else {
  console.log('YouTube API key loaded successfully');
}

// Rest of your firebase.js code remains the same...
// [Keep all your existing functions from DB_PATHS onward]




// Database reference paths
export const DB_PATHS = {
  SUMMIT_REGISTRATIONS: 'summit_registrations',
  CONTACTS: 'contacts',
  VOLUNTEER_APPLICATIONS: 'volunteer_applications',
  COMMUNITY_APPLICATIONS: 'community_applications',
  USERS: 'users',
  LOGIN_HISTORY: 'login_history',
  USER_PROFILES: 'user_profiles',
  EMAIL_TEMPLATES: 'email_templates',
  EMAIL_LOGS: 'email_logs',
  ADMIN_SETTINGS: 'admin_settings',
  SUBSCRIBERS: 'subscribers'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const generateId = () => {
  const newRef = push(ref(db));
  return newRef.key;
};

export const snapshotToArray = (snapshot) => {
  const data = [];
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      data.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
  }
  return data;
};

export const getTimestamp = () => {
  return Date.now();
};

export const pathExists = async (path) => {
  try {
    const pathRef = ref(db, path);
    const snapshot = await get(pathRef);
    return snapshot.exists();
  } catch (error) {
    console.error(`Error checking path ${path}:`, error);
    return false;
  }
};

export const initializeDatabase = async () => {
  console.log('Initializing database paths...');
  try {
    for (const [key, path] of Object.entries(DB_PATHS)) {
      const exists = await pathExists(path);
      if (!exists) {
        const pathRef = ref(db, path);
        await set(pathRef, { _init: true });
        console.log(`Created path: ${path}`);
      }
    }
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthStateChange = (callback) => onAuthStateChanged(auth, callback);

// ============================================
// ADMIN AUTHENTICATION FUNCTIONS
// ============================================

export const isUserAdmin = async (userId) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val().role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const createAdminUser = async (email, userId) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    await set(userRef, {
      email,
      role: 'admin',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      permissions: ['read', 'write', 'delete', 'send_emails', 'export_data']
    });
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const setupAdminUser = async (email, password) => {
  try {
    let userCredential;
    let user;
    
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        throw error;
      }
    }
    
    const userRef = ref(db, `${DB_PATHS.USERS}/${user.uid}`);
    await set(userRef, {
      email: user.email,
      role: 'admin',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      permissions: ['read', 'write', 'delete', 'send_emails', 'export_data']
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Error setting up admin user:', error);
    throw error;
  }
};

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export const saveUserToDatabase = async (userId, userData) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    await set(userRef, {
      ...userData,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      role: 'user'
    });
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

export const getUserFromDatabase = async (userId) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return { id: userId, ...snapshot.val() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user from database:', error);
    throw error;
  }
};

export const updateUserInDatabase = async (userId, updates) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    await update(userRef, {
      ...updates,
      updatedAt: getTimestamp()
    });
  } catch (error) {
    console.error('Error updating user in database:', error);
    throw error;
  }
};

export const checkUserExists = async (userId) => {
  try {
    const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const usersRef = ref(db, DB_PATHS.USERS);
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      let userData = null;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.email === email) {
          userData = { id: childSnapshot.key, ...data };
        }
      });
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = ref(db, DB_PATHS.USERS);
    const snapshot = await get(usersRef);
    const users = snapshotToArray(snapshot);
    const filteredUsers = users.filter(user => user._init !== true);
    return filteredUsers.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// ============================================
// CONTACT FUNCTIONS (Realtime DB)
// ============================================

export const saveContact = async (contactData) => {
  try {
    const id = generateId();
    const contactRef = ref(db, `${DB_PATHS.CONTACTS}/${id}`);
    await set(contactRef, {
      ...contactData,
      createdAt: getTimestamp(),
      status: 'new',
      updatedAt: getTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

export const getAllContacts = async (limitCount = 100) => {
  try {
    const contactsRef = ref(db, DB_PATHS.CONTACTS);
    const snapshot = await get(contactsRef);
    const contacts = snapshotToArray(snapshot);
    const filteredContacts = contacts.filter(contact => contact._init !== true);
    return filteredContacts.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const updateContact = async (id, updates) => {
  try {
    const contactRef = ref(db, `${DB_PATHS.CONTACTS}/${id}`);
    await update(contactRef, {
      ...updates,
      updatedAt: getTimestamp(),
      updatedBy: auth.currentUser?.uid || 'system'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const contactRef = ref(db, `${DB_PATHS.CONTACTS}/${id}`);
    await remove(contactRef);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// ============================================
// COMMUNITY APPLICATIONS CRUD
// ============================================

export const saveCommunityApplication = async (applicationData) => {
  try {
    const id = generateId();
    const applicationRef = ref(db, `${DB_PATHS.COMMUNITY_APPLICATIONS}/${id}`);
    await set(applicationRef, {
      ...applicationData,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      status: 'pending'
    });
    return id;
  } catch (error) {
    console.error('Error saving community application:', error);
    throw error;
  }
};

export const getAllCommunityApplications = async (limitCount = 100) => {
  try {
    const applicationsRef = ref(db, DB_PATHS.COMMUNITY_APPLICATIONS);
    const snapshot = await get(applicationsRef);
    const applications = snapshotToArray(snapshot);
    const filtered = applications.filter(app => app._init !== true);
    return filtered.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error getting community applications:', error);
    throw error;
  }
};

export const updateCommunityApplication = async (id, updates) => {
  try {
    const appRef = ref(db, `${DB_PATHS.COMMUNITY_APPLICATIONS}/${id}`);
    await update(appRef, {
      ...updates,
      updatedAt: getTimestamp()
    });
  } catch (error) {
    console.error('Error updating community application:', error);
    throw error;
  }
};

export const deleteCommunityApplication = async (id) => {
  try {
    const appRef = ref(db, `${DB_PATHS.COMMUNITY_APPLICATIONS}/${id}`);
    await remove(appRef);
  } catch (error) {
    console.error('Error deleting community application:', error);
    throw error;
  }
};

export const getApplicationsByStatus = async (status) => {
  try {
    const allApps = await getAllCommunityApplications();
    return allApps.filter(app => app.status === status);
  } catch (error) {
    console.error('Error getting applications by status:', error);
    throw error;
  }
};

// ============================================
// VOLUNTEER APPLICATION FUNCTIONS
// ============================================

export const saveVolunteerApplication = async (applicationData) => {
  try {
    const id = generateId();
    const applicationRef = ref(db, `${DB_PATHS.VOLUNTEER_APPLICATIONS}/${id}`);
    await set(applicationRef, {
      ...applicationData,
      createdAt: getTimestamp(),
      status: 'pending',
      updatedAt: getTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error saving volunteer application:', error);
    throw error;
  }
};

export const checkExistingVolunteerApplication = async (email) => {
  try {
    const applicationsRef = ref(db, DB_PATHS.VOLUNTEER_APPLICATIONS);
    const snapshot = await get(applicationsRef);
    if (snapshot.exists()) {
      let exists = false;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.email === email) {
          exists = true;
        }
      });
      return exists;
    }
    return false;
  } catch (error) {
    console.error('Error checking volunteer application:', error);
    return false;
  }
};

export const getAllVolunteerApplications = async () => {
  try {
    const applicationsRef = ref(db, DB_PATHS.VOLUNTEER_APPLICATIONS);
    const snapshot = await get(applicationsRef);
    const applications = snapshotToArray(snapshot);
    return applications.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    throw error;
  }
};

export const updateVolunteerApplication = async (id, updates) => {
  try {
    const appRef = ref(db, `${DB_PATHS.VOLUNTEER_APPLICATIONS}/${id}`);
    await update(appRef, { ...updates, updatedAt: getTimestamp() });
  } catch (error) {
    console.error('Error updating volunteer application:', error);
    throw error;
  }
};

export const deleteVolunteerApplication = async (id) => {
  try {
    const appRef = ref(db, `${DB_PATHS.VOLUNTEER_APPLICATIONS}/${id}`);
    await remove(appRef);
  } catch (error) {
    console.error('Error deleting volunteer application:', error);
    throw error;
  }
};

export const getVolunteerApplicationStats = async () => {
  try {
    const applications = await getAllVolunteerApplications();
    const stats = { total: applications.length, byDepartment: {}, byStatus: {}, byAgeGroup: {}, recent: applications.slice(0, 5) };
    
    applications.forEach(app => {
      if (app.departmentPreferences && Array.isArray(app.departmentPreferences)) {
        app.departmentPreferences.forEach(dept => {
          stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
        });
      }
      if (app.status) stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      if (app.ageGroup) stats.byAgeGroup[app.ageGroup] = (stats.byAgeGroup[app.ageGroup] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting volunteer stats:', error);
    throw error;
  }
};

export const getVolunteerApplicationsByDepartment = async (department) => {
  try {
    const applications = await getAllVolunteerApplications();
    return applications.filter(app => app.departmentPreferences && app.departmentPreferences.includes(department));
  } catch (error) {
    console.error('Error fetching applications by department:', error);
    throw error;
  }
};

export const getVolunteerApplicationsByStatus = async (status) => {
  try {
    const applications = await getAllVolunteerApplications();
    return applications.filter(app => app.status === status);
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    throw error;
  }
};

// ============================================
// SUBSCRIBER FUNCTIONS
// ============================================

export const saveSubscriber = async (subscriberData) => {
  try {
    const id = generateId();
    const subscriberRef = ref(db, `${DB_PATHS.SUBSCRIBERS}/${id}`);
    await set(subscriberRef, {
      ...subscriberData,
      subscribedAt: getTimestamp(),
      status: 'active'
    });
    return id;
  } catch (error) {
    console.error('Error saving subscriber:', error);
    throw error;
  }
};

export const getAllSubscribers = async () => {
  try {
    const subscribersRef = ref(db, DB_PATHS.SUBSCRIBERS);
    const snapshot = await get(subscribersRef);
    return snapshotToArray(snapshot);
  } catch (error) {
    console.error('Error getting subscribers:', error);
    throw error;
  }
};

// ============================================
// EMAIL FUNCTIONS
// ============================================

export const sendEmailInvitation = async (recipients, emailData) => {
  try {
    const emailLog = {
      recipients,
      subject: emailData.subject,
      template: emailData.template,
      content: emailData.content,
      sentAt: getTimestamp(),
      sentBy: auth.currentUser?.uid || 'system',
      status: 'pending',
      recipientCount: recipients.length
    };
    
    const logId = generateId();
    const logRef = ref(db, `${DB_PATHS.EMAIL_LOGS}/${logId}`);
    await set(logRef, emailLog);
    
    console.log('Email invitation would be sent to:', recipients);
    console.log('Email subject:', emailData.subject);
    
    await update(logRef, { status: 'sent', sentAt: getTimestamp() });
    
    return { success: true, logId };
  } catch (error) {
    console.error('Error sending email invitation:', error);
    throw error;
  }
};

export const sendYouTubeReminder = async (emails, eventData) => {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${eventData.title}</title>
    </head>
    <body>
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#7c3aed,#a78bfa);padding:40px;text-align:center;border-radius:16px 16px 0 0;">
          <h1 style="color:white;margin:0;">🎥 ${eventData.title}</h1>
        </div>
        <div style="background:white;padding:40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
          <p>Hello Kingdom Citizen,</p>
          <p>Join us for our upcoming YouTube live broadcast:</p>
          <div style="background:#f8f8fa;padding:20px;border-radius:12px;margin:20px 0;">
            <p><strong>📅 Date:</strong> ${eventData.date}</p>
            <p><strong>⏰ Time:</strong> ${eventData.time}</p>
            <p><strong>🎤 Speaker:</strong> ${eventData.speaker || 'Joshua Nwaeze'}</p>
          </div>
          <div style="text-align:center;">
            <a href="${eventData.youtubeLink}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 32px;border-radius:100px;text-decoration:none;">🔔 Set Reminder</a>
          </div>
          <p>Be blessed,<br><strong>SORMS Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmailInvitation(emails, {
    subject: `🔴 LIVE: ${eventData.title} - Join us on YouTube!`,
    content: emailContent,
    template: 'youtube_reminder'
  });
};

export const getEmailLogs = async (limitCount = 50) => {
  try {
    const logsRef = ref(db, DB_PATHS.EMAIL_LOGS);
    const snapshot = await get(logsRef);
    const logs = snapshotToArray(snapshot);
    return logs.sort((a, b) => b.sentAt - a.sentAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error getting email logs:', error);
    throw error;
  }
};

// ============================================
// EXPORT FUNCTIONS
// ============================================

export const exportToCSV = (applications) => {
  if (!applications || applications.length === 0) return '';
  
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'City', 'Interests', 'Commitment', 'Status', 'Date'];
  const csvRows = [headers];
  
  applications.forEach(app => {
    const row = [
      app.id,
      `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.name || '',
      app.email || '',
      app.phone || '',
      app.country || '',
      app.city || '',
      (app.interests || []).join('; '),
      app.commitment || '',
      app.status || 'pending',
      app.createdAt ? new Date(app.createdAt).toLocaleString() : ''
    ];
    csvRows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`));
  });
  
  return csvRows.join('\n');
};

export const downloadCSV = (csvData, filename) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// LOGIN TRACKING FUNCTIONS
// ============================================

export const saveUserLoginToDatabase = async (userId, loginData) => {
  try {
    const id = generateId();
    const loginRef = ref(db, `${DB_PATHS.LOGIN_HISTORY}/${id}`);
    await set(loginRef, { userId, ...loginData, createdAt: getTimestamp() });
    return id;
  } catch (error) {
    console.error('Error saving login activity:', error);
    return null;
  }
};

export const getUserLoginHistory = async (userId, limitCount = 10) => {
  try {
    const historyRef = ref(db, DB_PATHS.LOGIN_HISTORY);
    const snapshot = await get(historyRef);
    const userHistory = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.userId === userId) {
          userHistory.push({ id: childSnapshot.key, ...data });
        }
      });
    }
    return userHistory.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
};

export const getRecentLoginActivity = async (limitCount = 50) => {
  try {
    const historyRef = ref(db, DB_PATHS.LOGIN_HISTORY);
    const snapshot = await get(historyRef);
    const allActivity = snapshotToArray(snapshot);
    return allActivity.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent login activity:', error);
    throw error;
  }
};

export const getLoginStats = async (timeframe = 'day') => {
  try {
    const now = Date.now();
    let startTime;
    switch (timeframe) {
      case 'day': startTime = now - (24 * 60 * 60 * 1000); break;
      case 'week': startTime = now - (7 * 24 * 60 * 60 * 1000); break;
      case 'month': startTime = now - (30 * 24 * 60 * 60 * 1000); break;
      default: startTime = now - (24 * 60 * 60 * 1000);
    }
    
    const historyRef = ref(db, DB_PATHS.LOGIN_HISTORY);
    const snapshot = await get(historyRef);
    const stats = { total: 0, successful: 0, failed: 0, uniqueUsers: new Set(), byMethod: {} };
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.createdAt >= startTime) {
          stats.total++;
          if (data.success) {
            stats.successful++;
            if (data.userId && data.userId !== 'unknown') stats.uniqueUsers.add(data.userId);
          } else {
            stats.failed++;
          }
          if (data.method) stats.byMethod[data.method] = (stats.byMethod[data.method] || 0) + 1;
        }
      });
    }
    stats.uniqueUsers = stats.uniqueUsers.size;
    return stats;
  } catch (error) {
    console.error('Error getting login stats:', error);
    throw error;
  }
};

// ============================================
// SUMMIT REGISTRATION FUNCTIONS
// ============================================

export const saveRegistration = async (registrationData) => {
  try {
    const id = generateId();
    const registrationRef = ref(db, `${DB_PATHS.SUMMIT_REGISTRATIONS}/${id}`);
    await set(registrationRef, {
      ...registrationData,
      createdAt: getTimestamp(),
      status: 'pending',
      updatedAt: getTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw error;
  }
};

export const checkExistingRegistration = async (email, summitTitle) => {
  try {
    const registrationsRef = ref(db, DB_PATHS.SUMMIT_REGISTRATIONS);
    const snapshot = await get(registrationsRef);
    if (snapshot.exists()) {
      let exists = false;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.email === email && data.summit === summitTitle) exists = true;
      });
      return exists;
    }
    return false;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const getAllRegistrations = async () => {
  try {
    const registrationsRef = ref(db, DB_PATHS.SUMMIT_REGISTRATIONS);
    const snapshot = await get(registrationsRef);
    const registrations = snapshotToArray(snapshot);
    return registrations.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
};

export const getRegistrationsBySummit = async (summitTitle) => {
  try {
    const registrations = await getAllRegistrations();
    return registrations.filter(reg => reg.summit === summitTitle);
  } catch (error) {
    console.error('Error fetching registrations by summit:', error);
    throw error;
  }
};

export const getRecentRegistrations = async (limitCount = 10) => {
  try {
    const allRegistrations = await getAllRegistrations();
    return allRegistrations.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent registrations:', error);
    throw error;
  }
};

export const getRegistrationStats = async () => {
  try {
    const registrations = await getAllRegistrations();
    const stats = { total: registrations.length, bySummit: {}, byStatus: {} };
    registrations.forEach(reg => {
      if (reg.summit) stats.bySummit[reg.summit] = (stats.bySummit[reg.summit] || 0) + 1;
      if (reg.status) stats.byStatus[reg.status] = (stats.byStatus[reg.status] || 0) + 1;
    });
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

// Export Firebase instances
export { db, analytics, auth };
export default app;