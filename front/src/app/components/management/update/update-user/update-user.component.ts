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

  rolUsuario: string = ""
  roles: Rol[] = []
  selectedRole: string = '';

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

  onSubmit(): void {
    this.usuario.roles = { nombre: this.selectedRole.trim() };
    this.userService.updateUser(this.usuario.id, this.usuario).subscribe(response => {
      alert('Usuario actualizado exitosamente'); //cambiar alert
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    }, error => {
      console.error('Error al actualizar el usuario', error);
    });
  }
}