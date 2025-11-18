import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RutasService } from '../../../../services/rutas.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { AuthService } from '../../../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxDatatableModule, NgxPaginationModule],
  templateUrl: './rutas.component.html',
  styleUrl: './rutas.component.scss'
})
export class RutasComponent {
  rutas: any[] = [];
  editando = false;
  user: any;
  reorderable = true;
  ColumnMode = ColumnMode;
  loadingIndicator = true;
  temp: any[] = [];
  rows: any[] = [];
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;

  ruta = {
    ruta_id: null,
    nombre_ruta: null,
    puntos_geograficos: null,
    distancia: null
  }

  constructor(
    private rutaService: RutasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRutas();
    this.user = this.authService.getUser();
  }

  loadRutas() {
    this.rutaService.getRutas().subscribe((data) => {
      this.rutas = data;
      this.temp = [...data];
      this.rows = data;
    });
    
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    this.rows = this.temp.filter(d => d.nombre_ruta.toLowerCase().includes(val));
  }

  abrirModal(){
    this.editando = false;
    this.ruta = {
      ruta_id: null,
      nombre_ruta: null,
      puntos_geograficos: null,
      distancia: null
    }
  }

   abrirModalEditar(ruta: any) {
     this.editando = true;
     this.ruta = { ...ruta } // generar copia del chofer seleccionado
     console.log(this.ruta);
     
     const modalElement = document.getElementById('modalEditarRuta') as any;
     const modalInstance = new bootstrap.Modal(modalElement);
     modalInstance.show();
   }
actualizarRuta() {
  this.rutaService.updateRuta(this.ruta.ruta_id, this.ruta).subscribe({
    next: () => {
      const modalElement = document.getElementById('modalEditarRuta') as any;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'Ruta editada con éxito',
        icon: 'success',
      });

      this.loadRutas();
    },
    error: (error) => {
      // Validar error de duplicado (status 500 y mensaje que incluye "duplicate key")
      if (
        error.status === 500 &&
        error.error?.message?.toLowerCase().includes('duplicate key')
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Error: Registro duplicado',
          text: 'Ya existe una ruta con datos duplicados. Por favor verifica la información.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la ruta, intenta de nuevo.',
        });
      }
    },
    complete: () => {
      console.log('La actualización de la ruta se completó.');
    }
  });
}


    abrirModalVer(ruta: any) {
      this.editando = true;
      this.ruta = { ...ruta } // generar copia del chofer seleccionado
      console.log(this.ruta);
      
      const modalElement = document.getElementById('modalVerRuta') as any;
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }

      eliminarRuta(id: number) {
        Swal.fire({
          title: '¿Estás seguro de eliminar?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#9e192d',
          cancelButtonColor: '#9e192d',
          confirmButtonText: 'Sí, eliminarlo',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.rutaService.deleteRuta(id).subscribe(() => {
              this.loadRutas(); 
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                title: 'Ruta eliminada con éxito',
                icon: 'success',
              });
            });
          }
        });
      }
  
}
