import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  audioPlayerSrc: string = '';
  isPlaying: boolean = false;
  isRandom: boolean = false;
  isLoop: boolean = false;
  currentSong: any = null;
  currentTime: number = 0;
  duration: number = 0;
  private progressInterval: any;

  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @Output() songEnded = new EventEmitter<void>();

  constructor(public playerService: PlayerService) {}

  ngAfterViewInit() {
    if (this.audioElement) {
      this.playerService.setAudioElement(this.audioElement); // Pasar el ElementRef al servicio
    } else {
      console.error('El elemento de audio no se pudo inicializar.');
    }
  }

  ngOnInit() {
    // Actualizar las propiedades con los valores del servicio
    this.playerService.currentTime = this.playerService.currentTime;
    this.playerService.duration = this.playerService.duration;

    // Actualizar el estado en tiempo real
    setInterval(() => {
      this.playerService.currentTime = this.playerService.currentTime;
      this.playerService.duration = this.playerService.duration;
    }, 1000);
  }

  playSong(song: any) {
    this.currentSong = song; 
    console.log('Canción seleccionada:', this.currentSong);

    if (this.audioElement) {
        this.playerService.playSong(this.currentSong);
    } else {
        console.error('Elemento de audio no encontrado');
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  togglePlay() {
    if (this.playerService.playing) {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }

  toggleRandom() {
    this.playerService.toggleRandom();
  }

  toggleLoop() {
    this.playerService.toggleLoop();
  }

  seekTo(event: any) {
    const time = event.target.value;
    this.playerService.seekTo(time);
  }

  next() {
    this.playerService.next();
  }

  previous() {
    this.playerService.previous();
  }
}
