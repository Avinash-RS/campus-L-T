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
      USER_MANAGEMENT_CANDIDATE_UPLOADS: '/admin/user-management/candidate',
      USER_MANAGEMENT_CANDIDATE_UPLOADED_LIST: '/admin/user-management/candidate/uploaded-list',
      USER_MANAGEMENT_CANDIDATE_BULK_UPLOAD: '/admin/user-management/candidate/bulk-upload',
      APPROVALS: '/admin/approvals',
      APPROVALS_INSTITUTE: '/admin/approvals/institute',
      ADMIN_REPORTS: '/admin/reports',
      ADMIN_REPORTS_LIST: '/admin/reports/reports-list',
      ADMIN_BULK_CANDIDATE_UPLOAD_REPORTS_LIST: '/admin/reports/candidate_list_reports',
      ADMIN_BULK_INSTITUTE_UPLOAD_REPORTS_LIST: '/admin/reports/institute_list_reports'
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
      SECONDSHORTLISTING_ASSESSMENT_REPORTS: '/hr/shortlist/2nd/assessment-reports',
      SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST: '/hr/shortlist/2nd/candidateslist',
      SECONDSHORTLISTED_CANDIDATE_REPORT: '/hr/shortlist/2nd/shortlisted-report',
      UPLOAD_TEST_RESULTS: '/hr/shortlist/upload-test-results',
      USER_MANAGEMENT: '/hr/user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: '/hr/user-management/candidate',
      USER_MANAGEMENT_UPLOADED_LIST: '/hr/user-management/candidate/uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/hr/user-management/candidate/bulk-upload',
      USER_MANAGEMENT_INTERVIEW_PANEL_UPLOADS: '/hr/user-management/inv',
      USER_MANAGEMENT_INTERVIEW_PANEL_BULK_UPLOAD: '/hr/user-management/inv/bulk-upload',
      EVALUATION: '/hr/evaluation',
      EVALUATION_CANDIDATE_DETAILS: '/hr/evaluation/candidate-details',
      EVALUATION_INTERVIEW_PANEL: '/hr/evaluation/interview-panel',
      EVALUATION_INTERVIEW_PANEL_FORM: '/hr/evaluation/evaluation-list',
      ASSESSMENTDETAILS: '/hr/evaluation/assessment-details',
      HR_PANEL_EVALUATION: '/hr/evaluation/hr-evaluation',
      SUB_ASSESSMENTS: '/hr/evaluation/hr-evaluation/assessment',
      SUB_EDUCATION: '/hr/evaluation/hr-evaluation/education',
      SUB_EMPLOYMENT: '/hr/evaluation/hr-evaluation/employment',
      INTERVIEW_PANEL_DETAILS: '/hr/evaluation/interview-panels-details',
      INTERVIEW_PANEL_DETAILS_SELECT: '/hr/evaluation/interview-panels-selected',
      NEW_INTERVIEW_PANEL_ASSIGNMENT: '/hr/evaluation/interview-panelist-assign',
      NEW_INTERVIEW_PANEL_ASSIGNED: '/hr/evaluation/assigned-details',
      NEW_INTERVIEW_PANEL_RESULTS_UPLOAD: '/hr/evaluation/upload',
      HR_USER_MANAGEMENT_USERS_LIST: '/hr/user-management/user-list',
      HR_USER_MANAGEMENT_ADD_USERS: '/hr/user-management/add-user',
      REPORTS: '/hr/reports',
      REPORTS_LIST: '/hr/reports/second',
      REPORTS_LIST_VIEW: '/hr/reports/list/view',
      FIRST_LEVEL_REPORTS_LIST: '/hr/reports/first',
      BULK_CANDIDATE_UPLOAD_REPORTS_LIST: '/hr/reports/candidate_list_reports',
      BULK_INV_UPLOAD_REPORTS_LIST: '/hr/reports/inv-panel-reports',
      TEST_UPLOAD_REPORTS_LIST: '/hr/reports/test-upload-reports',
      INV_BULK_ASSIGN_REPORTS_LIST: '/hr/reports/panel-bulk-assign-report',
      HR_STATUS: '/hr/status',
      HR_STATUS_PREASSESSMENT: '/hr/status/pre-assessment',
      HR_STATUS_RECRUITMENT: '/hr/status/recruitment',
      HR_ASSING_ASSESSMENT: '/hr/assing-assessment',
      HR_SCHEDULING_ASSESSMENT: '/hr/assing-assessment/scheduling-assessment'
    },
    TPO_DASHBOARD: {
      HOME: '/tpo',
      DASHBOARD: '/tpo/dashboard',
      USER_MANAGEMENT: '/tpo/user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: '/tpo/user-management/candidate',
      USER_MANAGEMENT_UPLOADED_LIST: '/tpo/user-management/candidate/uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/tpo/user-management/candidate/bulk-upload',
      USER_MANAGEMENT_ADD_CANDIDATE: '/tpo/user-management/add',
      STATUS: '/tpo/status',
      STATUS_PREASSESSMENT: '/tpo/status/pre-assessment',
      STATUS_RECRUITMENT: '/tpo/status/recruitment',
      TPO_REPORTS: '/tpo/reports',
      TPO_BULK_CANDIDATE_UPLOAD_REPORTS_LIST: '/tpo/reports/candidate_list_reports'
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
    ADMIN_DASHBOARD: {
      HOME: 'admin',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'users',
      USER_MANAGEMENT_ADD_USER: 'add-user',
      USER_MANAGEMENT_EDIT_USER: 'users/edit',
      USER_MANAGEMENT_INSTITUTE_UPLOADS: 'institute',
      USER_MANAGEMENT_INSTITUTE_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_INSTITUTE_BULK_UPLOAD: 'bulk-upload',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: 'candidate',
      USER_MANAGEMENT_CANDIDATE_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_CANDIDATE_BULK_UPLOAD: 'bulk-upload',
      APPROVALS: 'approvals',
      APPROVALS_INSTITUTE: 'institute',
      ADMIN_REPORTS: 'reports',
      ADMIN_REPORTS_LIST: 'reports-list',
      ADMIN_BULK_CANDIDATE_UPLOAD_REPORTS_LIST: 'candidate_list_reports',
      ADMIN_BULK_INSTITUTE_UPLOAD_REPORTS_LIST: 'institute_list_reports',
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
      SECONDSHORTLISTING_ASSESSMENT_REPORTS: 'assessment-reports',
      SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST: 'candidateslist',
      SECONDSHORTLISTED_CANDIDATE_REPORT: 'shortlisted-report',
      UPLOAD_TEST_RESULTS: 'upload-test-results',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: 'candidate',
      USER_MANAGEMENT_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-upload',
      USER_MANAGEMENT_INTERVIEW_PANEL_UPLOADS: 'inv',
      USER_MANAGEMENT_INTERVIEW_PANEL_BULK_UPLOAD: 'bulk-upload',
      EVALUATION: 'evaluation',
      EVALUATION_CANDIDATE_DETAILS: 'candidate-details',
      EVALUATION_INTERVIEW_PANEL: 'interview-panel',
      EVALUATION_INTERVIEW_PANEL_FORM: 'evaluation-list',
      ASSESSMENTDETAILS: 'assessment-details',
      HR_PANEL_EVALUATION: 'hr-evaluation',
      SUB_ASSESSMENTS: 'assessment',
      SUB_EDUCATION: 'education',
      SUB_EMPLOYMENT: 'employment',
      INTERVIEW_PANEL_DETAILS: 'interview-panels-details',
      INTERVIEW_PANEL_DETAILS_SELECT: 'interview-panels-selected',
      NEW_INTERVIEW_PANEL_ASSIGNMENT: 'interview-panelist-assign',
      NEW_INTERVIEW_PANEL_ASSIGNED: 'assigned-details',
      NEW_INTERVIEW_PANEL_RESULTS_UPLOAD: 'upload',
      HR_USER_MANAGEMENT_USERS_LIST: 'user-list',
      HR_USER_MANAGEMENT_ADD_USERS: 'add-user',
      REPORTS: 'reports',
      REPORTS_LIST: 'second',
      REPORTS_LIST_VIEW: 'view',
      FIRST_LEVEL_REPORTS_LIST: 'first',
      BULK_CANDIDATE_UPLOAD_REPORTS_LIST: 'candidate_list_reports',
      BULK_INV_UPLOAD_REPORTS_LIST: 'inv-panel-reports',
      TEST_UPLOAD_REPORTS_LIST: 'test-upload-reports',
      INV_BULK_ASSIGN_REPORTS_LIST: 'panel-bulk-assign-report',
      HR_STATUS: 'status',
      HR_STATUS_PREASSESSMENT: 'pre-assessment',
      HR_STATUS_RECRUITMENT: 'recruitment',
      HR_ASSING_ASSESSMENT: 'assing-assessment',
      HR_SCHEDULING_ASSESSMENT: 'scheduling-assessment'
    },
    TPO_DASHBOARD: {
      HOME: 'tpo',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_CANDIDATE_UPLOADS: 'candidate',
      USER_MANAGEMENT_UPLOADED_LIST: 'uploaded-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-upload',
      USER_MANAGEMENT_ADD_CANDIDATE: 'add',
      STATUS: 'status',
      STATUS_PREASSESSMENT: 'pre-assessment',
      STATUS_RECRUITMENT: 'recruitment',
      TPO_REPORTS: 'reports',
      TPO_BULK_CANDIDATE_UPLOAD_REPORTS_LIST: 'candidate_list_reports'
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
      SUB_EVALUATION: 'evaluate',
      EVALUATION_FORM: 'evaluation-form'
    }
  }
};
