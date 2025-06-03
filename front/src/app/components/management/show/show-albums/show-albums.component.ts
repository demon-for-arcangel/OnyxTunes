import { Component } from '@angular/core';
import { AlbumsService } from '../../../../services/albums.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

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

  constructor(private albumService: AlbumsService, private config: DynamicDialogConfig, private router: Router) {}

  ngOnInit(): void {
    this.albumId = this.config.data.albumId;
    if (this.albumId) {
      this.loadAlbumDetails();
    } else {
      console.error('No se proporcionó el albumId');
    }
  }

  loadAlbumDetails(): void {
    this.albumService.getAlbumById(this.albumId).subscribe({
      next: (data) => {
        this.album = data.album;
        if (!this.album.Cancions) {
          this.album.Cancions = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar los detalles del álbum:', error);
      }
    });
  }

  verCanciones(): void {
    this.router.navigate(['/album', this.albumId, 'canciones']);
  }
}
