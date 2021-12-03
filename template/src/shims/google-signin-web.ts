// import type {
//   // AddScopesParams,
//   SignInParams,
//   ConfigureParams,
//   HasPlayServicesParams,
//   User
// } from '../../node_modules/@react-native-google-signin/google-signin/src/types';

// GAPI DEPRECATED: https://developers.google.com/identity/sign-in/web/sign-in

import * as config from 'config.json';

class GoogleSigninImpl {
  constructor() {
    console.log('GoogleSignin loaded in web mode.');

    this.tokens = {
      idToken: '',
      accessToken: '',
    };

    const gapiScript = document.createElement('script');

    gapiScript.src = 'https://apis.google.com/js/platform.js';
    gapiScript.async = true;
    gapiScript.defer = true;

    document.body.appendChild(gapiScript);

    gapiScript.addEventListener('load', () => {
      console.log('gapi is ready');

      window?.gapi?.load('auth2', () => {
        /* Ready. Make a call to gapi.auth2.init or some other API */

        window?.gapi?.auth2?.init({
          client_id: config.webClientId,
          cookie_policy: 'none',
        });

        this.GoogleAuth = window?.gapi?.auth2?.getAuthInstance();
      });
    });
  }

  GoogleAuth: any;
  tokens: {
    idToken: string;
    accessToken: string;
  };

  async signIn(): Promise<{}> {
    console.log('signIn');
    await this?.GoogleAuth?.signIn({prompt: 'select_account'});

    const user = this.GoogleAuth.currentUser.get();

    const result = user.getAuthResponse(true);
    this.tokens.idToken = result.id_token;
    this.tokens.accessToken = result.access_token;

    return {};
  }

  async hasPlayServices(): Promise<boolean> {
    console.log('should check play services');
    return false;
  }

  async getTokens(): Promise<{idToken: string; accessToken: string}> {
    console.log('tokens', this.tokens);
    return this.tokens;
  }

  configure(options: {}): void {
    console.log(
      'should configure google signin with options: ' + JSON.stringify(options),
    );
  }

  signOut(): void {
    this.GoogleAuth.signOut();
    console.log('should signout google');
  }
}

export const GoogleSignin = new GoogleSigninImpl();

export const statusCodes = {
  SIGN_IN_CANCELLED: 12501, // https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInStatusCodes#public-static-final-int-sign_in_cancelled
  IN_PROGRESS: 'ASYNC_OP_IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 4, // https://developers.google.com/android/reference/com/google/android/gms/common/api/CommonStatusCodes#public-static-final-int-sign_in_required
};

export {};
