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
}
