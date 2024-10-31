import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  step: number = 1;
  registerData: Usuario = {}; 
  errors?: Usuario = {}; 

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  validateNombre() {
    if (!this.registerData?.nombre?.trim()) { 
      this.errors!.nombre = 'El nombre es obligatorio.';
      return false;
    }
    if (this.registerData.nombre.trim().length < 3) {
      this.errors!.nombre = 'El nombre debe tener al menos 3 caracteres.';
      return false;
    }
    this.errors!.nombre = '';
    return true;
  }

  validateEmail() {
    if (!this.registerData?.email?.trim()) {
      this.errors!.email = 'El correo electrónico es obligatorio.';
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.registerData.email)) {
      this.errors!.email = 'El correo electrónico no es válido.';
      return false;
    } 
    this.errors!.email = '';
    return true;
  }  

  validatePassword() {
    if (!this.registerData.password || this.registerData.password.length < 6) {
      this.errors!.password = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }
    this.errors!.password = '';
    return true;
  }

  validateFechaNacimiento() {
    if (!this.registerData?.fecha_nacimiento?.trim()) {
      this.errors!.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
      return false;
    }

    const today = new Date();
    const birthDate = new Date(this.registerData.fecha_nacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (isNaN(birthDate.getTime()) || age < 13) {
      this.errors!.fecha_nacimiento = 'Debes tener al menos 13 años.';
      return false;
    }

    this.errors!.fecha_nacimiento = '';
    return true;
  }

  validateGenero() {
    if (!this.registerData?.genero) {
      this.errors!.genero = 'Por favor, selecciona un género.';
      return false;
    }
    this.errors!.genero = '';
    return true;
  }

  nextStep() {
    if (
      (this.step === 1 && this.validateNombre() && this.validateEmail()) ||
      (this.step === 2 && this.validatePassword()) ||
      (this.step === 3 && this.validateFechaNacimiento() && this.validateGenero())
    ) {
      this.step += 1;
    }
  }

  previousStep() {
    this.step -= 1;
  }

  submitForm() {
    if (this.validateNombre() && this.validateEmail() && this.validatePassword() && this.validateFechaNacimiento() && this.validateGenero()) {
      this.authService.register(this.registerData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/gustosMusicales']);
        },
        error: (error) => {
          console.error('Error en el registro', error);
        }
      });
    }
  }
}
