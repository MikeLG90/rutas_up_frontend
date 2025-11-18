import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/asignaciones';

  constructor(private http: HttpClient) { }

  getAsignaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehiculos`);
  }

  createAsignacion(asignacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, asignacion);
  }

  updateAsignacion(id: any, asignacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, asignacion);
  }

  deleteAsignacion(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
