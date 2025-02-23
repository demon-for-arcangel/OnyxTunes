import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { Errors } from '../../interfaces/errors';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  user: any = {}; 
  errorMessages: Errors = {};
  successMessage: string = '';
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserByToken(localStorage.getItem('user')).subscribe(data => {
      this.user = data; 
      console.log(this.user)
      if (this.user.fecha_nacimiento) {
        this.user.fecha_nacimiento = this.formatDate(this.user.fecha_nacimiento);
      }
    }, error => {
      console.error('Error al cargar los datos del usuario:', error);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      console.log("Archivo seleccionado:", file);
      this.selectedFile = file;
      this.user.foto_perfil = URL.createObjectURL(file); 
    } else {
      console.error("No se seleccionó ningún archivo.");
    }
  }
  

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailPattern.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    const phonePattern = /^\d+$/; 
    return phonePattern.test(phone);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${year}-${month}-${day}`; 
  }

  saveChanges() {
    this.errorMessages = {}; 

    if (!this.user.nombre) {
      this.errorMessages.nombre = 'El nombre es obligatorio.';
    }
    if (!this.user.nickname) {
      this.errorMessages.nickname = 'El nombre de usuario es obligatorio.';
    }
    if (!this.user.email) {
      this.errorMessages.email = 'El email es obligatorio.';
    } else if (!this.validateEmail(this.user.email)) {
      this.errorMessages.email = 'El email no es válido.';
    }
    if (!this.user.genero) {
      this.errorMessages.genero = 'El género es obligatorio.';
    }
    if (!this.user.fecha_nacimiento) {
      this.errorMessages.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    } else {
      this.user.fecha_nacimiento = this.formatDate(this.user.fecha_nacimiento); 
    }
    if (!this.user.telefono) {
      this.errorMessages.telefono = 'El número de teléfono es obligatorio.';
    } else if (!this.validatePhoneNumber(this.user.telefono)) {
      this.errorMessages.telefono = 'El número de teléfono solo debe contener dígitos.';
    }

    if (Object.keys(this.errorMessages).length > 0) {
      console.error('Errores de validación:', this.errorMessages);
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.user.nombre);
    formData.append('nickname', this.user.nickname);
    formData.append('email', this.user.email);
    formData.append('genero', this.user.genero);
    formData.append('fecha_nacimiento', this.user.fecha_nacimiento);
    formData.append('telefono', this.user.telefono);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUser(this.user.id, formData).subscribe(
      (response) => {
        console.log('Usuario actualizado:', response);
        this.successMessage = 'Actualizado correctamente.';
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
}