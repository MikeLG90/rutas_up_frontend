import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
    {
        path: 'email',
        loadComponent: () => import('./email/email.component').then(c => c.EmailComponent),
        children: [
            { path: '', redirectTo: 'inbox', pathMatch: 'full' },
            {
                path: 'inbox',
                loadComponent: () => import('./email/inbox/inbox.component').then(c => c.InboxComponent)
            },
            {
                path: 'read',
                loadComponent: () => import('./email/read/read.component').then(c => c.ReadComponent)
            },
            {
                path: 'compose',
                loadComponent: () => import('./email/compose/compose.component').then(c => c.ComposeComponent)
            }
        ]
    },
    {
        path: 'chat',
        loadComponent: () => import('./chat/chat.component').then(c => c.ChatComponent)
    },
    {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(c => c.CalendarComponent)
    },

    // Nueva ruta para rutas
    {
        path: 'rutas',
        loadComponent: () => import('./rutas-lista/rutas-lista.component').then(c => c.RutasListaComponent)
    },

    // Nueva ruta para el mapa
    {
        path: 'mapa',
        loadComponent: () => import('./mapa/mapa.component').then(c => c.MapaComponent)
    },
    {
        path: 'mapa-route',
        loadComponent: () => import('./mapa-router/mapa-router.component').then(c => c.MapaRouterComponent)
    },
    {
        path: 'logs',
        loadComponent: () => import('./logs/logs.component').then(c => c.LogsComponent)
    },
    {
        path: 'route-planner',
        loadComponent: () => import('./route-planner/route-planner.component').then(c => c.RoutePlannerComponent)
    },
    {
        path: 'documentos',
        loadComponent: () => import('./documentos/documentos.component').then(c => c.DocumentosComponent)
    },
    {
        path: 'camara',
        loadComponent: () => import('./camaras/camaras.component').then(c => c.CamarasComponent)
    }
] as Routes;
