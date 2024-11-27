import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../interfaces/usuario'; 
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
    roles: [] 
  };

  roles: Rol[] = []; 
  rolesDisponibles: Rol[] = [];
  selectedRoles: Rol[] = [];

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
    }
  }
  
  filterAvailableRoles(): void {
    if (!this.roles || !this.selectedRoles) {
      return;
    }
  
    this.rolesDisponibles = this.roles.filter((rol) => {
      const isSelected = this.selectedRoles.some(
        (selectedRole) => selectedRole.id === rol.id
      );
      return !isSelected;
    });
  }
  
  
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Todos los roles disponibles:', this.roles);
        this.filterAvailableRoles(); 
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
  
        this.selectedRoles = this.usuario.roles.map((userRole: any) => {
          return {
            id: userRole.RolUsuario.rol_id, 
            nombre: userRole.nombre,      
          };
        });
  
        console.log('Roles asignados al usuario:', this.selectedRoles);
  
        this.filterAvailableRoles();
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
      }
    });
  }
  
  addRole(rol: Rol): void {
    this.selectedRoles.push(rol);
    this.rolesDisponibles = this.rolesDisponibles.filter(r => r.id !== rol.id);
    console.log('Roles después de añadir:', this.selectedRoles, this.rolesDisponibles);
  }

  removeRole(rol: Rol): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.id !== rol.id);
    this.rolesDisponibles.push(rol);
    console.log('Roles después de eliminar:', this.selectedRoles, this.rolesDisponibles);
  }

  actualizarRoles(): void {
    const rolesIds = this.selectedRoles.map((role) => role.id);
    
    const usuarioActualizado = {
      ...this.usuario,
      roles: rolesIds, 
    };
  
    this.userService.updateUser(this.usuarioId, usuarioActualizado).subscribe({
      next: (response) => {
        setTimeout(() => {
          window.location.reload()
        }, 2000);
        console.log('Roles actualizados exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al actualizar los roles:', error);
      },
    });
  }
  
}
