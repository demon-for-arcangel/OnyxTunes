import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  searchTerm: string = '';
  artists: string[] = ['Artista 1', 'Artista 2', 'Artista 3', 'Artista 4'];
  albumes: string[] = ['album1', 'album 2', 'album 3', 'album 4'];
  listas: string[] = ['lista 1', 'lista 2', 'lista 3', 'lista 4'];
  
  constructor(private router: Router){}

  goToHome() {
    console.log('Redirigiendo a inicio...');
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
    this.router.navigate(['/register']);
  }
}