import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
  currentTime: number = 0;
  duration: number = 0;
  private progressInterval: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  @Output() songEnded = new EventEmitter<void>();

  constructor() {  }

  ngOnInit() {

    // Iniciar el intervalo para actualizar el tiempo actual
    setInterval(() => {
      if (this.isPlaying && this.audioPlayer) {
        this.currentTime = this.audioPlayer.nativeElement.currentTime;
      }
    }, 1000);
}

ngAfterViewInit() {
  if (this.audioPlayer) {
    this.audioPlayer.nativeElement.addEventListener('ended', () => {
      this.handleSongEnd();
    });
  }
}


playSong(song: any) {
  this.currentSong = song; 
  if (this.audioPlayer && this.currentSong) {
    const audioElement = this.audioPlayer.nativeElement;
    audioElement.src = `assets/uploads/canciones/${this.currentSong.asset.path}`;
    audioElement.oncanplaythrough = () => {
      this.duration = audioElement.duration; 
    };
    audioElement.play()
      .then(() => {
        this.isPlaying = true;
        this.startProgressUpdate();
      })
      .catch(error => console.error('Error al reproducir:', error));
  } else {
    console.error('audioPlayer o currentSong no están definidos');
  }
}


  play() {
    if (this.currentSong) {
      this.audioPlayer.nativeElement.play();
      this.isPlaying = true;
      this.startProgressUpdate();
    }
  }

  pause() {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.pause(); 
      this.isPlaying = false; 
      this.stopProgressUpdate();
    }
  }

  next() {
    this.songEnded.emit();
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

  startProgressUpdate() {
    this.stopProgressUpdate(); 
    this.progressInterval = setInterval(() => {
      if (this.audioPlayer && this.isPlaying) {
        this.currentTime = this.audioPlayer.nativeElement.currentTime; 
      }
    }, 1000);
  }

  stopProgressUpdate() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval); 
      this.progressInterval = null; 
    }
  }

  ngOnDestroy() {
    this.stopProgressUpdate(); 
  }

  progressSong(event: Event) {
    const target = event.target as HTMLInputElement;
    const seekTime = Number(target.value);
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.currentTime = seekTime; 
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; 
  }

  updateProgress() {
    if (this.audioPlayer) {
      this.currentTime = this.audioPlayer.nativeElement.currentTime; 
    }
  }

  /* private handleSongEnd() {
    this.isPlaying = false; // Detener la reproducción
    this.songEnded.emit(); // Emitir evento de fin de canción
    if (this.isLoop) {
      this.playSong(this.currentSong); // Repetir la misma canción si está en bucle
    }
  } */

  private handleSongEnd() {
    this.isPlaying = false; // Detener la reproducción
    this.songEnded.emit(); // Emitir evento de fin de canción
  
    // Si el bucle está activado, reinicia la reproducción de la canción actual
    if (this.isLoop) {
      this.playSong(this.currentSong);
    }
  }
}
