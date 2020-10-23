import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(state => state.auth.user)
      .pipe(
        take(1),
        exhaustMap(user => {
          if (!user) {
            return next.handle(req);
          }
          
          const request = req.clone({ params: req.params.append('auth', user.token) });
          return next.handle(request);
        })
      );
  }
}
