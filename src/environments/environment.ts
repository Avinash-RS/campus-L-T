// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  qa: false,

  // // For Dev
  // API_BASE_URL: 'http://104.211.226.77/d8cintana2',
  // API_BASE_URL_city: 'http://104.211.226.77/d8cintana2',
  // Image_Base_Url: 'http://104.211.226.77',

  // For QA
  API_BASE_URL: 'http://udapqa.southindia.cloudapp.azure.com/d8cintana2',
  API_BASE_URL_city: 'http://udapqa.southindia.cloudapp.azure.com/d8cintana2',
  Image_Base_Url: 'http://udapqa.southindia.cloudapp.azure.com',

  // For Prod
  // API_BASE_URL: 'http://udapprod.southindia.cloudapp.azure.com/d8cintana2',
  // API_BASE_URL_city: 'http://udapprod.southindia.cloudapp.azure.com/d8cintana2',
  // Image_Base_Url: 'http://udapprod.southindia.cloudapp.azure.com',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
