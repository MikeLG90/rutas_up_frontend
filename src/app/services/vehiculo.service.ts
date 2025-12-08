import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/vehiculos';
  
  constructor(private http: HttpClient) { }

  getVehiculos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createVehicle(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, data);
  }

  /*updateVehicle(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }*/
  updateVehicle(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }
  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

