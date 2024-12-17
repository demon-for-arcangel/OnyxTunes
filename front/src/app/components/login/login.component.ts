import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Errors } from '../../interfaces/errors';
import { UserService } from '../../services/user.service';
import { RolService } from '../../services/rol.service';

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

  constructor(private userService: UserService, private router: Router, private authService: AuthService, private rolService: RolService) {}

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
    console.log(this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (token) => {
          console.log('Inicio de sesión exitoso, token:', token);
          this.getDatos()
      },
      error: (err) => {
          console.error('Error al iniciar sesión:', err.message);
      }
  });
  }

  getDatos(){
    this.userService.getUserByEmail(this.email).subscribe({
      next: (user) => {
        console.log('Usuario recibido:', user); 
        if (user ) {
          this.handleUserResponse(user); 
        } else {
          this.errors.login = 'Credenciales incorrectas.';
        }
      },
      error: (error) => this.handleError(error)
    });
  }
   

  handleUserResponse(user: any) {
    console.log('Respuesta del usuario:', user);
  
    if (!user || !user.rol) {  // Verificar que el usuario y su rol existan
      console.error('Usuario o ID de rol no definido.');
      this.errors.login = 'No se pudo obtener el rol del usuario.';
      return;
    }
  
    // Obtener el nombre del rol mediante el servicio
    const roleId = user.rol;
    this.rolService.getRolesById(roleId).subscribe({
      next: (role) => {
        console.log('Nombre del rol obtenido:', role.nombre);
  
        if (role.nombre === 'Usuario') {
          this.router.navigate(['/home']);
        } else if (role.nombre === 'Artista' || role.nombre === 'Administrador') {
          this.router.navigate(['/selectAccess']);
        } else {
          console.warn('Rol desconocido:', role.nombre);
          this.errors.login = 'Rol del usuario no reconocido.';
        }
      },
      error: (err) => {
        console.error('Error al obtener el rol:', err);
        this.errors.login = 'Error al obtener el rol del usuario.';
      }
    });
  }
  

  handleError(error: any) {
    console.error('Error al obtener el usuario:', error);
    this.errors.login = 'No se pudo obtener la información del usuario.';
  }
}

