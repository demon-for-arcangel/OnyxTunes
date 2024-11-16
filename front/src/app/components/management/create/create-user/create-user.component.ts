import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../../services/user.service';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../interfaces/usuario';

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
export class CreateUserComponent implements OnInit {
  nombre: string = '';
  email: string = '';
  password: string = '';
  rol: string = '';
  roles: Rol[] = [];
  
  errors: any = {};
  showPassword: boolean = false;

  constructor(public ref: DynamicDialogRef, private userService: UserService, private rolService: RolService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.rolService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  validateForm() {
    this.errors = {};
    let isValid = true;
    
    if (!this.nombre) {
      this.errors.nombre = 'El nombre es requerido';
      isValid = false;
    }
    
    if (!this.email) {
      this.errors.email = 'El email es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors.email = 'El email no es válido';
      isValid = false;
    }
    
    if (!this.password) {
      this.errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (this.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }
    
    if (!this.rol) {
      this.errors.rol = 'El rol es requerido';
      isValid = false;
    }
  
    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      const userData = {
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        roles: [this.rol]
      };

      console.log(userData);
  
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
