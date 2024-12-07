import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  isPlaying: boolean = false;
  isRandom: boolean = false;
  isLoop: boolean = false;
  currentSong: any = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor() {  }

  ngOnInit() { }

  playSong(song: any) {
    this.currentSong = song; 
    console.log('Canción seleccionada:', this.currentSong);

    if (this.audioPlayer && this.currentSong) {
        this.audioPlayer.nativeElement.src = `assets/uploads/canciones/${this.currentSong.asset.path}`;
        this.audioPlayer.nativeElement.play().then(() => {
            this.isPlaying = true;
        }).catch(error => {
            console.error('Error al reproducir:', error);
        });
    } else {
        console.error('audioPlayer o currentSong no están definidos');
    }
  }

    play() {
      if (this.currentSong) {
        this.audioPlayer.nativeElement.play();
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
