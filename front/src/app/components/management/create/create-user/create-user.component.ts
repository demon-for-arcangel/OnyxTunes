import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  rol: string = '';
  
  errors: any = {};

  showPassword: boolean = false;

  constructor(public ref: DynamicDialogRef, private userService: UserService) {}

  validateForm() {
    this.errors = {};
    
    if (!this.nombre) {
      this.errors.nombre = 'El nombre es requerido';
    }
    
    if (!this.email) {
      this.errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors.email = 'El email no es válido';
    }
    
    if (!this.password) {
      this.errors.password = 'La contraseña es requerida';
    } else if (this.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!this.rol) {
      this.errors.rol = 'El rol es requerido';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit() {
    if (this.validateForm()) {
      const userData = {
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        rol: this.rol
      };
  
      this.userService.createUsuario(userData).subscribe({
        next: (response) => {
          this.ref.close(response);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          if (error.error?.errors) {
            this.errors = error.error.errors;
          }
        }
      });
    }
  }

  onCancel() {
    this.ref.close();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}