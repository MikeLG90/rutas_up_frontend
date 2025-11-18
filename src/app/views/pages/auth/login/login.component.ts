import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService  } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

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

  recuperacion = {
    canal: '',
    dato: ''
  }

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the return URL from the route parameters, or default to ''
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  
medioSeleccionado: 'email' | 'whatsapp' | 'sms' | null = null;


 
  onLoggedin(e: Event) {
    e.preventDefault();
  
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Login Exitoso', response);
  
        if (response?.token) {
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario)); 
        
        

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
          this.router.navigate([redirectUrl]);
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
        console.error('❌ Error en el login', error);
        
        const errorMessage = error?.error?.message || 'Error desconocido en el inicio de sesión.';
        Swal.fire({
          icon: 'error',
          title: 'Error en el login',
          text: errorMessage,
        });
      }
    });
  }

  abrirModalRecuperar(): void {
  const modalElement = document.getElementById('recuperar') as HTMLElement;

  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  } else {
    console.error('⚠️ No se encontró el modal con ID "recuperar"');
  }
}

enviarRecuperacion() {
  this.authService.recuperarContrasena(this.recuperacion).subscribe({
    next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Ingresa a tu bandeja para ver en link de recuperación',
          icon: 'success',
        });
        
        const modalElement = document.getElementById('recuperacion') as any;
        const modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (modalInstance) {
          modalInstance.hide();
        }
    }
  });
}
  
}
