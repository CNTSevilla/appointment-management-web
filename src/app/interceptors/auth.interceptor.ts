

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiBaseUrl = environments.API_URL; // ej: https://api.miapp.com

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🚫 Excluir login (y si quieres también /register, etc.)
    if (req.url.includes('/sign-in') || req.url.includes('/auth/register')) {
      console.log('Interceptando solicitud a:', req.url);

      return next.handle(req);
    }

    // Solo interceptar si la URL comienza con tu backend
    if (req.url.startsWith(this.apiBaseUrl)) {

      const token = sessionStorage.getItem('token');
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log('Request modificado con token:', cloned);
        return next.handle(cloned);
      }
    }

    return next.handle(req);
  }
}
