/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Importa provideHttpClient
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Configura HttpClient para toda la aplicación
    ...appConfig.providers // Mantén los proveedores existentes de appConfig
  ]
}).catch((err) => console.error(err));