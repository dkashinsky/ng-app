import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey: string = 'AIzaSyApFH6EtkszV05xXujCtCneJjASx90bQDo';

  constructor(private http: HttpClient) { }

  signup(email: string, password: string): Observable<SignupResponseData> {
    return this.http
      .post<SignupResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<SigninResponseData> {
    return this.http
      .post<SigninResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'An unknown error occurred!';
    if (!error.error?.error) {
      return throwError(errorMessage);
    }

    errorMessage = errorMessages[error.error.error.message] ?? errorMessage;
    return throwError(errorMessage);
  }
}
