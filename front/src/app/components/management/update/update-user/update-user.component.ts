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
    roles: [],
    fecha_nacimiento: '',
    telefono: '', 
    direccion: '',
    genero: '',
    activo: ''
  };

  rolUsuario: string = ""
  roles: Rol[] = []
  selectedRole: string = '';

  message: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private rolService: RolService, private router: Router, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.usuarioId = this.config.data.usuarioId; 
    if (this.usuarioId) {
      this.getUserById(this.usuarioId); 
      this.loadRoles();
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  getUserById(id: string): void {
    this.userService.getUserById(id).subscribe(data => {
      this.usuario = data; 
      if (this.usuario.roles.length > 0) {
        this.selectedRole = this.usuario.roles[0].nombre;
      }

    }, error => {
      console.error('Error al obtener el usuario:', error);
    });
  }

  loadRoles(): void {
    this.rolService.getRoles().subscribe(data => {
      this.roles = data;
    }, error => {
      console.error('Error al cargar los roles:', error);
    })
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
    if (!this.selectedRole) {
      this.errorMessage = 'Debes seleccionar un rol.';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.usuario.roles = { nombre: this.selectedRole.trim() };

      this.userService.updateUser(this.usuario.id, this.usuario).subscribe(response => {
        this.message = 'Usuario actualizado exitosamente'
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, error => {
        console.error('Error al actualizar el usuario', error);
      });
    }    
  }
}