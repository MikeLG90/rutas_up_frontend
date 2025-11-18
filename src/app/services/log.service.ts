import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/logs'; 

  constructor(private http: HttpClient) {}

  getLogs(): Observable<{ logs: string[] }> {
    return this.http.get<{ logs: string[] }>(this.apiUrl);
  }
}
