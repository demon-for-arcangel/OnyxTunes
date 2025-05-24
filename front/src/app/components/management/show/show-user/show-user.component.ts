import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { RolService } from '../../../../services/rol.service';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Rol } from '../../../../interfaces/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.css'
})
export class ShowUserComponent {
  usuarioId!: string;

  usuario: any = {
    nombre: '',
    email: '',
    password: '',
    rol: null,
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
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  getUserById(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuario.activo = this.usuario.activo === 'true' || this.usuario.activo === true; 
        this.loadRol(this.usuario.rol); 
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }

  loadRol(rolId: number): void {
    if (rolId !== undefined && rolId !== null) {
      this.rolService.getRolesById(rolId).subscribe({
        next: (rol) => {
          this.rolUsuario = rol.nombre;
        },
        error: (error) => {
          console.error(`Error al obtener el rol con ID ${rolId}:`, error);
          this.rolUsuario = 'Rol no encontrado';
        }
      });
    } else {
      console.error('El usuario no tiene un rol asociado.');
      this.rolUsuario = 'Sin rol asignado';
    }
  }
}
