import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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
  private userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  private tokenExpirationTimer: any;

  readonly user$: Observable<User> = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string): Observable<SignupResponseData> {
    return this.http
      .post<SignupResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }

  login(email: string, password: string): Observable<SigninResponseData> {
    return this.http
      .post<SigninResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const expirationDate: Date = new Date(userData._tokenExpirationDate);
    const loadedUser = new User(userData.email, userData.id, userData._token, expirationDate);
    if (loadedUser.token) {
      this.userSubject.next(loadedUser);

      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'An unknown error occurred!';
    if (!error.error?.error) {
      return throwError(errorMessage);
    }

    errorMessage = errorMessages[error.error.error.message] ?? errorMessage;
    return throwError(errorMessage);
  }

  private handleAuthentication({ email, localId, idToken, expiresIn }: SignupResponseData) {
    const expMillis: number = (+expiresIn) * 1000;
    const expirationDate = new Date(new Date().getTime() + expMillis);
    const user = new User(email, localId, idToken, expirationDate);
    this.autoLogout(expMillis);
    this.userSubject.next(user);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
