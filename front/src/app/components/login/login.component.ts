import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/usuario';

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
  errors?: Usuario = {};

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Iniciada la sesión');
        const token = response.token; // Asegúrate de que response.token sea solo un string
        localStorage.setItem('token', token); // Guarda solo el token
        this.authService.getUserByToken(token).subscribe({
          next: (user) => {
            console.log(user)
            if (user && user.roles && user.roles.length > 0) {
              const userRole = user.roles[0].nombre; 
    
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
      }
    });    
  }
}
