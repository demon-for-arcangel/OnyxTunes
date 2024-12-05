import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  query: string = '';  // Almacena lo que el usuario escribe
  results: any[] = []; // Almacena los resultados de la búsqueda

  constructor(private searchService: SearchService) {}

  // Método para realizar la búsqueda
  search() {
    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe(response => {
        this.results = response;
      }, error => {
        console.error('Error en la búsqueda:', error);
      });
    }
  }
}
