import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  mostListenedArtists: any[] = [];
  mostListenedSongs: any[] = [];
  publicPlaylists: any[] = [];
  followers: any[] = [];

  constructor(private userService: UserService) { }

  /* ngOnInit(): void {
    this.loadProfileData();
  } */

  /* loadProfileData() {
    // Aquí puedes hacer llamadas a tu servicio para obtener los datos
    this.userService.getMostListenedArtists().subscribe(data => {
      this.mostListenedArtists = data;
    });

    this.userService.getMostListenedSongs().subscribe(data => {
      this.mostListenedSongs = data;
    });

    this.userService.getPublicPlaylists().subscribe(data => {
      this.publicPlaylists = data;
    });

    this.userService.getFollowers().subscribe(data => {
      this.followers = data;
    });
  } */
}
