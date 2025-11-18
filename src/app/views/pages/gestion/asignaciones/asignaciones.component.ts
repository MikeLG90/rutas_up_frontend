import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsignacionesService } from '../../../../services/asignaciones.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { AuthService } from '../../../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChoferesService } from '../../../../services/choferes.service';
import { RutasService } from '../../../../services/rutas.service';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxDatatableModule, NgxPaginationModule],
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.scss']
})
export class AsignacionesComponent implements OnInit {
  asignaciones: any[] = [];
  vehiculos: any[] = [];
  choferes: any[] = [];
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

  nuevaAsignacion = {
    id: null,
    chofer_id: null,
    vehiculo_id: null,
    ruta_id: null,
  };
  asignacionSeleccionada = {
    asignacion_id: null,
    chofer_id: null,
    vehiculo_id: null,
    ruta_id: null,
  };

  constructor(
    private asignacionesService: AsignacionesService,
    private authService: AuthService,
    private choferServices: ChoferesService,
    private ruta: RutasService
  ) {}

  ngOnInit(): void {
    this.loadChoferes();
    this.loadAsignaciones();
    this.loadVehiculos();
    this.loadRutas();
    this.user = this.authService.getUser();
  }

  loadAsignaciones() {
    this.asignacionesService.getAsignaciones().subscribe((data) => {
      this.asignaciones = data;
      this.temp = [...data];
      this.rows = data;
    });
  }

  loadVehiculos() {
    this.asignacionesService.getVehiculos().subscribe((data) => {
      this.vehiculos = data;
    });
  }

  loadChoferes() {
    this.choferServices.getChoferes().subscribe((data) => {
      this.choferes = data;
    });
  }

  loadRutas() {
    this.ruta.getRutas().subscribe((data) => {
      this.rutas = data;
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
    this.nuevaAsignacion = {
      id: null,
      chofer_id: null,
      vehiculo_id: null,
      ruta_id: null,

    };
  }

  crearAsignacion() {
    this.asignacionesService.createAsignacion(this.nuevaAsignacion).subscribe(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'Asignación creada con éxito',
        icon: 'success'
      });      

              const modalElement = document.getElementById('modalNuevaAsginacion') as any;
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              if (modalInstance) modalInstance.hide();
      this.loadAsignaciones();
    });
  }

  abrirModalEditar(asignacion: any) {
    this.editando = true;
    this.asignacionSeleccionada = { ...asignacion };
    console.log(this.asignacionSeleccionada);
    const modalElement = document.getElementById('modalEditarAsignacion') as any;
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }

  actualizarAsignacion() {
    this.asignacionesService.updateAsignacion(this.asignacionSeleccionada.asignacion_id, this.asignacionSeleccionada).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Asignación actualiazada con éxito',
          icon: 'success'
        });

                const modalElement = document.getElementById('modalEditarAsignacion') as any;
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
            
                if (modalInstance) {
                  modalInstance.hide(); 
                }   
              this.loadAsignaciones();
    });
  }

  eliminarAsignacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asignacionesService.deleteAsignacion(id).subscribe(() => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: 'Asignación eliminada con éxito',
            icon: 'success'
          });          this.loadAsignaciones();
        });
      }
    });
  }
}