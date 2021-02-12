// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  qa: false,
  local: true,

  // // For Dev
  //  API_BASE_URL: 'http://104.211.226.77/d8cintana2',
  //  API_BASE_URL_city: 'http://104.211.226.77/d8cintana2',
  // Image_Base_Url: 'http://104.211.226.77',

  // For QA
  API_BASE_URL: 'http://udapqa.southindia.cloudapp.azure.com/d8cintana2',
  API_BASE_URL_city: 'http://udapqa.southindia.cloudapp.azure.com/d8cintana2',
  Image_Base_Url: 'http://udapqa.southindia.cloudapp.azure.com',

    // Campus QA
    // API_BASE_URL: 'http://campus-qa.lntedutech.com/d8cintana2',
    // API_BASE_URL_city: 'http://campus-qa.lntedutech.com/d8cintana2',
    // Image_Base_Url: 'http://campus-qa.lntedutech.com',
  
  // Local
  // API_BASE_URL: '',
  // API_BASE_URL_city: '',
  // Image_Base_Url: '',

  // For UAT
  // API_BASE_URL: 'https://uat-campus.lntedutech.com/d8cintana2',
  // API_BASE_URL_city: 'https://uat-campus.lntedutech.com/d8cintana2',
  // Image_Base_Url: 'https://uat-campus.lntedutech.com',

  // For Prod
  // API_BASE_URL: 'http://udapprod.southindia.cloudapp.azure.com/d8cintana2',
  // API_BASE_URL_city: 'http://udapprod.southindia.cloudapp.azure.com/d8cintana2',
  // Image_Base_Url: 'http://udapprod.southindia.cloudapp.azure.com',
  // API_BASE_URL: 'https://campus.lntedutech.com/d8cintana2',
  // API_BASE_URL_city: 'https://campus.lntedutech.com/d8cintana2',
  // Image_Base_Url: 'https://campus.lntedutech.com',
  // API_BASE_URL: 'http://40.119.225.78/d8cintana2',
  // API_BASE_URL_city: 'http://40.119.225.78/d8cintana2',
  // Image_Base_Url: 'http://40.119.225.78',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
