import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Errors } from '../../interfaces/errors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errors: Errors = {}; 

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errors = {}; // Limpiar errores previos
    if (!this.email.trim()) {
      this.errors.email = 'El correo electrónico es obligatorio.';
    }
  
    if (!this.password.trim()) {
      this.errors.password = 'La contraseña es obligatoria.';
    }
  
    if (Object.keys(this.errors).length > 0) {
      return; // Detener el login si hay errores de validación
    }
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento

  
    this.authService.getUserByToken(token).subscribe({
      next: (user) => {
        console.log('Respuesta del usuario:', user); // Agrega este log para verificar la respuesta
        if (!user) {
          console.error('Usuario no definido.');
          this.errors.login = 'No se pudo obtener el usuario.';
          return;
        }
    
        const roles = Array.isArray(user.Rol) ? user.Rol : [user.Rol];
        console.log('Roles del usuario:', roles); // Verificar los roles
    
        if (roles && roles.length > 0 && roles[0].nombre) {
          const userRole = roles[0].nombre;
          console.log('Rol del usuario:', userRole);
    
          if (userRole === 'Usuario') {
            this.router.navigate(['/home']);
          } else if (userRole === 'Artista' || userRole === 'Administrador') {
            this.router.navigate(['/selectAccess']);
          }
        } else {
          console.error('El usuario no tiene un rol asociado o Rol es undefined');
          this.errors.login = 'El usuario no tiene un rol asignado.';
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario por token:', error);
        this.errors.login = 'No se pudo obtener la información del usuario.';
      },
    });
    
  }
  
}
