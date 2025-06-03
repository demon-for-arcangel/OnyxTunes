import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { Errors } from '../../interfaces/errors';
import { RecommendationService } from '../../services/recommendation.service';

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
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private recommendationService: RecommendationService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.checkRecommendationStatus();
  }

  loadUserData() {
    this.authService.getUserByToken(localStorage.getItem('user')).subscribe(data => {
      this.user = data; 
      if (this.user.fecha_nacimiento) {
        this.user.fecha_nacimiento = this.formatDate(this.user.fecha_nacimiento);
      }
    }, error => {
      console.error('Error al cargar los datos del usuario:', error);
    });
  }

  checkRecommendationStatus() {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
      console.error("Token no encontrado");
      return;
    }

    this.authService.getUserByToken(tokenObject).subscribe({
      next: (usuario) => {
        if (usuario?.id) {
          const userId = usuario.id.toString();
          this.recommendationService.getRecommendationStatus(userId).subscribe({
            next: (status: boolean) => {
              this.user.recommendationsEnabled = status;
            },
            error: (err) => {
              console.error("Error al obtener el estado de recomendaciones:", err);
            }
          });
        } 
      },
      error: (err) => {
        console.error("Error al obtener usuario desde el token:", err);
      }
    });
  }

  toggleRecommendations() {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
      console.error("Token no encontrado");
      return;
    }

    this.authService.getUserByToken(tokenObject).subscribe({
      next: (usuario) => {
        if (usuario?.id) {
          const userId = usuario.id.toString();
          this.recommendationService.updateRecommendationStatus(userId, this.user.recommendationsEnabled).subscribe({
            next: () => {
              this.successMessage = "Estado de recomendaciones actualizado.";
              setTimeout(() => {
                this.successMessage = "";
              }, 3000);
            },
            error: (err) => {
              this.errorMessage = "Error al actualizar el estado de recomendaciones.";
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
            }
          });
        }
      },
      error: (err) => {
        console.error("Error al obtener usuario desde el token:", err);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
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
        this.successMessage = 'Actualizado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        this.errorMessage = "Error al actualizar el usuario.";
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    );
  }
}