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
  @Input() usuarioId!: string;

  usuario: any = {
    nombre: '',
    email: '',
    password: '',
    roles: []
  };

  constructor(private userService: UserService, private router: Router, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    // Si se pasa el usuarioId, hacer la consulta para obtener los datos del usuario
    if (this.usuarioId) {
      this.getUserById(this.usuarioId);
    } else {
      // Si no se pasa el ID, puedes manejarlo como desees
      console.error('No se proporcionó el usuarioId');
    }
  }

  getUserById(id: string): void {
    this.userService.getUserById(id).subscribe(data => {
      this.usuario = data; 
      console.log(this.usuario); 
    }, error => {
      console.error('Error al obtener el usuario:', error);
    });
  }

  onSubmit(): void {
    this.userService.updateUser(this.usuario.id, this.usuario).subscribe(response => {
      alert('Usuario actualizado exitosamente');
      this.router.navigate(['/userManagement']);
    }, error => {
      console.error('Error al actualizar el usuario', error);
    });
  }
}