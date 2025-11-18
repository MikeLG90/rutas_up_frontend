import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  private apiUrl = 'https://rutas-up-backend.onrender.com/api';

  constructor(private http: HttpClient) { }

  getRutas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rutas`);
  }

  getRutaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ver-ruta/${id}`);
  }

  crearRuta(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-ruta`, data);
  }

  actualizarRuta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-ruta/${id}`, data);
  }

  borrarRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/borrar-ruta/${id}`);
  }

}
