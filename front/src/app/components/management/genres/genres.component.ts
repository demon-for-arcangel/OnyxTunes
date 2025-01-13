import { Component } from '@angular/core';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';
import { Genre } from '../../../interfaces/genre';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { GeneroService } from '../../../services/genero.service';
import { CreateGenreComponent } from '../create/create-genre/create-genre.component';
import { ShowGenreComponent } from '../show/show-genre/show-genre.component';
import { UpdateGenreComponent } from '../update/update-genre/update-genre.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css',
  providers: [DialogService]
})
export class GenresComponent {
  genres: Genre[] = [];
  filteredGenres: Genre[] = [];
  searchQuery: string = '';
  showFilter: boolean = false;
  filterType: 'todos' | 'pop' | 'rock' | 'jazz' = 'todos';
  private originalGenres: Genre[] = [];

  paginatedGenres: Genre[] = [];
  maxItems: number = 5;  
  currentPage: number = 1;
  totalPages: number = 0;

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private genreService: GeneroService, public dialogService: DialogService, private router: Router) {}

  ngOnInit(): void {
    this.loadGenres();
  }
  
  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  loadGenres(): void {
    this.genreService.getGeneros().subscribe({
      next: (genres) => {
        this.originalGenres = genres;
        this.genres = [...genres];
        this.totalPages = Math.ceil(this.genres.length / this.maxItems);
        this.updatePaginatedGenres();
      },
      error: (error) => console.error('Error al cargar géneros:', error),
    });
  }

  newGenre(){
    this.ref = this.dialogService.open(CreateGenreComponent, {
      header: 'Agregar Nuevo Género',
      modal: true,
      width: '60%',
      styleClass: 'custom-modal',
      contentStyle: {
        'background-color': '#1e1e1e',
        'color': 'white',
        'border-radius': '8px',
        'padding': '20px'
      },
      baseZIndex: 10000,
      style: {
        'background-color': '#1e1e1e'
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true
    });
  }

  updatePaginatedGenres(): void {
    const start = (this.currentPage - 1) * this.maxItems;
    const end = start + this.maxItems;
    this.paginatedGenres = this.genres.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedGenres();
    }
  }
  
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  searchGenres(): void { 
    if (this.searchQuery) {
        const allGenres = [...this.originalGenres]; 
        this.genres = allGenres.filter(genre =>
            genre.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    } else {
        this.loadGenres(); 
    }
    
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.genres.length / this.maxItems);
    this.updatePaginatedGenres();
  }

  showGenre(genre: Genre): void {
    this.ref = this.dialogService.open(ShowGenreComponent, {
      modal: true,
      width: '70vw',
      styleClass: 'custom-modal',
      contentStyle: {
        'background-color': '#1e1e1e',
        'color': 'white',
        'border-radius': '8px',
        'padding': '20px'
      },
      baseZIndex: 10000,
      style: {
        'background-color': '#1e1e1e'
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
      data: {
        genreId: genre.id
      }
    });
  }

  editGenre(genre: Genre): void {
    this.ref = this.dialogService.open(UpdateGenreComponent, {
      header: 'Editar Género',
      modal: true,
      width: '70vw',
      styleClass: 'custom-modal',
      contentStyle: {
        'background-color': '#1e1e1e',
        'color': 'white',
        'border-radius': '8px',
      },
      style: {
        'background-color': '#1e1e1e',
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
      data: {
        genreId: genre.id
      }
    });
  }

  deleteGenre(genreId: number): void {
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
        genreId: genreId
      }
    });
  
    this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.genreService.deleteGeneros([genreId]).subscribe({
          next: () => {
            this.genres = this.genres.filter(genre => genre.id !== genreId); 
            this.updatePaginatedGenres();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, 
          error: (error) => {
            console.error('Error al eliminar género:', error);
          }
        });
      }
    });
  }
}