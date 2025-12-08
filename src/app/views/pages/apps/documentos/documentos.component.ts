import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentoServiceService } from '../../../../services/documento-service.service';
import { ChoferesService } from '../../../../services/choferes.service';
import { VehiculoService } from '../../../../services/vehiculo.service';
import { Documento } from '../../../../models/documento';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { DocumentViewerModalComponent } from '../../../../components/document-viewer-modal/document-viewer-modal.component';


@Pipe({
  name: 'filterByTerm',
  pure: false,
  standalone: true
})
export class FilterByTermPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) return items;
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item => {
      const nombre = item.nombre?.toLowerCase() || '';
      const propietario = this.getNombrePropietario(item).toLowerCase();
      return nombre.includes(searchTerm) || propietario.includes(searchTerm);
    });
  }
  private getNombrePropietario(doc: any): string {
    if (doc.documentable_type?.includes('Chofer')) {
      return doc.documentable?.nombre || 'Sin propietario';
    } else {
      return doc.documentable?.placa || 'Sin propietario';
    }
  }
}

// =============================
// 🔹 PIPE: FILTRAR POR ESTADO
// =============================
@Pipe({
  name: 'filterByEstado',
  pure: false,
  standalone: true
})
export class FilterByEstadoPipe implements PipeTransform {
  transform(items: any[], estado: string): any[] {
    if (!items || !estado) return items;
    return items.filter(item => {
      const estadoDoc = this.getEstado(item.fecha_expiracion);
      return estadoDoc === estado;
    });
  }
  private getEstado(fechaExpiracion: string): string {
    if (!fechaExpiracion) return 'sin-fecha';
    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);
    const diferenciaDias = Math.ceil((fechaExp.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diferenciaDias < 0) return 'vencido';
    if (diferenciaDias <= 30) return 'por-vencer';
    return 'vigente';
  }
}

// ==========================
// 🔹 PIPE: FILTRAR POR TIPO
// ==========================
@Pipe({
  name: 'filterByTipo',
  pure: false,
  standalone: true
})
export class FilterByTipoPipe implements PipeTransform {
  transform(items: any[], tipo: string): any[] {
    if (!items || !tipo) return items;
    return items.filter(item => {
      if (tipo === 'chofer') return item.documentable_type?.includes('Chofer');
      if (tipo === 'vehiculo') return !item.documentable_type?.includes('Chofer');
      return true;
    });
  }
}

// ==========================
// 🔹 COMPONENTE PRINCIPAL
// ==========================
@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FilterByTermPipe,
    FilterByEstadoPipe,
    FilterByTipoPipe
  ],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  documentos: Documento[] = [];
  isLoading = true;
  filtroTerm: string = '';
  listaVehiculos: any[] = [];
  listaChoferes: any[] = [];
  isLoadingOwners: boolean = false;
  selectedFile: File | null = null;
  
  nuevoDocumento = {
    nombre: '',
    fecha_expiracion: '' as string, 
    documentable_id: null as number | null,
    documentable_type: 'App\\Models\\Vehiculo' as string, 
    isUploading: false,
  };

  constructor(private docService: DocumentoServiceService, private modalService: NgbModal, private vehiculoService: VehiculoService,
    private choferesService: ChoferesService
) {}

  ngOnInit(): void {
    this.cargarDocumentosT();
  }

  cargarDocumentosT(): void {
    this.isLoading = true;
    this.docService.obtenerDocumentos().subscribe(data => {
      this.documentos = data;
      this.isLoading = false;
    });
  }
  
   
openModal(content: any): void {
      this.cargarPropietarios(); // Cargar datos antes de abrir el modal
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {}, 
          (reason) => {
              this.resetForm(); 
          }
      );
  }

  cargarPropietarios(): void {
    this.isLoadingOwners = true;
    
    this.vehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.listaVehiculos = data;
        this.isLoadingOwners = false;
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.isLoadingOwners = false;
      }
    });

    this.choferesService.getChoferes().subscribe({
      next: (data) => {
        this.listaChoferes = data;
        this.listaChoferes.sort((a, b) => a.usuario?.persona?.nombre);
      },
      error: (err) => {
        console.error('Error al cargar choferes:', err);
      }
    });
  }
    closeModal(): void {
        this.modalService.dismissAll(); 
        this.resetForm();
    }

  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  guardarDocumento(): void {
    if (!this.selectedFile || !this.nuevoDocumento.documentable_id || !this.nuevoDocumento.nombre) {
      alert('Por favor, complete todos los campos y seleccione un archivo.');
      return;
    }
    
    this.nuevoDocumento.isUploading = true;
    
    const formData = new FormData();
    formData.append('archivo', this.selectedFile, this.selectedFile.name);
    formData.append('nombre', this.nuevoDocumento.nombre);
    formData.append('fecha_expiracion', this.nuevoDocumento.fecha_expiracion);
    formData.append('documentable_id', this.nuevoDocumento.documentable_id.toString());
    formData.append('documentable_type', this.nuevoDocumento.documentable_type);

    this.docService.subirDocumento(formData).subscribe({
      next: (docGuardado) => {
        alert('Documento guardado exitosamente!');
        this.documentos.push(docGuardado); 
        this.closeModal(); 
      },
      error: (err) => {
        console.error('Error al guardar documento:', err);
        alert('Error al guardar el documento. Revise la consola y el servidor.');
        this.nuevoDocumento.isUploading = false;
      },
      complete: () => {
        this.nuevoDocumento.isUploading = false;
      }
    });
  }

  resetForm(): void {
    this.selectedFile = null;
    this.nuevoDocumento = {
      nombre: '',
      fecha_expiracion: '',
      documentable_id: null,
      documentable_type: 'App\\Models\\Vehiculo',
      isUploading: false,
    };
    // Resetea el input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

 
  getEstadoDocumento(fechaExp: string | null): { estado: string, clase: string } {
    if (!fechaExp) return { estado: 'SIN FECHA', clase: 'gris' };
    const hoy = new Date();
    const expiracion = new Date(fechaExp);
    const diffTime = expiracion.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { estado: 'VENCIDO', clase: 'rojo' };
    if (diffDays <= 30) return { estado: 'PRÓXIMO A VENCER', clase: 'amarillo' };
    return { estado: 'VIGENTE', clase: 'verde' };
  }

getNombrePropietario(doc: Documento): string {
  const tipo = doc.documentable_type;
  
  if (tipo.includes('Chofer')) {
      const chofer = doc.documentable as any;
      
      const nombreChofer = chofer.usuario?.persona?.nombre;

      
      return nombreChofer || 'N/A (Chofer sin nombre)';
  } 
  
  if (tipo.includes('Vehiculo')) {
      return (doc.documentable as any).placa || 'N/A (Vehículo sin placa)';
  }
  
  return 'Desconocido';
}

  descargarArchivo(doc: Documento): void {
    this.docService.descargarDocumento(doc.id).subscribe(blob => {
      const extension = doc.ruta_archivo.split('.pop') ? doc.ruta_archivo.split('.').pop() : 'pdf';
      saveAs(blob, `${doc.nombre}_${this.getNombrePropietario(doc)}.${extension}`);
    });
  }

visualizarDocumento(doc: Documento): void {
        const url = this.docService.getViewUrl(doc.id);
        const modalRef = this.modalService.open(DocumentViewerModalComponent, { 
        size: 'xl', 
        centered: true,
        scrollable: true 
    });

    modalRef.componentInstance.documentUrl = url;

    }
}
