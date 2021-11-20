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
    HOME: '/login',
    MAINTENANCE: '/unavailable',
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
    UNAUTHENTICATED: {
      HOME: '/Unauthenticated',
      VIDEO_ASSESS: '/Unauthenticated/video-assessment-evaluation'
    },
    ADMIN_DASHBOARD: {
      HOME: '/admin',
      DASHBOARD: '/admin/dashboard',
      USER_MANAGEMENT: '/admin/user-management',
      USER_MANAGEMENT_USERS_LIST: '/admin/user-management/user-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/admin/user-management/bulk-uploads',
      APPROVALS: '/admin/approvals',
      APPROVALS_INSTITUTE: '/admin/approvals/institute',
      ADMIN_REPORTS: '/admin/reports',
    },
    CANDIDATE_DASHBOARD: {
      HOME: '/candidate',
      DASHBOARD: '/candidate/dashboard',
      JOINING: '/candidate/joining',
      JOINING_PERSONAL: '/candidate/joining/personal',
      JOINING_CONTACT: '/candidate/joining/contact',
      JOINING_DEPENDENT: '/candidate/joining/dependent',
      JOINING_EDUCATION: '/candidate/joining/education',
      JOINING_WORK: '/candidate/joining/work',
      JOINING_UPLOAD: '/candidate/joining/upload',
      JOINING_PREVIEW: '/candidate/joining/preview',
      JOINING_SUBMIT: '/candidate/joining/submit',
      JOINING_FAQ: '/candidate/faq',
      KYC_THANKS: '/candidate/kyc/submitted',
      HALLTICKET: '/candidate/hallticket',
      HALLTICKET_LIST: '/candidate/hallticket/list',
      DOCUMENT: '/candidate/document',
      DOCUMENT_LIST: '/candidate/document/list',
      REGISTRATION_CLOSE: '/candidate/registration-close'
    },
    HR_DASHBOARD: {
      HOME: '/hr',
      DASHBOARD: '/hr/dashboard',
      SHORTLISTING: '/hr/shortlist',
      FIRSTSHORTLISTING: '/hr/shortlist/1st',
      FIRSTSHORTLISTING_LIST: '/hr/shortlist/1st/list',
      FIRSTSHORTLISTING_CRITERIA: '/hr/shortlist/1st/criteria',
      SECONDSHORTLISTING: '/hr/shortlist/2nd',
      SECONDSHORTLISTING_ASSESSMENT_LIST: '/hr/shortlist/2nd/assessment-list',
      SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST: '/hr/shortlist/2nd/candidateslist',
      SECONDSHORTLISTED_CANDIDATE_REPORT: '/hr/shortlist/2nd/shortlisted-report',
      VIDEO_ASSESSMENT_SCHEDULE: '/hr/shortlist/2nd/video-schedule',
      USER_MANAGEMENT: '/hr/user-management',
      HR_USER_MANAGEMENT_USERS_LIST: '/hr/user-management/user-list',
      HR_USER_MANAGEMENT_BULK_UPLOAD: '/hr/user-management/bulk-uploads',
      EVALUATION: '/hr/evaluation',
      NEW_INTERVIEW_PANEL_ASSIGNMENT: '/hr/evaluation/interview-panelist-assign',
      NEW_INTERVIEW_PANEL_ASSIGNED: '/hr/evaluation/assigned',
      ASSIGNED_DETAILS: '/hr/evaluation/assigned/details',
      HR_PANEL_EVALUATION: '/hr/evaluation/assigned/candidate-details',
      NEW_INTERVIEW_PANEL_RESULTS_UPLOAD: '/hr/evaluation/upload',
      SUB_ASSESSMENTS: '/hr/evaluation/hr-evaluation/assessment',
      SUB_EDUCATION: '/hr/evaluation/hr-evaluation/education',
      SUB_EMPLOYMENT: '/hr/evaluation/hr-evaluation/employment',
      REPORTS: '/hr/reports',
      REPORTS_LIST: '/hr/reports/second',
      REPORTS_LIST_VIEW: '/hr/reports/list/view',
      FIRST_LEVEL_REPORTS_LIST: '/hr/reports/first',
      HR_STATUS: '/hr/status',
      HR_STATUS_PREASSESSMENT: '/hr/status/pre-assessment',
      HR_STATUS_RECRUITMENT: '/hr/status/recruitment',
      BUSINESSROUTE: '/hr/ic',
      IC_ADDorLIST: '/hr/ic/list',
      OfferedCandidatesLIST: '/hr/ic/candidates'
    },
    TPO_DASHBOARD: {
      HOME: '/tpo',
      DASHBOARD: '/tpo/dashboard',
      USER_MANAGEMENT: '/tpo/user-management',
      USER_MANAGEMENT_USERS_LIST: '/tpo/user-management/user-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/tpo/user-management/bulk-uploads',
      STATUS: '/tpo/status',
      STATUS_PREASSESSMENT: '/tpo/status/pre-assessment',
      STATUS_RECRUITMENT: '/tpo/status/recruitment',
    },
    INTERVIEW_PANEL_DASHBOARD: {
      HOME: '/interview-panel',
      CANDIDATE_DETAILS: '/interview-panel/candidates',
      CANDIDATE_DETAILS_ASSESSMENT_LIST: '/interview-panel/candidates/assessment-list',
      CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST: '/interview-panel/candidates/assessments',
      CANDIDATE_DETAILS_SUBMITTED: '/interview-panel/candidates/submitted',
      INTERVIEW_PANEL_EVALUATION: '/interview-panel/candidates/evaluation',
      SUB_ASSESSMENTS: '/interview-panel/candidates/evaluation/assessment',
      SUB_EDUCATION: '/interview-panel/candidates/evaluation/education',
      SUB_EMPLOYMENT: '/interview-panel/candidates/evaluation/employment',
      SUB_EVALUATION: '/interview-panel/candidates/evaluation/evaluate',
      UNIFIEDREPORTS: '/interview-panel/candidates/evaluation/unifiedreports',
      JOIN_INTERVIEW: '/interview-panel/candidates/evaluation/join',
      EVALUATION_FORM: '/interview-panel/evaluation-form'
    }

  },

  ROUTES: {
    HOME: 'home',
    MAINTENANCE: 'unavailable',
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
    UNAUTHENTICATED: {
      HOME: 'Unauthenticated',
      VIDEO_ASSESS: 'video-assessment-evaluation'
    },
    ADMIN_DASHBOARD: {
      HOME: 'admin',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'user-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-uploads',
      APPROVALS: 'approvals',
      APPROVALS_INSTITUTE: 'institute',
      ADMIN_REPORTS: 'reports',
    },
    CANDIDATE_DASHBOARD: {
      HOME: 'candidate',
      DASHBOARD: 'dashboard',
      JOINING: 'joining',
      JOINING_PERSONAL: 'personal',
      JOINING_CONTACT: 'contact',
      JOINING_DEPENDENT: 'dependent',
      JOINING_EDUCATION: 'education',
      JOINING_WORK: 'work',
      JOINING_UPLOAD: 'upload',
      JOINING_PREVIEW: 'preview',
      JOINING_SUBMIT: 'submit',
      JOINING_FAQ: 'faq',
      KYC_THANKS: 'kyc/submitted',
      HALLTICKET: 'hallticket',
      HALLTICKET_LIST: 'list',
      DOCUMENT: 'document',
      DOCUMENT_LIST: 'list',
      REGISTRATION_CLOSE: 'registration-close'
    },
    HR_DASHBOARD: {
      HOME: 'hr',
      DASHBOARD: 'dashboard',
      SHORTLISTING: 'shortlist',
      FIRSTSHORTLISTING: '1st',
      FIRSTSHORTLISTING_LIST: 'list',
      FIRSTSHORTLISTING_CRITERIA: 'criteria',
      SECONDSHORTLISTING: '2nd',
      SECONDSHORTLISTING_ASSESSMENT_LIST: 'assessment-list',
      SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST: 'candidateslist',
      SECONDSHORTLISTED_CANDIDATE_REPORT: 'shortlisted-report',
      VIDEO_ASSESSMENT_SCHEDULE: 'video-schedule',
      USER_MANAGEMENT: 'user-management',
      EVALUATION: 'evaluation',
      NEW_INTERVIEW_PANEL_ASSIGNMENT: 'interview-panelist-assign',
      NEW_INTERVIEW_PANEL_ASSIGNED: 'assigned',
      ASSIGNED_DETAILS: 'details',
      HR_PANEL_EVALUATION: 'candidate-details',
      NEW_INTERVIEW_PANEL_RESULTS_UPLOAD: 'upload',
      SUB_ASSESSMENTS: 'assessment',
      SUB_EDUCATION: 'education',
      SUB_EMPLOYMENT: 'employment',
      HR_USER_MANAGEMENT_USERS_LIST: 'user-list',
      HR_USER_MANAGEMENT_BULK_UPLOAD: 'bulk-uploads',
      REPORTS: 'reports',
      REPORTS_LIST: 'second',
      REPORTS_LIST_VIEW: 'view',
      FIRST_LEVEL_REPORTS_LIST: 'first',
      HR_STATUS: 'status',
      HR_STATUS_PREASSESSMENT: 'pre-assessment',
      HR_STATUS_RECRUITMENT: 'recruitment',
      BUSINESSROUTE: 'ic',
      IC_ADDorLIST: 'list',
      OfferedCandidatesLIST: 'candidates'
    },
    TPO_DASHBOARD: {
      HOME: 'tpo',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'user-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-uploads',
      STATUS: 'status',
      STATUS_PREASSESSMENT: 'pre-assessment',
      STATUS_RECRUITMENT: 'recruitment',
    },
    INTERVIEW_PANEL_DASHBOARD: {
      HOME: 'interview-panel',
      CANDIDATE_DETAILS: 'candidates',
      CANDIDATE_DETAILS_ASSESSMENT_LIST: 'assessment-list',
      CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST: 'assessments',
      CANDIDATE_DETAILS_SUBMITTED: 'submitted',
      INTERVIEW_PANEL_EVALUATION: 'evaluation',
      SUB_ASSESSMENTS: 'assessment',
      SUB_EDUCATION: 'education',
      SUB_EMPLOYMENT: 'employment',
      UNIFIEDREPORTS: 'unifiedreports',
      JOIN_INTERVIEW: 'join',
      SUB_EVALUATION: 'evaluate',
      EVALUATION_FORM: 'evaluation-form'
    }
  }
};
