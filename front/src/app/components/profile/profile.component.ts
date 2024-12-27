import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { ProfileService } from "../../services/profile.service";
import { Playlist } from "../../interfaces/playlist";
import { AuthService } from "../../services/auth.service";
import { SidebarComponent } from "../utils/sidebar/sidebar.component";
import { AccountButtonComponent } from "../utils/account-button/account-button.component";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [SidebarComponent, AccountButtonComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  public playlists: Playlist[] = [];
  user: any;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    const token = localStorage.getItem("user");
    if (token) {
      this.authService.getUserByToken(token).subscribe(
        (response) => {
          this.user = response;
          this.loadPublicPlaylists(this.user.id);
        },
        (error) => {
          console.error("Error al obtener el usuario:", error);
        },
      );
    }
  }

  loadPublicPlaylists(userId: number): void {
    this.profileService.getPublicPlaylists(userId).subscribe({
      next: (response) => {
        this.playlists = response.data;
        console.log("Playlists públicas:", this.playlists);
      },
      error: (err) => {
        console.error("Error al obtener las playlists públicas:", err);
      },
    });
  }
}
