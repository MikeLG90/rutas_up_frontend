import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { RutaService } from '../../../../services/ruta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'] // Corrección aquí (antes estaba styleUrl)
})
export class MapaComponent implements AfterViewInit {
  private map!: L.Map; // Se asegura que `map` es del tipo `L.Map`
  private markers: L.Marker[] = [];
  private routingControl: L.Routing.Control | null = null; // Mejor manejo de null
  private routeCoordinates: string = '';

  constructor(private rutasService: RutaService, private router: Router) {}

  ngAfterViewInit(): void {
    console.log('Mapa inicializado');
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('mapa').setView([18.501, -88.296], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Corregir problema de carga con invalidateSize
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.addMarker(event.latlng);
    });
  }

  private addMarker(latlng: L.LatLng): void {
    const marker = L.marker(latlng, { draggable: true }).addTo(this.map);
    this.markers.push(marker);
  }

  public drawRoute(): void {
    if (this.markers.length < 2) {
      alert('Selecciona al menos dos puntos');
      return;
    }

    // Eliminar ruta anterior si ya existe
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }

    const waypoints = this.markers.map(marker => marker.getLatLng());

    this.routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true
    }).addTo(this.map);
    

    this.routeCoordinates = waypoints
      .map(point => `${point.lat},${point.lng}`)
      .join(';');
  }

  public saveRoute(): void {
    const nombre_ruta = prompt('Nombre de la ruta: ');

    if (!nombre_ruta || this.routeCoordinates === '') {
      alert('Faltan Datos');
      return;
    }

    const ruta = {
      nombre_ruta: nombre_ruta,
      puntos: this.routeCoordinates
    };

    this.rutasService.crearRuta(ruta).subscribe({
      next: () => {
        alert('Ruta generada con éxito');
        this.router.navigate(['/rutas']);
      },
      error: (error) => console.error('Error al generar la ruta: ', error)
    });    
  }
}
