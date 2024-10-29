import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor (private authService: AuthService){}

  step: number = 1;

  registerData = {
    nombre: '',
    email: '',
    password: '',
    fecha_nacimiento: '',
    genero: ''
  };

  nextStep() {
    this.step += 1;
  }

  previousStep() {
    this.step -= 1;
  }

  submitForm() {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
      },
      error: (error) => {
        console.error('Error en el registro', error);
      }
    });
  }
}
