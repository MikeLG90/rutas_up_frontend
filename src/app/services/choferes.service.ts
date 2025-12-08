import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChoferesService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/choferes';

  constructor(private http: HttpClient) { }

  getChoferes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  createChofer(chofer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, chofer);
  }

  /*updateChofer(id: any, chofer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, chofer);
  }*/
  updateChofer(id: any, chofer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, chofer);
  }
  deleteChofer(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}
