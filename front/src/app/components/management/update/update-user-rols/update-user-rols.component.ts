import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../../interfaces/usuario';
import { RolService } from '../../../../services/rol.service';

@Component({
  selector: 'app-update-user-rols',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-user-rols.component.html',
  styleUrls: ['./update-user-rols.component.css']
})
export class UpdateUserRolsComponent {
  usuarioId!: string;
  showRoles: boolean = false;

  usuario: any = {
    nombre: '',
    email: '',
    roles: []
  };

  roles: Rol[] = []; // Todos los roles disponibles
  selectedRoles: Rol[] = []; // Roles asignados al usuario
  message: string = '';
  errorMessage: string = '';

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

  loadUser(): void {
    this.userService.getUserById(this.usuarioId).subscribe({
      next: (user) => {
        this.usuario = user; // Carga los datos del usuario
        console.log('Usuario cargado:', this.usuario);
  
        // Extraemos y cargamos los roles del usuario
        this.selectedRoles = this.usuario.roles.map((userRole: { id: number; nombre: string }) => ({
          id: userRole.id,
          nombre: userRole.nombre,
          selected: true, // Marcamos estos roles como seleccionados
        }));
  
        // Actualizamos la lista de roles disponibles para que no incluyan los roles seleccionados
        this.roles = this.roles.filter((rol) => 
          !this.selectedRoles.some((selectedRole) => selectedRole.id === rol.id)
        );
  
        console.log('Roles de Usuario cargados:', this.selectedRoles);
        console.log('Roles Disponibles actualizados:', this.roles);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      },
    });
  }
  
  
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles: Rol[]) => {
        // Actualizamos los roles disponibles, excluyendo los ya seleccionados
        this.roles = roles.filter((rol: Rol) =>
          !this.selectedRoles.some((selectedRole) => selectedRole.id === rol.id)
        );
  
        console.log('Roles Disponibles actualizados:', this.roles);
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      },
    });
  }
  
  

  // Alterna la visibilidad del contenedor de roles
  toggleRoleSelection(): void {
    this.showRoles = !this.showRoles;
  }

  // Agrega un rol al usuario
  addRole(rol: Rol): void {
    if (!this.selectedRoles.some((selectedRole) => selectedRole.id === rol.id)) {
      // Mover rol de "Disponibles" a "Seleccionados"
      this.selectedRoles.push({ ...rol, selected: true });
      // Eliminar el rol de la lista de "Disponibles"
      this.roles = this.roles.filter((availableRole) => availableRole.id !== rol.id);
    }
  }
  

  removeRole(rol: Rol): void {
    // Mover rol de "Roles de Usuario" a "Disponibles"
    this.selectedRoles = this.selectedRoles.filter((selectedRole) => selectedRole.id !== rol.id);
    // Añadir el rol de nuevo a la lista de "Roles Disponibles"
    this.roles.push({ ...rol, selected: false });
  }
  
}
