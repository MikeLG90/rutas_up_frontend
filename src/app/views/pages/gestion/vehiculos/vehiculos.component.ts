import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../../../../services/vehiculo.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import $ from 'jquery';
import 'datatables.net';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { AuthService } from '../../../../services/auth.service';
import { MarcasService } from '../../../../services/marcas.service';
import { ModeloService } from '../../../../services/modelo.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxDatatableModule, NgxPaginationModule],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  nuevaVehiculo: {
    id: null;
    num_serie: string;
    placa: string;
    num_economico: string;
    marca_id: number | null; 
    modelo_id: number | null; 
    anio: number | null; 
  } = {
    id: null,
    num_serie: '',
    placa: '',
    num_economico: '',
    marca_id: null,
    modelo_id: null,
    anio: null,
  };
  
  marcas: any[] = []; 
  modelos: any[] = []; 

  editando = false;
  user: any;
  reorderable = true;
  ColumnMode = ColumnMode;
  loadingIndicator = true;
  temp: any[] = []; 
  rows: any[] = []; 
  searchTerm: string = ''; 

  pageSize: number = 10; // Número de filas por página
  currentPage: number = 1;

  constructor(private vehiculoService: VehiculoService, private authService: AuthService,
    private marcaService: MarcasService, private modeloService: ModeloService
  ) {}

  ngOnInit(): void {
    this.loadVehiculos();
    this.user = this.authService.getUser();
    this.loadVehiculos();
    this.loadMarcas();
  }

  loadMarcas() {
    this.marcaService.getMarcas().subscribe((data) => {
      this.marcas = data;  
    }); 
   }

   loadModelosByMarca(marca_id: number | null) {
    if (marca_id !== null) {
        this.modeloService.getModelosByMarca(marca_id).subscribe((data) => {
            this.modelos = data; 
            this.nuevaVehiculo.modelo_id = null; 
        });
    } else {
        this.modelos = [];
        this.nuevaVehiculo.modelo_id = null;
    }
}
onPageChange(page: number) {
  this.currentPage = page;
}
  loadVehiculos() {
    this.vehiculoService.getVehiculos().subscribe((data) => {
      this.vehiculos = data;
      this.temp = [...data]; 
      this.rows = data; 
    });
  }

  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();

    const temp = this.temp.filter((d: any) => {
      return d.placa.toLowerCase().includes(val) || !val; // Filtrando por placa
    });

    this.rows = temp;
  }

  abrirModal() {
    this.editando = false;
    this.nuevaVehiculo = { 
      id: null,
      num_serie: '',
      placa: '',
      num_economico: '',
      marca_id: null,
      modelo_id: null,
      anio: null
    }; 
  }

crearVehiculo() {
  this.vehiculoService.createVehicle(this.nuevaVehiculo).subscribe({
    next: () => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: 'Vehículo creado con éxito',
        icon: 'success',
      });

      const modalElement = document.getElementById('modalNuevoVehiculo') as any;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      this.loadVehiculos();
    },
    error: (error) => {
      // Verificamos si el error viene por duplicado (status 500 y mensaje específico)
      if (
        error.status === 500 &&
        error.error?.message?.includes('duplicate key value violates unique constraint')
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Error: Registro duplicado',
          text: 'Ya existe un vehículo con la misma placa, número de serie o número económico. Por favor verifica los datos.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el vehículo, intenta de nuevo.',
        });
      }
    },
    complete: () => {
      console.log('La creación del vehículo se completó.');
    }
  });
}

toggleEstatus(row: any): void {
  const nuevoEstatus = !row.estatus; // Cambiar el estado
  this.vehiculoService.updateVehicle(row.vehiculo_id, { ...row, estatus: nuevoEstatus }).subscribe({
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

  abrirModalEdicion(vehiculo: any) {
    this.editando = true;
    this.nuevaVehiculo = { 
      id: vehiculo.vehiculo_id,
      num_serie: vehiculo.num_serie,
      placa: vehiculo.placa,
      num_economico: vehiculo.num_economico,
      marca_id: vehiculo.marca_id,
      modelo_id: vehiculo.modelo_id,
      anio: vehiculo.anio
    };

    const modalElement = document.getElementById('modalEditarVehiculo') as any;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();  
  }

  abrirModalVer(vehiculo: any) {
    this.editando = true;
    this.nuevaVehiculo = { 
      id: vehiculo.vehiculo_id,
      num_serie: vehiculo.num_serie,
      placa: vehiculo.placa,
      num_economico: vehiculo.num_economico,
      marca_id: vehiculo.marca_id,
      modelo_id: vehiculo.modelo_id,
      anio: vehiculo.anio
    };

    const modalElement = document.getElementById('modalEditarVisualizacion') as any;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();  
  }

actualizarVehiculo() {
  this.vehiculoService.updateVehicle(this.nuevaVehiculo.id, this.nuevaVehiculo).subscribe({
    next: () => {
      const modalElement = document.getElementById('modalEditarVehiculo') as any;
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
        title: 'Vehículo editado con éxito',
        icon: 'success',
      });

      this.loadVehiculos();
    },
    error: (error) => {
      // Validar si error es por duplicado (status 500 y mensaje específico)
      if (
        error.status === 500 &&
        error.error?.message?.includes('duplicate key value violates unique constraint')
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Error: Registro duplicado',
          text: 'Ya existe un vehículo con la misma placa, número de serie o número económico. Por favor verifica los datos.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el vehículo, intenta de nuevo.',
        });
      }
    }
  });
}


  eliminarVehiculo(id: number) {
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
        this.vehiculoService.deleteVehicle(id).subscribe(() => {
          this.loadVehiculos(); 
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: 'Vehículo eliminado con éxito',
            icon: 'success',
          });
        });
      }
    });
  }
}
