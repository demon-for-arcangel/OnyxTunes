import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MailService } from '../../../services/mail.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-request-reset',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './request-reset.component.html',
  styleUrl: './request-reset.component.css'
})
export class RequestResetComponent {
  resetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private mailServices: MailService, private router: Router) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  sendResetEmail() {
    if (this.resetForm.valid) {
      const email = this.resetForm.get('email')?.value;
      this.mailServices.sendMail({email: email}).subscribe(
        (response: any) => { 
          this.router.navigate(['/']); 
        },
        (error: any) => { 
          console.error('Error al enviar el correo de restablecimiento', error);
        }
      );
    }
  }
}
