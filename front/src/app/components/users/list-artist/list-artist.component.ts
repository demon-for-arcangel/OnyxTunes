import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list-artist',
  standalone: true,
  imports: [],
  templateUrl: './list-artist.component.html',
  styleUrl: './list-artist.component.css'
})
export class ListArtistComponent implements OnInit{
  artistas: Usuario[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getArtists().subscribe(
      (data) => {
        this.artistas = data;
      },
      (error) => {
        console.error('Error al obtener artistas:', error);
      }
    );
  }
}
