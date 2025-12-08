import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChoferesService } from '../../../../services/choferes.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { AuthService } from '../../../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-choferes',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxDatatableModule, NgxPaginationModule],
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.scss']
})
export class ChoferesComponent implements OnInit {
  choferes: any[] = [];
  users: any[] = [];
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

  nuevaChofer = {
    id: null,
    usuario_id: null,
    licencia_conducir: '',
    fecha_expiracion_licencia: '',
    estado: 'activo',
    fecha_ingreso: '',
    observaciones: ''
  };

  constructor(
    private choferService: ChoferesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadChoferes();
    this.loadUsers();
    this.user = this.authService.getUser();
  }

  loadChoferes() {
    this.choferService.getChoferes().subscribe((data) => {
      this.choferes = data;
      this.temp = [...data];
      this.rows = data;
    });
  }

  loadUsers() {
    this.choferService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    this.rows = this.temp.filter(d => d.nombre_completo.toLowerCase().includes(val));
  }

  abrirModal() {
    this.editando = false;
    this.nuevaChofer = {
      id: null,
      usuario_id: null,
      licencia_conducir: '',
      fecha_expiracion_licencia: '',
      estado: 'activo',
      fecha_ingreso: '',
      observaciones: ''
    };
  }

crearChofer() {
  this.choferService.createChofer(this.nuevaChofer).subscribe({
    next: () => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'Chofer creado con éxito',
        icon: 'success'
      });

      const modalElement = document.getElementById('modalNuevoChofer') as any;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();

      this.loadChoferes();
    },
    error: (error) => {
      if (
        error.status === 500 &&
        error.error?.message?.includes('duplicate key value violates unique constraint')
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Error: Registro duplicado',
          text: 'Ya existe un chofer con estos datos. Por favor verifica los datos.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el vehículo, intenta de nuevo.',
        });
      }
    },
  });
}

toggleEstatus(row: any): void {
  const nuevoEstatus = !row.estatus; // Cambiar el estado
  this.choferService.updateChofer(row.id, { ...row, estatus: nuevoEstatus }).subscribe({
    next: () => {
      row.estatus = nuevoEstatus; // Actualizar el estado en la tabla
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        title: `Estatus cambiado a ${nuevoEstatus ? 'Activo' : 'Inactivo'}`,
        icon: 'success',
      });
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estatus. Intenta de nuevo.',
      });
    },
  });
}
  abrirModalEditar(chofer: any) {
    this.editando = true;
    this.nuevaChofer = { ...chofer } // generar copia del chofer seleccionado
    console.log(this.nuevaChofer);
    
    const modalElement = document.getElementById('modalEditarChofer') as any;
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }

    actualizarChofer() {
      this.choferService.updateChofer(this.nuevaChofer.id, this.nuevaChofer ).subscribe(() => {
        const modalElement = document.getElementById('modalEditarChofer') as any;
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
          title: 'Chofer editado con éxito',
          icon: 'success',
        });
  
        this.loadChoferes();
      });
    }

    abrirModalVer(chofer: any) {
      this.editando = true;
      this.nuevaChofer = { ...chofer } // generar copia del chofer seleccionado
      console.log(this.nuevaChofer);
      
      const modalElement = document.getElementById('modalVerChofer') as any;
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }

      eliminarChofer(id: number) {
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
            this.choferService.deleteChofer(id).subscribe(() => {
              this.loadChoferes(); 
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                title: 'Chofer eliminado con éxito',
                icon: 'success',
              });
            });
          }
        });
      }
}