import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../../../services/albums.service';

@Component({
  selector: 'app-show-album-songs',
  standalone: true,
  imports: [],
  templateUrl: './show-album-songs.component.html',
  styleUrl: './show-album-songs.component.css'
})
export class ShowAlbumSongsComponent {
  albumId!: number;
  album: any;

  constructor(private route: ActivatedRoute, private albumService: AlbumsService) {}

  ngOnInit(): void {
    this.albumId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlbumSongs();
  }

  loadAlbumSongs(): void {
    this.albumService.getAlbumById(this.albumId).subscribe({
      next: (data) => {
        this.album = data.album;
      },
      error: (error) => {
        console.error('Error al cargar las canciones del álbum:', error);
      }
    });
  }
}
