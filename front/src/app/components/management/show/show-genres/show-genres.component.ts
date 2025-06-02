import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneroService } from '../../../../services/genero.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-show-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './show-genres.component.html',
  styleUrl: './show-genres.component.css'
})
export class ShowGenresComponent {
  generoId!: number;
  genero: any; 

  constructor(private generoService: GeneroService, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.generoId = this.config.data.generoId; 
    if (this.generoId) {
      this.loadGeneroDetails(); 
    } else {
      console.error('No se proporcionó el generoId');
    }
  }

  loadGeneroDetails(): void {
    this.generoService.getGeneroById(this.generoId).subscribe({
        next: (data) => {
            this.genero = data; 
            if (!this.genero.canciones) {
              this.genero.canciones = [];
            }
        },
        error: (error) => {
          console.error('Error al cargar los detalles del género:', error);
        }
    });
  }
}
