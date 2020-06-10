export const CONSTANT = {
  MIMETypes: {
    TXT: 'text/plain',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingm1.document',
    DOC: 'application/ msword',
    PDF: 'application/pdf',
    JPG: 'image/jpeg',
    BMP: 'image/bmp',
    PNG: 'image/png',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetm1.sheet',
    RTF: 'application/rtf',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationm1.presentation',
  },
  DRUPAL_ADMIN_USERNAME: 'admin',
  DRUPAL_ADMIN_PASSWORD: 'admin@123',
  ENDPOINTS: {
    HOME: '/home',
    REGISTER: {
      CORPORATE: '/register/corporate',
      INSTITUTE: '/register/institute',
      CANDIDATE: '/register/candidate',
    },
    VERIFY: {
      OTP: '/verify/otp',
      EMAIL: '/verify/email',
      EMAIL_ERROR: '/verify/email/error',
      OTP_PASSWORD: '/verify/otp-password'
    },
    PASSWORD: {
      FORGOT: '/forgot-password',
      RESET: '/password/reset',
      SETUP: '/password/setup'
    },
    LOGIN: '/login',
    LOGOUT: '/logout',
    ADMIN_DASHBOARD: {
      HOME: '/admin',
      DASHBOARD: '/admin/dashboard',
      USER_MANAGEMENT: '/admin/user-management',
      USER_MANAGEMENT_USERS_LIST: '/admin/user-management/users',
      USER_MANAGEMENT_ADD_USER: '/admin/user-management/add-user',
      USER_MANAGEMENT_EDIT_USER: '/admin/user-management/users/edit',
    },
    CANDIDATE_DASHBOARD: {
      HOME: '/candidate',
      PROFILE: '/candidate/profile',
      PROFILE_PERSONAL_DETAILS: '/candidate/profile/personal',
      PROFILE_EDUCATIONAL_DETAILS: '/candidate/profile/education',
      PROFILE_FAMILY_DETAILS: '/candidate/profile/family',
      PROFILE_GENERAL_DETAILS: '/candidate/profile/general',
      PROFILE_VIEW_DETAILS: '/candidate/profile/view',
      PROFILE_CONFIRM: '/candidate/profile/confirm',
      KYC_THANKS: '/candidate/kyc/submitted'
    }

  },

  ROUTES: {
    HOME: 'home',
    REGISTER: {
      CORPORATE: 'register/corporate',
      INSTITUTE: 'register/institute',
      CANDIDATE: 'register/candidate',
    },
    VERIFY: {
      OTP: 'verify/otp',
      EMAIL: 'verify/email',
      EMAIL_ERROR: 'verify/email/error',
      OTP_PASSWORD: 'verify/otp-password'
    },
    PASSWORD: {
      FORGOT: 'forgot-password',
      RESET: 'password/reset',
      SETUP: 'password/setup'
    },
    LOGIN: 'login',
    LOGOUT: 'logout',
    ADMIN_DASHBOARD: {
      HOME: 'admin',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'users',
      USER_MANAGEMENT_ADD_USER: 'add-user',
      USER_MANAGEMENT_EDIT_USER: 'users/edit',
    },
    CANDIDATE_DASHBOARD: {
      HOME: 'candidate',
      PROFILE: 'profile',
      PROFILE_PERSONAL_DETAILS: 'personal',
      PROFILE_EDUCATIONAL_DETAILS: 'education',
      PROFILE_FAMILY_DETAILS: 'family',
      PROFILE_GENERAL_DETAILS: 'general',
      PROFILE_VIEW_DETAILS: 'view',
      PROFILE_CONFIRM: 'confirm',
      KYC_THANKS: 'kyc/submitted'
    }
  }
};
