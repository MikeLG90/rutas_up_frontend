import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api'; 

  constructor(private http: HttpClient) { }

  getModelosByMarca(marca_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/modelos/marca/${marca_id}`);
  }
}
