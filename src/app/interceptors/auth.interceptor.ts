

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
@
Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiBaseUrl = environments.API_URL; // ej: https://api.miapp.com

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo interceptar si la URL comienza con tu backend
    if (req.url.startsWith(this.apiBaseUrl)) {
      const token = sessionStorage.getItem('token');

      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(cloned);
      }
    }

    return next.handle(req);
  }
}
