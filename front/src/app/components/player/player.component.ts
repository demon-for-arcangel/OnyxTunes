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
  currentTime: number = 0;
  duration: number = 0;
  private progressInterval: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor() {  }

  ngOnInit() {
    setInterval(() => {
        if (this.isPlaying && this.audioPlayer) {
            this.currentTime = this.audioPlayer.nativeElement.currentTime;
        }
    }, 1000); 
}

playSong(song: any) {
  this.currentSong = song; 
  console.log('Canción seleccionada:', this.currentSong);

  if (this.audioPlayer && this.currentSong) {
      this.audioPlayer.nativeElement.src = `assets/uploads/canciones/${this.currentSong.asset.path}`;

      this.audioPlayer.nativeElement.oncanplaythrough = () => {
          this.duration = this.audioPlayer.nativeElement.duration; 
      };

      this.audioPlayer.nativeElement.play().then(() => {
          this.isPlaying = true;
          this.startProgressUpdate(); 
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
}
