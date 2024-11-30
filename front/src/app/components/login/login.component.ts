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
    this.errors = {}; 
    if (!this.email.trim()) {
      this.errors.email = 'El correo electrónico es obligatorio.';
    }

    if (!this.password.trim()) {
      this.errors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Iniciada la sesión');
        const token = response.token;
        localStorage.setItem('token', token);
        console.log(token)
        this.authService.getUserByToken(token).subscribe({
          next: (user) => {
            console.log(user); // hacer una consulta para saber a que id corresponde el rol
            if (user && user.rol && user.rol.length > 0) {
              const userRole = user.rol[0].nombre;

              if (userRole === 'Usuario') {
                this.router.navigate(['/home']);
              } else if (userRole === 'Artista' || userRole === 'Administrador') {
                this.router.navigate(['/selectAccess']);
              }
            }
          },
          error: (error) => {
            console.error('Error al obtener el usuario por token:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errors.login = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }
}
