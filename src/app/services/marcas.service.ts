import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  private apiUrl = 'https://rutas-up-backend.onrender.com/api/marcas';

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createMarca(marca: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, marca);
  }

  updateMarca(id: number, marca: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, marca);
  }

  deleteMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
