import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../models/documento';

@Injectable({
  providedIn: 'root'
})
export class DocumentoServiceService {
  private apiUrl = 'https://rutas-up-backend.onrender.com/api/documentos';

  constructor(private http: HttpClient) { }

obtenerDocumentos(): Observable<Documento[]> {
        return this.http.get<Documento[]>(this.apiUrl);
    }
    
    descargarDocumento(id: number): Observable<Blob> {
        // Pide la respuesta como 'blob' (archivo binario)
        return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
    }

    subirDocumento(formData: FormData): Observable<Documento> {

    return this.http.post<Documento>(this.apiUrl, formData);
}

    getDownloadUrl(id: number): string {
        const URL_BASE = this.apiUrl;
        return `${URL_BASE}${this.apiUrl}/${id}/download`; 
    }

    getViewUrl(id: number): string {
      return `${this.apiUrl}/${id}/view`;    }
}
