import { Component } from '@angular/core';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { Errors } from '../../interfaces/errors';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [SidebarComponent, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  user: any = {}; 
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserByToken(localStorage.getItem('user')).subscribe(data => {
      this.user = data; 
    }, error => {
      console.error('Error al cargar los datos del usuario:', error);
    });
  }

  onSubmit() {
    const userId = this.user.id;

    if (userId) {
      this.userService.updatePassword(userId, this.currentPassword, this.newPassword, this.confirmPassword)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Contraseña actualizada correctamente'; 
            this.errorMessage = ''; 
          },
          error: (err) => {
            this.errorMessage = 'Error al actualizar la contraseña'; 
            this.successMessage = ''; 
          }
        });
    } else {
      this.errorMessage = 'ID de usuario no encontrado.';
    }
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
