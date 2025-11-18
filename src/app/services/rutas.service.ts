import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/rutas';

  constructor(private http: HttpClient) { }

  getRutas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateRuta(id: any, ruta: any): Observable<any>  {
    return this.http.put(`${this.apiUrl}/update/${id}`, ruta);
  }

  deleteRuta(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
