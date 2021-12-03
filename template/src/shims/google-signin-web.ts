// import type {
//   // AddScopesParams,
//   SignInParams,
//   ConfigureParams,
//   HasPlayServicesParams,
//   User
// } from '../../node_modules/@react-native-google-signin/google-signin/src/types';

import * as config from 'config.json';

class GoogleSigninImpl {
  constructor() {
    const handleCredentialResponse = (response: CredentialResponse) => {
      console.log('Encoded JWT ID token: ', response);
      if (response.credential != null) {
        this.tokens.idToken = response.credential;
      }
      // this.tokens.accessToken = result.access_token;
    };
    console.log('GoogleSignin loaded in web mode.');

    this.tokens = {
      idToken: '',
      accessToken: '',
    };

    const gsiScript = document.createElement('script');

    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.defer = true;

    document.body.appendChild(gsiScript);

    gsiScript.addEventListener('load', () => {
      console.log('gsi is ready', window.google);

      window.google &&
        window?.google.accounts.id.initialize({
          client_id: config.webClientId,
          callback: handleCredentialResponse,
        });

      window.google &&
        window?.google.accounts.id.renderButton(
          // @ts-ignore
          document.getElementById('googleSignInButton'),
          {theme: 'outline', size: 'large', width: 300}, // customization attributes
        );
      // window.google && window?.google?.accounts.id.prompt();
    });
  }

  tokens: {
    idToken: string;
    accessToken: string;
  };

  async signIn(): Promise<{}> {
    window.google && window?.google.accounts.id.prompt();

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

interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback: (handleCredentialResponse: CredentialResponse) => void;
  login_uri?: string;
  native_callback?: Function;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: Function;
}

interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}

interface GsiButtonConfiguration {
  type: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  local?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (input: IdConfiguration) => void;
          prompt: (
            momentListener?: (res: PromptMomentNotification) => void,
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration,
            clickHandler?: Function,
          ) => void;
          disableAutoSelect: Function;
          storeCredential: Function;
          cancel: () => void;
          onGoogleLibraryLoad: Function;
          revoke: Function;
        };
      };
    };
  }
}
