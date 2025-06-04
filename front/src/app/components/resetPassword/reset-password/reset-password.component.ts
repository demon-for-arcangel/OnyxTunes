import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailService } from '../../../services/mail.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token!: string;
  newPassword!: string;
  confirmPassword!: string;
  successMessage: string = "";
  errorMessage: string = "";

  constructor(private route: ActivatedRoute, private mailService: MailService) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    })
  }

  ngOnInit(): void{}

  onSubmit(): void {
    if (this.newPassword === this.confirmPassword) {
      this.mailService.resetPassword(this.token, { newPassword: this.newPassword, confirmPassword: this.confirmPassword }).subscribe({
        next: () => {
          this.successMessage = "Contraseña restablecida con éxito.";
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        },
        error: (error: any) => {
          this.errorMessage = "Error al restablecer la contraseña.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);        },
      });
    } else {
      this.errorMessage = "Las contraseñas no coinciden.";
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
      console.error("Las contraseñas no coinciden");
    }
  }
}
