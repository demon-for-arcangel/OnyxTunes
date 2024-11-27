import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../interfaces/usuario'; // Asegúrate de que Rol esté definido correctamente
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-update-user-rols',
  templateUrl: './update-user-rols.component.html',
  styleUrls: ['./update-user-rols.component.css']
})
export class UpdateUserRolsComponent {
  usuarioId!: string;

  usuario: any = {
    nombre: '',
    email: '',
    roles: [] // Aquí se almacenan los roles actuales del usuario
  };

  roles: Rol[] = []; // Todos los roles disponibles
  rolesDisponibles: Rol[] = []; // Roles que no están asignados al usuario
  selectedRoles: Rol[] = []; // Roles seleccionados para el usuario

  constructor(
    private userService: UserService,
    private rolService: RolService,
    private router: Router,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.config.data.usuarioId;
    if (this.usuarioId) {
      this.loadRoles();
      this.loadUser();
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  // Cargar todos los roles disponibles
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles cargados:', this.roles);
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      }
    });
  }

  // Cargar información del usuario y sus roles
  loadUser(): void {
    this.userService.getUserById(this.usuarioId).subscribe({
      next: (user) => {
        this.usuario = user;
        console.log('Usuario cargado:', this.usuario);

        // Procesar los roles del usuario
        this.selectedRoles = this.usuario.roles.map((userRole: { id: number; nombre: string }) => {
          return {
            id: userRole.id,
            nombre: userRole.nombre
          };
        });

        console.log('Roles seleccionados del usuario:', this.selectedRoles);

        // Filtrar los roles disponibles excluyendo los que ya están asignados al usuario
        this.rolesDisponibles = this.roles.filter((rol: Rol) =>
          !this.selectedRoles.some((selectedRole) => selectedRole.id === rol.id)
        );

        console.log('Roles disponibles después de filtrar:', this.rolesDisponibles);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    });
  }

  // Método para agregar un rol
  addRole(rol: Rol): void {
    this.selectedRoles.push(rol);
    this.rolesDisponibles = this.rolesDisponibles.filter(r => r.id !== rol.id);
  }

  // Método para eliminar un rol
  removeRole(rol: Rol): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.id !== rol.id);
    this.rolesDisponibles.push(rol);
  }
}
