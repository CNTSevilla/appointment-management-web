import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environments } from '../../../environments/environments';
import { ToastComponent } from '../shared/components/molecules/toast/toast.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiBaseUrl = environments.API_URL;

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🚫 Excluir endpoints públicos (login / register, etc.)
    if (req.url.includes('/sign-in') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }

    // ✅ Solo interceptar si pertenece a tu API
    if (req.url.startsWith(this.apiBaseUrl)) {
      const token = sessionStorage.getItem('token');

      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    }

    // ✅ Manejamos errores globalmente
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // 🧠 Si el token expiró → redirigir al login
        if (error.status === 403 || error.status === 401) {
          // Limpia token (por seguridad)

          sessionStorage.removeItem('token');
          this.router.navigate(['/auth/login']);

        }

        return throwError(() => error);
      })
    );
  }
}
