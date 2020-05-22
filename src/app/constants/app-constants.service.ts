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

  ROUTES: {
    HOME: 'home-page',
    REGISTER: {
      CORPORATE: 'register/corporate',
      INSTITUTE: 'register/institute',
      CANDIDATE: 'register/candidate',
    },
    VERIFY: {
      OTP: 'verify/otp',
      EMAIL: 'verify/email',
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
      HOME: 'home',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'users',
      USER_MANAGEMENT_ADD_USER: 'add-user',
    }
  }
};
