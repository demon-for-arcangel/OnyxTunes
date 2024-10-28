import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm: string = '';
  artists: string[] = ['Artista 1', 'Artista 2', 'Artista 3', 'Artista 4'];
  goToHome() {
    console.log('Redirigiendo a inicio...'); // Implementa la lógica de redirección
  }
  // Método para buscar artistas (puedes expandirlo para usarlo con un servicio)
  searchArtists() {
    // Implementar lógica para buscar artistas
    console.log('Buscando:', this.searchTerm);
  }

  goToLogin() {
    // Implementar redirección a la página de login
    console.log('Redirigiendo a login...');
  }

  goToRegister() {
    // Implementar redirección a la página de registro
    console.log('Redirigiendo a registro...');
  }
}
