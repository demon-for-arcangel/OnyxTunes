import { Component } from '@angular/core';
import { PlaylistService } from '../../../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-playlist.component.html',
  styleUrl: './create-playlist.component.css'
})
export class CreatePlaylistComponent {
  nombre: string = '';
  descripcion: string = '';
  usuario_id: number = 0; 
  publico: boolean = false;
  canciones: number[] = []; 
  user: any;

  constructor(private playlistService: PlaylistService, public ref: DynamicDialogRef, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    const token = localStorage.getItem('user'); 
    if (token) {
      this.authService.getUserByToken(token).subscribe(
        response => {
          this.user = response; 
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }

  createPlaylist() {
    const playlistData = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      usuario_id: this.user.id,
      publico: this.publico,
      canciones: this.canciones
    };

    console.log('playlistData', playlistData);

    this.playlistService.createPlaylist(playlistData).subscribe(
      response => {
        console.log('Playlist creada:', response);
        this.ref.close();
      },
      error => {
        console.error('Error al crear la playlist:', error);
      }
    );
  }
}
