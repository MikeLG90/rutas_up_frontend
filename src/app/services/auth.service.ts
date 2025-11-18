import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://rutas-up-backend.onrender.com/api/register';
  private apiUrl2 = 'https://rutas-up-backend.onrender.com/api/registerChofer';
  private apiUrlLog = 'https://rutas-up-backend.onrender.com/api/login';
  private resetUrl = 'https://rutas-up-backend.onrender.com/api/solicitar-recuperacion';

  // BehaviorSubject para manejar los datos del usuario

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  registerChofer(user: any): Observable<any> {
    return this.http.post(this.apiUrl2, user);
  }
  login(credentials: { email: string, contrasena: string }): Observable<any> {
    return this.http.post(this.apiUrlLog, credentials);
  }

  saveUserData(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
  }

  logout(): void {
    // Eliminar los datos al hacer logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  recuperarContrasena(recuperacion:any): Observable<any> {
    return this.http.post(this.resetUrl, recuperacion);
  }
}
