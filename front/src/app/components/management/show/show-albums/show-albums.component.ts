import { Component } from '@angular/core';
import { AlbumsService } from '../../../../services/albums.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-show-albums',
  standalone: true,
  imports: [],
  templateUrl: './show-albums.component.html',
  styleUrl: './show-albums.component.css'
})
export class ShowAlbumsComponent {
  albumId!: number;
  album: any;

  constructor(private albumService: AlbumsService, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.albumId = this.config.data.albumId;
    console.log(this.albumId);
    if (this.albumId) {
      this.loadAlbumDetails();
    } else {
      console.error('No se proporcionó el albumId');
    }
  }

  loadAlbumDetails(): void {
    this.albumService.getAlbumById(this.albumId).subscribe({
      next: (data) => {
        this.album = data;
        console.log(this.album);
        if (!this.album.canciones) {
          this.album.canciones = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar los detalles del álbum:', error);
      }
    });
  }
}
