import { Component, OnInit } from '@angular/core';
import { RutaService } from '../../../../services/ruta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rutas-lista',
  standalone: true,
  imports: [],
  templateUrl: './rutas-lista.component.html',
  styleUrl: './rutas-lista.component.scss'
})
export class RutasListaComponent {
  rutas: any[] = [];

  constructor(private rutasService: RutaService, private router: Router) {}

ngOnInit(): void {
  this.cargarRutas();
}

cargarRutas(): void {
  this.rutasService.getRutas().subscribe({
    next: (data) => {
      this.rutas = data;
    },
    error: (error) => {
      console.error('Error al cargar rutas:', error);
    }
  });
}

eliminarRuta(id: number): void {
  if (confirm('¿Seguro que deseas eliminar esta ruta?')) {
    this.rutasService.borrarRuta(id).subscribe({
      next: () => {
        this.cargarRutas();
      },
      error: (error) => {
        console.error('Error al eliminar la ruta: ', error);
      }
    });
  }
}


irCrearRuta(): void {
  this.router.navigate(['/mapa']);
}
}
