import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../../interfaces/usuario';
import { RolService } from '../../../../services/rol.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  usuarioId!: string;

  usuario: any = {
    nombre: '',
    email: '',
    password: '',
    roles: []
  };

  roles: Rol[] = []; 
  rolesDisponibles: Rol[] = [];
  selectedRoles: Rol[] = [];

  constructor(private userService: UserService, private rolService: RolService, private router: Router, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.usuarioId = this.config.data.usuarioId; 

    if (this.usuarioId) {
      this.loadRoles(); 
      this.loadUser(); 
    }

    if (this.usuarioId) {
      this.getUserById(this.usuarioId); 
    }
  }

  getUserById(id: string): void {
    this.userService.getUserById(id).subscribe(data => {
      this.usuario = data; 
    }, error => {
      console.error('Error al obtener el usuario:', error);
    });
  }

  onSubmit(): void {
    this.usuario.roles = this.selectedRoles.map((rol: any) => rol.id);
  
    this.userService.updateUser(this.usuario.id, this.usuario).subscribe(response => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
  
    }, error => {
      console.error('Error al actualizar el usuario', error);
    });
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
  
        this.selectedRoles = this.usuario.roles.map((userRole: any) => {
          return {
            id: userRole.RolUsuario.rol_id, 
            nombre: userRole.nombre,      
          };
        });
    
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
  }
  
  removeRole(rol: Rol): void {
    this.selectedRoles = this.selectedRoles.filter(r => r.id !== rol.id);
    this.rolesDisponibles.push(rol);
  }
}