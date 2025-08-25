// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    isMockEnabled: false,
    LOCAL_STORAGE_LOGIN_SECRET_KEY:'U2FsdGVkX190/AT+n5N+K3Xo25gsEiw0Y1Qfgsgsgkc65XWWARx6Y9ZcrRWQIfnWyZurUi',
   //local
   apiUrl: 'http://localhost:7097/api/',
   devUrl: 'http://localhost:7097/'

   //apiUrl: 'http://103.123.9.151:8039/api/',
    //devUrl: 'http://103.123.9.151:8039/'
  };
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
