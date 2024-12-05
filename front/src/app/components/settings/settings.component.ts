import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  user: any = {}; // Para almacenar los datos del usuario

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserByToken(localStorage.getItem('user')).subscribe(data => {
      this.user = data; // Almacena los datos del usuario
    }, error => {
      console.error('Error al cargar los datos del usuario:', error);
    });
  }

  saveChanges() {
    // Aquí puedes implementar la lógica para guardar los cambios del usuario
    console.log('Datos del usuario a guardar:', this.user);
  }
}
