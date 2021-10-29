// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  uat: false,
  qa: false,
  local: true,

    // Campus QA
    // ASSETS: 'https://assets.lntedutech.com',
    // versionCheckURL: 'https://campus-qa.lntedutech.com/version.json',

    // WEBRTC_NODE_API : 'https://uapqaapplicationgateway.lntiggnite.com',
    // API_BASE_URL: 'https://campus-qa.lntedutech.com/d8cintana2',
    // API_BASE_URL_city: 'https://campus-qa.lntedutech.com/d8cintana2',
    // Image_Base_Url: 'https://campus-qa.lntedutech.com',

    // campus Dev
    ASSETS: 'https://assets.lntedutech.com',
    versionCheckURL: 'https://campus-dev.lntedutech.com/version.json',

    UNIFIEDREPORTS: 'https://unifiedreport-dev.lntedutech.com/',
    WEBRTC_NODE_API : 'https://uapapplicationgateway.lntiggnite.com',
    API_BASE_URL: 'https://campus-dev.lntedutech.com/dcampus',
    API_BASE_URL_city: 'https://campus-dev.lntedutech.com/dcampus',
    Image_Base_Url: 'https://campus-dev.lntedutech.com',
    NODE_API_BASE_URL: 'https://edgeservice.lntiggnite.com',
    // PROCTOR_URL: 'https://lntproctor.lntedutech.com',
    PROCTOR_URL: 'https://lntproctordev.lntedutech.com',
    PROCTOR_VIDEO_URL : 'http://lntproctordev.lntedutech.com/api/storage/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
