import { Component } from '@angular/core';
import { PlaylistService } from '../../../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

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

  constructor(private playlistService: PlaylistService, public ref: DynamicDialogRef) {}

  createPlaylist() {
    const playlistData = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      usuario_id: this.usuario_id,
      publico: this.publico,
      canciones: this.canciones
    };

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
