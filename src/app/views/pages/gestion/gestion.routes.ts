import { Routes } from "@angular/router";

export default [
  {
    path: 'vehiculos',
    loadComponent: () => import('./vehiculos/vehiculos.component').then(c => c.VehiculosComponent)
  },
  {
    path: 'marcas',
    loadComponent: () => import('./marcas/marcas.component').then(c => c.MarcasComponent)
  },
  {
    path: 'choferes',
    loadComponent: () => import('./choferes/choferes.component').then(c => c.ChoferesComponent)
  },
  {
    path: 'rutas',
    loadComponent: () => import('./rutas/rutas.component').then(c => c.RutasComponent)
  },
  {
    path: 'asignaciones',
    loadComponent: () => import('./asignaciones/asignaciones.component').then(c => c.AsignacionesComponent)
  }
] as Routes