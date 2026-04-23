// src/config.js - Centralized configuration management

const config = {
  // YouTube
  youtube: {
    apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
  },

  // Firebase
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  },

  // Email Services
  email: {
    sendgrid: {
      apiKey: process.env.REACT_APP_SENDGRID_API_KEY,
      fromEmail: process.env.REACT_APP_SENDGRID_FROM_EMAIL,
      fromName: process.env.REACT_APP_SENDGRID_FROM_NAME,
    },
    emailjs: {
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      userId: process.env.REACT_APP_EMAILJS_USER_ID,
    },
    resend: {
      apiKey: process.env.REACT_APP_RESEND_API_KEY,
    },
  },

  // Payment Gateways
  payment: {
    stripe: {
      publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    },
    paypal: {
      clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
      mode: process.env.REACT_APP_PAYPAL_MODE,
    },
    paystack: {
      publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    },
    flutterwave: {
      publicKey: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    },
  },

  // Social Media
  social: {
    facebook: {
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
    },
    twitter: {
      apiKey: process.env.REACT_APP_TWITTER_API_KEY,
    },
    linkedin: {
      clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    },
  },

  // Cloud Storage
  cloudinary: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  },

  // Video Conferencing
  video: {
    zoom: {
      clientId: process.env.REACT_APP_ZOOM_CLIENT_ID,
    },
    googleMeet: {
      apiKey: process.env.REACT_APP_GOOGLE_MEET_API_KEY,
    },
  },

  // Analytics
  analytics: {
    google: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    facebook: process.env.REACT_APP_FACEBOOK_PIXEL_ID,
    mixpanel: process.env.REACT_APP_MIXPANEL_TOKEN,
    sentry: process.env.REACT_APP_SENTRY_DSN,
  },

  // Communication
  twilio: {
    accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
    phoneNumber: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
  },

  onesignal: {
    appId: process.env.REACT_APP_ONESIGNAL_APP_ID,
  },

  pusher: {
    appKey: process.env.REACT_APP_PUSHER_APP_KEY,
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  },

  // Website
  website: {
    url: process.env.REACT_APP_WEBSITE_URL,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    adminEmail: process.env.REACT_APP_ADMIN_EMAIL,
    supportEmail: process.env.REACT_APP_SUPPORT_EMAIL,
    noReplyEmail: process.env.REACT_APP_NO_REPLY_EMAIL,
  },

  // Features
  features: {
    enableEmailNotifications: process.env.REACT_APP_ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableSmsNotifications: process.env.REACT_APP_ENABLE_SMS_NOTIFICATIONS === 'true',
    enablePushNotifications: process.env.REACT_APP_ENABLE_PUSH_NOTIFICATIONS === 'true',
    enableSocialLogin: process.env.REACT_APP_ENABLE_SOCIAL_LOGIN === 'true',
    enablePaymentGateway: process.env.REACT_APP_ENABLE_PAYMENT_GATEWAY === 'true',
    enableLiveStreaming: process.env.REACT_APP_ENABLE_LIVE_STREAMING === 'true',
  },

  // Environment
  env: process.env.REACT_APP_ENV || 'development',
  debug: process.env.REACT_APP_DEBUG_MODE === 'true',
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  maxUploadSize: parseInt(process.env.REACT_APP_MAX_UPLOAD_SIZE) || 10485760,

  // Security
  recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
};

// Validation function to check required configs
export const validateConfig = () => {
  const required = [
    'firebase.apiKey',
    'firebase.projectId',
    'website.url',
  ];

  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    return !value;
  });

  if (missing.length > 0) {
    console.error('Missing required configuration:', missing);
    return false;
  }
  return true;
};

// Helper to get config with validation
export const getConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    validateConfig();
  }
  return config;
};

export default config;