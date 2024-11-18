import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  user: any = {
    nombre: '',
    email: '',
    password: '',
    roles: []
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const email = this.getEmailFromSomewhere(); // Implementa esta función para obtener el email
    this.getUserByEmail(email); // Llamar a la función para obtener el usuario por email
  }

  getEmailFromSomewhere(): string {
    // Implementa la lógica para obtener el email del usuario actual
    // Esto podría ser de un servicio, almacenamiento local, etc.
    return 'usuario@example.com'; // Cambia esto por la lógica real
  }

  getUserByEmail(email: string): void {
    this.userService.getUserByEmail(email).subscribe(data => {
      this.user = data;
    }, error => {
      console.error('Error al obtener el usuario por email', error);
    });
  }

  onSubmit(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe(response => {
      alert('Usuario actualizado exitosamente');
      this.router.navigate(['/users']);
    }, error => {
      console.error('Error al actualizar el usuario', error);
    });
  }
}