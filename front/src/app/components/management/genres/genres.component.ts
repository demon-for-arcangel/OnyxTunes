import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneroService } from '../../../services/genero.service';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css',
  providers: [DialogService]
})
export class GenresComponent {

  generos: any[] = [];
  currentGenerosPage = 1;
  generosPerPage = 5;
  searchQuery: string = '';
  mostrarGeneros: boolean = true;

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private router: Router, private genresService: GeneroService, public dialogService: DialogService) { }

  ngOnInit() {
    this.loadGeneros();
  }

  loadGeneros() {
    this.genresService.getGeneros().subscribe(
      (data) => {
        this.generos = data;
        console.log('Generos cargados:', this.generos);
      },
      (error) => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  newGenero() {

  }

  editGenero(genero: any) {

  }

  deleteGenero(id: number) {
    this.ref = this.dialogService.open(DeleteConfirmationComponent, {
          header: 'Confirmar Eliminación',
          width: '400px',
          modal: true,
          styleClass: 'custom-modal',
          contentStyle: {
            'background-color': '#1e1e1e',
            'color': 'white',
            'padding': '20px'
          },
          data: {
            songsIds: [id]
          }
      });

    this.ref.onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.genresService.deleteGenero([id]).subscribe(
            (data) => {
              console.log('Genero eliminado:', data);
              this.loadGeneros();
            },
            (error) => {
              console.error('Error al eliminar el genero:', error);
            }
          );
        }
    });
  }

  showGenero(id: number) {  }

  view() {
    this.mostrarGeneros = !this.mostrarGeneros;
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  get paginatedGeneros() {
    const start = (this.currentGenerosPage - 1) * this.generosPerPage;
    const end = start + this.generosPerPage;
    return this.generos.slice(start, end);
  }

  get totalGenerosPages(): number {
    return Math.ceil(this.generos.length / this.generosPerPage);
  }

  prevGenresPage() {
    if (this.currentGenerosPage > 1) {
      this.currentGenerosPage--;
    }
  }

  nextGenresPage() {
    if (this.currentGenerosPage > 1) {
      this.currentGenerosPage--;
    }
  }

  searchGenres() {

  }
}
