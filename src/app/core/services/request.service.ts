import { Injectable } from '@angular/core';
import  { environments } from '../../../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private API_URL: string = environments.API_URL;

  constructor(private http: HttpClient, private router: Router) { }


  get<T>(url: string, params?: HttpParams | { [param: string]: string | number }): Observable<T> {
    return this.http.get<T>(this.API_URL + url, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders | { [header: string]: string }): Observable<T> {
    return this.http.post<T>(this.API_URL + url, body, { headers });
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.API_URL + url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.API_URL + url);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }
}
