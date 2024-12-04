import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  isPlaying: boolean = false; // Estado de reproducción
  isRandom: boolean = false; // Estado de aleatorio
  isLoop: boolean = false; // Estado de bucle

  play() {
    this.isPlaying = true;
    console.log('Reproduciendo...');
    // Aquí puedes agregar la lógica para reproducir la canción
  }

  pause() {
    this.isPlaying = false;
    console.log('Pausado');
    // Aquí puedes agregar la lógica para pausar la canción
  }

  next() {
    console.log('Siguiente canción');
    // Aquí puedes agregar la lógica para ir a la siguiente canción
  }

  previous() {
    console.log('Canción anterior');
    // Aquí puedes agregar la lógica para ir a la canción anterior
  }

  toggleRandom() {
    this.isRandom = !this.isRandom; // Cambia el estado de aleatorio
    console.log(`Aleatorio: ${this.isRandom}`);
  }

  toggleLoop() {
    this.isLoop = !this.isLoop; // Cambia el estado de bucle
    console.log(`Bucle: ${this.isLoop}`);
  }
}
