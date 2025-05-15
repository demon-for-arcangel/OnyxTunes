import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RecommendationService } from '../../services/recommendation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-recommended-song',
  standalone: true,
  imports: [],
  templateUrl: './recommended-song.component.html',
  styleUrl: './recommended-song.component.css'
})
export class RecommendedSongComponent implements OnInit {
  recommendedSong: any = null;
  isEnabled: boolean = false;
  userId: string = '';
  artistName: string = '';

  constructor(private config: DynamicDialogConfig, private recommendationService: RecommendationService, private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.recommendedSong = this.config.data.recommendedSong;

    if (!this.recommendedSong) {
        console.log("No hay canción recomendada, cerrando el modal.");
        return;
    }

    console.log("Datos recibidos en el diálogo:", this.recommendedSong);

    if (this.recommendedSong.songRecommendation?.artista_id) {
        this.getArtistName(this.recommendedSong.songRecommendation.artista_id);
    } else {
        console.log("No hay ID de artista disponible.");
    }
    this.getUserFromToken();
  }


  getUserFromToken(): void {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
      console.error("Token no encontrado, redirigiendo a login");
      this.router.navigate(["/login"]);
      return;
    }

    this.authService.getUserByToken(tokenObject).subscribe({
      next: (usuario) => {
        if (usuario?.id) {
          this.userId = usuario.id.toString();
          this.checkRecommendationStatus();
        } else {
          console.error("Usuario no encontrado en el token, redirigiendo a login");
          this.router.navigate(["/login"]);
        }
      },
      error: (err) => {
        console.error("Error al obtener usuario desde el token:", err);
        this.router.navigate(["/login"]);
      }
    });
  }

  checkRecommendationStatus(): void {
    if (!this.userId) return;

    this.recommendationService.getRecommendationStatus(this.userId).subscribe({
      next: (status: boolean) => {
        this.isEnabled = status;
        console.log(this.isEnabled)
      },
      error: (err) => {
        console.error("Error al obtener el estado de recomendaciones:", err);
      }
    });
  }

  toggleRecommendation(): void {
    if (!this.userId) return; 

    this.isEnabled = !this.isEnabled;

    this.recommendationService.updateRecommendationStatus(this.userId, this.isEnabled).subscribe({
      next: (response) => {
        console.log("Estado actualizado correctamente:", response);
      },
      error: (err) => {
        console.error("Error al actualizar estado de recomendaciones:", err);
      }
    });
  }

  getArtistName(artistaId: number): void {
    this.userService.getUserById(artistaId.toString()).subscribe({
      next: (usuario) => {
        if (usuario?.nombre) {
          this.artistName = usuario.nombre;
          console.log("Nombre del artista obtenido:", this.artistName);
        } else {
          console.log("No se encontró el artista.");
        }
      },
      error: (err) => {
        console.error("Error al obtener el nombre del artista:", err);
      }
    });
  }
}
