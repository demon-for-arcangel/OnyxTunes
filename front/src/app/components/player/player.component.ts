import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  isPlaying: boolean = false;
  isRandom: boolean = false;
  isLoop: boolean = false;
  currentSong: any = null;

  playSong(song: any) {
    this.currentSong = song; 
    this.play(); 
  }

  play() {
    if (this.currentSong) {
      console.log('Reproduciendo:', this.currentSong);
      this.isPlaying = true;
    }
  }

  pause() {
    this.isPlaying = false;
    console.log('Pausado');
    
  }

  next() {
    console.log('Siguiente canción');
    
  }

  previous() {
    console.log('Canción anterior');
    
  }

  toggleRandom() {
    this.isRandom = !this.isRandom; 
    console.log(`Aleatorio: ${this.isRandom}`);
  }

  toggleLoop() {
    this.isLoop = !this.isLoop; 
    console.log(`Bucle: ${this.isLoop}`);
  }
}
