import { Component, OnInit } from '@angular/core';
import { MarcasService } from '../../../../services/marcas.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import Swal from 'sweetalert2';

import $ from 'jquery';
import 'datatables.net-bs5';


@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [FormsModule, CommonModule, FeatherIconDirective],
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit {

  marcas: any[] = [];
  currentMarca: any = { marca: '' };  // Cambiado 'nombre' a 'marca'
  isEdit: boolean = false;
  closeResult = '';

  constructor(private marcasService: MarcasService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadMarcas();
  }

  ngOnDestroy(): void {
    // Destruir la instancia de DataTable para evitar errores al destruir el componente
    if ($.fn.dataTable.isDataTable('.table')) {
      $('.table').DataTable().destroy();
    }
  }

  loadMarcas() {
    this.marcasService.getMarcas().subscribe(data => {
      this.marcas = data;
      console.log(this.marcas); 
      this.initializeDataTable();
    });
  }
  

  // Inicializa el DataTable
  initializeDataTable() {
    // Destruir la instancia anterior de DataTable si existe
    if ($.fn.dataTable.isDataTable('#marcasTable')) {
      $('#marcasTable').DataTable().destroy();
    }

    // Inicializa DataTable
    $('#marcasTable').DataTable({
      data: this.marcas, // Usa los datos cargados
      columns: [
        { title: 'Marca', data: 'marca' }, // Usa 'marca' como clave del JSON
  
      ],
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      language: {
        "lengthMenu": "Mostrar _MENU_ registros por página",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando página _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros disponibles",
        "infoFiltered": "(filtrado de _MAX_ registros)",
        "search": "Buscar:"
      }
    });
  }

  // Abre el modal
  openModal(content: any, isEdit = false, marca?: any) {
    this.isEdit = isEdit;
    this.currentMarca = isEdit && marca ? { ...marca } : { marca: '' }; // Cambiado 'nombre' a 'marca'
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  // Lógica para cerrar el modal
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addMarca(modal: any) {
    if (!this.currentMarca?.marca?.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un nombre válido para la marca.',
      });
      return;
    }
    this.marcasService.createMarca(this.currentMarca).subscribe(() => {
      this.loadMarcas();
      modal.close();
      this.currentMarca = { marca: '' };  // Limpia el formulario después
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: '¡Marca agregada correctamente!',
        icon: 'success',
      });
    });
  }

  updateMarca(modal: any) {
    if (!this.currentMarca?.marca?.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un nombre válido para la marca.',
      });
      return;
    }
    this.marcasService.updateMarca(this.currentMarca.id, this.currentMarca).subscribe(() => {
      this.loadMarcas();
      modal.close();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: '¡Marca actualizada correctamente!',
        icon: 'success',
      });
    });
  }

  deleteMarca(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.marcasService.deleteMarca(id).subscribe(() => {
          this.loadMarcas();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: '¡Marca eliminada correctamente!',
            icon: 'success',
          });
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la marca.',
          });
        });
      }
    });
  }
}
