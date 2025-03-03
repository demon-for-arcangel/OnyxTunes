import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../../../../services/albums.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-albums',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-albums.component.html',
  styleUrl: './update-albums.component.css'
})
export class UpdateAlbumsComponent implements OnInit{
  albumId!: number;
  album: any = {
    titulo: '',
    fecha_lanzamiento: '',
    portadaURL: ''
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumsService,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.albumId = this.config.data.albumId;
    this.loadAlbum();
  }

  loadAlbum(): void {
    this.albumService.getAlbumById(this.albumId).subscribe(
      (data) => {
        this.album = data;
        this.album.portadaURL = data.portadaURL || '';
      },
      (error) => {
        console.error('Error al cargar el álbum:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.album.portadaURL = URL.createObjectURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('titulo', this.album.titulo);
    formData.append('fecha_lanzamiento', this.album.fecha_lanzamiento);
    if (this.selectedFile) {
      formData.append('portada', this.selectedFile, this.selectedFile.name);
    }

    this.albumService.updateAlbum(this.albumId, formData).subscribe(
      (response) => {
        console.log('Álbum actualizado:', response);
      },
      (error) => {
        console.error('Error al actualizar el álbum:', error);
      }
    );
  }
}
