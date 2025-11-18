import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    RouterLink
  ],
  providers: [
    HttpClient, 
    AuthService 
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  user = {
    nombre: '',
    ap_materno: '',
    ap_paterno: '',
    email: '',
    contrasena: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  onRegister(e: Event) {
    e.preventDefault();
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Usuario Registrado con Éxito', response);

                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    title: '¡Inicio de sesión exitoso!',
                    icon: 'success',
                  });

                  
        localStorage.setItem('isLoggedin', 'true');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al registrar', error);
      }
    });
  }
  

}
