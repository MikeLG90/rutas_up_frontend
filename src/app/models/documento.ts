// documento.interface.ts

interface Documentable {
    vehiculo_id?: number; 
    chofer_id?: number;   
    nombre?: string;     
    placa?: string;       
}

export interface Documento {
    id: number;
    nombre: string;
    fecha_expiracion: string | null;
    ruta_archivo: string;
    documentable_id: number;
    documentable_type: 'App\\Models\\Vehiculo' | 'App\\Models\\Chofer';
    documentable: Documentable; 
}