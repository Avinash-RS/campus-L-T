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
      USER_MANAGEMENT_INSTITUTE_UPLOADS: '/admin/user-management/institute',
      USER_MANAGEMENT_INSTITUTE_UPLOADED_LIST: '/admin/user-management/institute/uploaded-list',
      USER_MANAGEMENT_INSTITUTE_BULK_UPLOAD: '/admin/user-management/institute/bulk-upload',
    },
    CANDIDATE_DASHBOARD: {
      HOME: '/candidate',
      DASHBOARD: '/candidate/dashboard',
      PROFILE: '/candidate/profile',
      PROFILE_PERSONAL_DETAILS: '/candidate/profile/personal',
      PROFILE_EDUCATIONAL_DETAILS: '/candidate/profile/education',
      PROFILE_FAMILY_DETAILS: '/candidate/profile/family',
      PROFILE_GENERAL_DETAILS: '/candidate/profile/general',
      PROFILE_VIEW_DETAILS: '/candidate/profile/view',
      PROFILE_CONFIRM: '/candidate/profile/confirm',
      KYC_THANKS: '/candidate/kyc/submitted',
      HALLTICKET: '/candidate/hallticket',
      HALLTICKET_LIST: '/candidate/hallticket/list'
    },
    HR_DASHBOARD: {
      HOME: '/hr',
      DASHBOARD: '/hr/dashboard',
      SHORTLISTING: '/hr/shortlist',
      FIRSTSHORTLISTING: '/hr/shortlist/1st',
      FIRSTSHORTLISTING_LIST: '/hr/shortlist/1st/list',
      FIRSTSHORTLISTING_CRITERIA: '/hr/shortlist/1st/criteria',
      SECONDSHORTLISTING: '/hr/shortlist/2nd',
      USER_MANAGEMENT: '/hr/user-management',
      USER_MANAGEMENT_UPLOADED_LIST: '/hr/user-management/uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/hr/user-management/bulk-upload',
      REPORTS: '/hr/reports',
      REPORTS_LIST: '/hr/reports/second',
      REPORTS_LIST_VIEW: '/hr/reports/list/view',
      FIRST_LEVEL_REPORTS_LIST: '/hr/reports/first',
      BULK_CANDIDATE_UPLOAD_REPORTS_LIST: '/hr/reports/candidate_list_reports',
    },
    TPO_DASHBOARD: {
      HOME: '/tpo',
      DASHBOARD: '/tpo/dashboard',
      USER_MANAGEMENT: '/tpo/user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: '/tpo/user-management/candidate',
      USER_MANAGEMENT_UPLOADED_LIST: '/tpo/user-management/candidate/uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/tpo/user-management/candidate/bulk-upload',
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
      USER_MANAGEMENT_INSTITUTE_UPLOADS: 'institute',
      USER_MANAGEMENT_INSTITUTE_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_INSTITUTE_BULK_UPLOAD: 'bulk-upload'
    },
    CANDIDATE_DASHBOARD: {
      HOME: 'candidate',
      DASHBOARD: 'dashboard',
      PROFILE: 'profile',
      PROFILE_PERSONAL_DETAILS: 'personal',
      PROFILE_EDUCATIONAL_DETAILS: 'education',
      PROFILE_FAMILY_DETAILS: 'family',
      PROFILE_GENERAL_DETAILS: 'general',
      PROFILE_VIEW_DETAILS: 'view',
      PROFILE_CONFIRM: 'confirm',
      KYC_THANKS: 'kyc/submitted',
      HALLTICKET: 'hallticket',
      HALLTICKET_LIST: 'list'
    },
    HR_DASHBOARD: {
      HOME: 'hr',
      DASHBOARD: 'dashboard',
      SHORTLISTING: 'shortlist',
      FIRSTSHORTLISTING: '1st',
      FIRSTSHORTLISTING_LIST: 'list',
      FIRSTSHORTLISTING_CRITERIA: 'criteria',
      SECONDSHORTLISTING: '2nd',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-upload',
      REPORTS: 'reports',
      REPORTS_LIST: 'second',
      REPORTS_LIST_VIEW: 'view',
      FIRST_LEVEL_REPORTS_LIST: 'first',
      BULK_CANDIDATE_UPLOAD_REPORTS_LIST: 'candidate_list_reports'
    },
    TPO_DASHBOARD: {
      HOME: 'tpo',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: 'candidate',
      USER_MANAGEMENT_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-upload',
    }
  }
};
