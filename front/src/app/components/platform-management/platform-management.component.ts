import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css'
})
export class PlatformManagementComponent {
  rol: string = '';
  constructor(private router: Router, private usuarioService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const tokenObject = localStorage.getItem('token'); // Obtén el token del almacenamiento
    this.authService.getUserByToken(tokenObject).subscribe({
      next: (usuario: Usuario | undefined) => {
        if (usuario && usuario.Rol && usuario.Rol[0]?.nombre) {
          this.rol = usuario.Rol[0].nombre.toLowerCase();
          console.log(this.rol);
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario', err);
        this.router.navigate(['/login']);
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/platform/${path}`]);
  } 

  canAccess(section: string): boolean {
    const accessRules: { [key: string]: boolean } = {
      userManagement: this.rol === 'Administrador',
      musicManagement: this.rol === 'Administrador' || this.rol === 'Artista'
    };

    return accessRules[section];
  }
}
