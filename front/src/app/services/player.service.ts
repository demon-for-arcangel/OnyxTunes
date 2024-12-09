import { ElementRef, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioPlayer = new Audio();
  public currentSong: any = null;
  private isPlaying: boolean = false;
  private isLoop: boolean = false;
  private isRandom: boolean = false;
  private songQueue: any[] = [];
  private currentIndex: number = -1;
  public currentTime: number = 0;
  public duration: number = 0;

  constructor() {
    
    this.audioPlayer.addEventListener('timeupdate', () => {
      console.log('entro')
      this.currentTime = this.audioPlayer.currentTime;
      console.log('Tiempo actual:', this.currentTime);
    });

    this.audioPlayer.addEventListener('loadedmetadata', () => {
      console.log('entro')
      this.duration = this.audioPlayer.duration;
      console.log('Duración de la canción:', this.duration);
    });

    this.audioPlayer.addEventListener('ended', () => {
      this.handleSongEnd();
    });
  }

  

  get playing(): boolean {
    return this.isPlaying;
  }

  get loop(): boolean {
    return this.isLoop;
  }

  get random(): boolean {
    return this.isRandom;
  }

  setAudioElement(audioElement: ElementRef<HTMLAudioElement>): void {
    if (audioElement && audioElement.nativeElement) {
      this.audioPlayer = audioElement.nativeElement;
  
      this.audioPlayer.addEventListener('timeupdate', () => {
        this.currentTime = this.audioPlayer.currentTime;
      });
  
      this.audioPlayer.addEventListener('loadedmetadata', () => {
        this.duration = this.audioPlayer.duration;
        console.log('Duración del audio:', this.duration);
      });
  
      this.audioPlayer.addEventListener('ended', () => {
        this.handleSongEnd();
      });
  
      this.audioPlayer.addEventListener('error', (event: any) => {
        console.error('Error en el reproductor de audio:', event.target.error);
      });
    } else {
      console.error('El elemento de audio no está definido.');
    }
  }
  

  playSong(song: any): void {
    if (!this.audioPlayer) {
      console.error('El reproductor de audio no está inicializado.');
      return;
    }
    if (!song?.id || !song.asset?.path) {
      console.error('Canción no válida o ruta de archivo no encontrada');
      return;
    }
  
    console.log('Ruta de la canción:', song.asset.path);  
    this.currentSong = song;
    this.audioPlayer.src = `${environment.assetsUrl}${song.asset.path}`;
    console.log('Ruta completa de la canción:', this.audioPlayer.src);  
    this.audioPlayer.load();
    this.audioPlayer.play().then(() => {
      this.isPlaying = true;
    }).catch(err => {
      console.error('Error al reproducir:', err);
    });
  }
  
  
  play(): void {
    if (this.audioPlayer.src) {
      this.audioPlayer.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.error('Error al reproducir:', err);
      });
    }
  }

  pause(): void {
    this.audioPlayer.pause();
    this.isPlaying = false;
  }

  toggleLoop(): void {
    this.isLoop = !this.isLoop;
    this.audioPlayer.loop = this.isLoop;
  }

  toggleRandom(): void {
    this.isRandom = !this.isRandom;
  }

  seekTo(time: number): void {
    if (!isNaN(time) && time >= 0 && time <= this.audioPlayer.duration) {
      this.audioPlayer.currentTime = time;
    }
  }

  setQueue(songs: any[]): void {
    this.songQueue = songs;
    this.currentIndex = 0;
  }

  next(): void {
    if (this.isRandom) {
      this.playRandom();
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.songQueue.length;
      this.playCurrentIndex();
    }
  }

  previous(): void {
    if (this.isRandom) {
      this.playRandom();
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.songQueue.length) % this.songQueue.length;
      this.playCurrentIndex();
    }
  }

  private playCurrentIndex(): void {
    const song = this.songQueue[this.currentIndex];
    if (song) {
      this.playSong(song);
    }
  }

  private playRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.songQueue.length);
    this.currentIndex = randomIndex;
    this.playCurrentIndex();
  }

  private handleSongEnd(): void {
    if (this.isLoop) {
      this.play();
    } else {
      if (this.currentIndex === this.songQueue.length - 1) {
        this.isPlaying = false;  
      } else {
        this.next();
      }
    }
  }
  

  playFromIndex(index: number): void {
    this.currentIndex = index; 
    this.playCurrentIndex();  
  }
}
