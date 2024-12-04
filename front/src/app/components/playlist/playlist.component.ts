import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../../interfaces/playlist';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent {
  playlistId: number | null = null;
  playlist: Playlist | null = null;

  constructor(private route: ActivatedRoute, private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playlistId = +params['id']; 
      console.log('ID de la playlist:', this.playlistId);
      this.loadPlaylistDetails(this.playlistId);
    });
  }

  loadPlaylistDetails(id: number) {
    this.playlistService.getPlaylistById(id).subscribe(response => {
      console.log(response)
        if (response) {
            this.playlist = response.data;
        } else {
            console.error('Error al obtener los detalles de la playlist:', response.message || 'Respuesta no válida');
        }
    }, error => {
        console.error('Error en la solicitud:', error);
    });
  }
}