import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth/register';
  private apiUrlLog = 'http://localhost:3000/api/auth/login';

  // BehaviorSubject para manejar los datos del usuario

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(credentials: { email: string, contrasena: string }): Observable<any> {
    return this.http.post(this.apiUrlLog, credentials);
  }
}
