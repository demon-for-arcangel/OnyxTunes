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
    if (this.config.data && this.config.data.albumId) {
      this.albumId = this.config.data.albumId;
      console.log(this.albumId)
      this.loadAlbum();
    } else {
      console.error("No se encontró albumId en DynamicDialogConfig");
    }
  }
  

  loadAlbum(): void {
    this.albumService.getAlbumById(this.albumId).subscribe(
      (data) => {
        if (data.album) {
          console.log(data.album);
          this.album = data.album; // Acceder al objeto correcto dentro de la respuesta
          this.album.portadaURL = data.album.portadaURL || '';
          if (this.album.fecha_lanzamiento) {
            this.album.fecha_lanzamiento = this.formatDate(this.album.fecha_lanzamiento);
          }
        } else {
          console.error('La respuesta no contiene la estructura esperada:', data);
        }
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

  formatDate(dateString: string): string {
    return dateString.split('T')[0]; // Extrae solo la parte de la fecha
  }
}
