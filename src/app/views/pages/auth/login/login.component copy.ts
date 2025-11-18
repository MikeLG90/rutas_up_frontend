import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService  } from '../../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  credentials = {
    email: '',
    contrasena: ''
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the return URL from the route parameters, or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

 
  onLoggedin(e: Event) {
    e.preventDefault();
  
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login Exitoso', response);
  
        if (response.token && response.user) {
          
          // almacenar datos del usuario
          this.authService.setUserData(response.token, response.user);

          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: '¡Inicio de sesión exitoso!',
            icon: 'success',
          });
  
          // Asegurarse de que returnUrl sea válido, sino redirigir a home
          const redirectUrl = this.returnUrl && this.returnUrl !== '/' ? this.returnUrl : '/dashboard';
          this.router.navigateByUrl('/dashboard', { replaceUrl: true });
            } else {
          console.error('⚠ No se recibió un token en la respuesta.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se recibió un token válido en la respuesta.',
          });
        }
      },
      error: (error) => {
        console.error('Error en el login', error);
        
        const errorMessage = error?.error?.message || 'Error desconocido en el inicio de sesión.';
        Swal.fire({
          icon: 'error',
          title: 'Error en el login',
          text: errorMessage,
        });
      }
    });
  }
  
}
