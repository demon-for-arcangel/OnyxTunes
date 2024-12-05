import { Component } from '@angular/core';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { Errors } from '../../interfaces/errors';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: Errors = {};
  successMessage: string = '';

  onSubmit() {
    
  }
}
