import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css'
})
export class PlatformManagementComponent {
  rol: string = ''; // Almacena el rol del usuario

  constructor(private router: Router, private usuarioService: UserService) {}

  ngOnInit(): void {
    this.usuarioService.getUserByToken().subscribe({
      next: (usuario: Usuario) => {
        // Extraer el nombre del rol del usuario (asumiendo que solo tiene un rol)
        if (usuario.rol && usuario.rol[0]?.nombre) {
          this.rol = usuario.rol[0].nombre.toLowerCase();
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario', err);
        // Manejar errores, como redirigir al login si no tiene permisos
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
