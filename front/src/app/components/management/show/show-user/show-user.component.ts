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

  rolesString: string = '';

  ngOnInit(): void {
    this.usuarioId = this.config.data.usuarioId; 
    if (this.usuarioId) {
      this.getUserById(this.usuarioId); 
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  getUserById(id: string): void {
    this.userService.getUserById(id).subscribe(data => {
        this.usuario = data;
        this.usuario.activo = this.usuario.activo === 'true' || this.usuario.activo === true; // Convertir a booleano
        this.rolesString = this.getRoles(this.usuario.roles); // Almacena el resultado en rolesString
    }, error => {
        console.error('Error al obtener el usuario:', error);
    });
}

  getRoles(roles: any[]): string {
      if (!roles || roles.length === 0) {
          return 'Sin rol';
      }
      return roles.map(role => role.nombre).join(', ');
  }
}
