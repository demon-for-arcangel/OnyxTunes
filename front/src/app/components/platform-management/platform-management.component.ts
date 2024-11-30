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
  roles: string[] = []; // Almacena los roles del usuario

  constructor(private router: Router, private usuarioService: UserService) {}

  ngOnInit(): void {
    this.usuarioService.getUserByToken().subscribe({
      next: (usuario: Usuario) => {
        // Extraer los nombres de los roles del usuario
        this.roles = usuario.roles.map(role => role.nombre.toLowerCase());
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
    // Define las reglas de acceso para cada sección
    const accessRules = {
      userManagement: this.roles.includes('administrador'),
      musicManagement: this.roles.includes('administrador') || this.roles.includes('artista')
    };

    return accessRules[section];
  }
}
