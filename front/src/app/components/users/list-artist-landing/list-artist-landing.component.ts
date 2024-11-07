import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list-artist-landing',
  standalone: true,
  imports: [],
  templateUrl: './list-artist-landing.component.html',
  styleUrl: './list-artist-landing.component.css'
})
export class ListArtistLandingComponent implements OnInit {
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
