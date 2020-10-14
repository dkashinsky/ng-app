import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user$
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
