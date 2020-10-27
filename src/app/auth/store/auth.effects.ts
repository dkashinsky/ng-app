import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';

export interface SignupResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface SigninResponseData extends SignupResponseData {
  registered: boolean;
}

const errorMessages = {
  // Signup
  'EMAIL_EXISTS': 'The email address is already in use by another account.',
  'OPERATION_NOT_ALLOWED': 'Password sign-in is disabled for this project.',
  'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to unusual activity. Try again later.',
  // Signin
  'EMAIL_NOT_FOUND': 'There is no user record corresponding to this identifier. The user may have been deleted.',
  'INVALID_PASSWORD': 'The password is invalid or the user does not have a password.',
  'USER_DISABLED': 'The user account has been disabled by an administrator.',
};

@Injectable()
export class AuthEffects {
  @Effect() 
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap(({ payload: { email, password } }: AuthActions.LoginStart) => {
      return this.http.post<SigninResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      ).pipe(
        map(({expiresIn, localId, idToken, email}: SigninResponseData) => { 
          const expMillis: number = (+expiresIn) * 1000;
          const expirationDate = new Date(new Date().getTime() + expMillis);

          return new AuthActions.Login({email, userId: localId, token: idToken, expirationDate});
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage: string = 'An unknown error occurred!';
          if (!error.error?.error) {
            return of(new AuthActions.LoginFail(errorMessage));
          }

          errorMessage = errorMessages[error.error.error.message] ?? errorMessage;
          return of(new AuthActions.LoginFail(errorMessage));
        }),
      );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => this.router.navigate(['/']))
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}
