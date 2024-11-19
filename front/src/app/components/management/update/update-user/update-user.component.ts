import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

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

  constructor(private userService: UserService, private router: Router, private config: DynamicDialogConfig) {}

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

      if (this.usuario.roles && Array.isArray(this.usuario.roles)) {
        this.rolUsuario = this.usuario.roles
          .map((role: any) => role.nombre)
          .join(', ');
      }
    }, error => {
      console.error('Error al obtener el usuario:', error);
    });
  }

  onSubmit(): void {
    this.userService.updateUser(this.usuario.id, this.usuario).subscribe(response => {
      alert('Usuario actualizado exitosamente'); //cambiar alert
      this.router.navigate(['/userManagement']);
    }, error => {
      console.error('Error al actualizar el usuario', error);
    });
  }
}