import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Rol, RolSeleccionado } from '../../../../interfaces/usuario';
import { RolService } from '../../../../services/rol.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  usuarioId!: string;
  showRoles: boolean = false; 

  usuario: any = {
    nombre: '',
    email: '',
    password: '',
    roles: [],
    fecha_nacimiento: '',
    telefono: '', 
    direccion: '',
    genero: '',
    activo: ''
  };

  roles: RolSeleccionado[] = [];
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
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles.map(rol => ({
          ...rol,
          selected: false 
        }));
        console.log('Roles cargados:', this.roles); 
        this.loadUser(); 
      },
      error: error => {
        console.error('Error al cargar los roles:', error);
      }
    });
  }

  loadUser(): void {
    this.userService.getUserById(this.usuarioId).subscribe({
      next: (user) => {
        this.usuario = user; // Usuario completo cargado
        console.log('Usuario cargado:', this.usuario);
        
        // Comparar y marcar roles seleccionados
        this.roles.forEach((rol) => {
          rol.selected = this.usuario.roles.some(
            (userRole: any) => userRole.id === rol.id // Asegúrate de que `id` sea el campo correcto
          );
        });
        
        console.log('Roles después de asignar seleccionados:', this.roles);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      },
    });
  }
  

  toggleRoleSelection(): void {
    this.showRoles = !this.showRoles; 
  }

  getCurrentRoles(): string {
    return this.usuario.roles.map((rol: any) => rol.nombre).join(', '); 
  }

  validateForm(): boolean {
    this.errorMessage = ''; 
    if (!this.usuario.nombre) {
      this.errorMessage = 'El nombre no puede estar vacío.';
      return false;
    }
    if (!this.usuario.email) {
      this.errorMessage = 'El correo electrónico no puede estar vacío.';
      return false;
    }
    if (!this.isValidEmail(this.usuario.email)) {
      this.errorMessage = 'El correo electrónico no es válido.';
      return false;
    }
    if (!this.hasSelectedRoles()) {
      this.errorMessage = 'Debes seleccionar al menos un rol.';
      return false;
    }
    return true;
  }

  hasSelectedRoles(): boolean {
    return this.roles.some(rol => rol.selected); 
  }

  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.usuario.roles = this.roles.filter(rol => rol.selected).map(rol => ({ id: rol.id }));

      this.userService.updateUser(this.usuarioId, this.usuario).subscribe(response => {
        this.message = 'Usuario actualizado exitosamente';
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, error => {
        console.error('Error al actualizar el usuario', error);
      });
    }    
  }
}
