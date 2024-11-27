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
      this.loadRoles(); // Carga los roles disponibles
      this.loadUser();  // Carga los roles del usuario
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }
  
  filterAvailableRoles(): void {
    if (!this.roles || !this.selectedRoles) {
      console.warn('Roles o roles seleccionados no están definidos.');
      return;
    }
  
    this.rolesDisponibles = this.roles.filter((rol) => {
      const isSelected = this.selectedRoles.some(
        (selectedRole) => selectedRole.id === rol.id
      );
      return !isSelected;
    });
  
    console.log('Después de filtrar: roles disponibles', this.rolesDisponibles);
  }
  
  
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Todos los roles disponibles:', this.roles);
        this.filterAvailableRoles(); // Llama al filtro después de cargar los roles
      },
      error: (error) => {
        console.error('Error al cargar los roles desde la API:', error);
      }
    });
  }
  
  loadUser(): void {
    this.userService.getUserById(this.usuarioId).subscribe({
      next: (user) => {
        this.usuario = user;
        console.log('Usuario cargado desde la API:', this.usuario);
  
        // Extraer roles correctamente
        this.selectedRoles = this.usuario.roles.map((userRole: any) => {
          return {
            id: userRole.RolUsuario.rol_id, // Obtener el id del rol desde RolUsuario
            nombre: userRole.nombre,       // Obtener el nombre directamente
          };
        });
  
        console.log('Roles asignados al usuario:', this.selectedRoles);
  
        // Llamar al filtrado después de cargar usuario y roles
        this.filterAvailableRoles();
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
      }
    });
  }
  
  

  // Método para agregar un rol
  addRole(rol: Rol): void {
    this.selectedRoles.push(rol);
    this.rolesDisponibles = this.rolesDisponibles.filter(r => r.id !== rol.id);
    console.log('Roles después de añadir:', this.selectedRoles, this.rolesDisponibles);
  }

  // Método para eliminar un rol
  removeRole(rol: Rol): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.id !== rol.id);
    this.rolesDisponibles.push(rol);
    console.log('Roles después de eliminar:', this.selectedRoles, this.rolesDisponibles);
  }
}
