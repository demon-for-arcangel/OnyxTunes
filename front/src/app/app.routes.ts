import { Routes } from "@angular/router";
import { LandingComponent } from "./components/landing/landing.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { GustosMusicalesComponent } from "./components/gustos-musicales/gustos-musicales.component";
import { SelectAccessComponent } from "./components/select-access/select-access.component";
import { HomeComponent } from "./components/home/home.component";
import { PlatformManagementComponent } from "./components/platform-management/platform-management.component";
import { UsersComponent } from "./components/management/users/users.component";
import { MusicComponent } from "./components/management/music/music.component";
import { ChatComponent } from "./components/chatting/chat/chat.component";
import { ChatBaseComponent } from "./components/chatting/chat-base/chat-base.component";
import { PlaylistComponent } from "./components/playlist/playlist.component";
import { SearchComponent } from "./components/search/search.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { MusicArtistComponent } from "./components/management/music-artist/music-artist.component";
import { authGuard } from "./guards/auth.guard";
import { RequestResetComponent } from "./components/resetPassword/request-reset/request-reset.component";
import { ResetPasswordComponent } from "./components/resetPassword/reset-password/reset-password.component";
import { ArtistDetailComponent } from "./components/artist-detail/artist-detail.component";
import { GenresComponent } from "./components/management/genres/genres.component";

export const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "gustosMusicales", component: GustosMusicalesComponent },
  {
    path: "selectAccess",
    component: SelectAccessComponent,
    canActivate: [authGuard],
  },
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
  {
    path: "platformManagement",
    component: PlatformManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: "platform/userManagement",
    component: UsersComponent,
    canActivate: [authGuard],
  },
  {
    path: "platform/musicManagement",
    component: MusicComponent,
    canActivate: [authGuard],
  },
  { path: "chat", component: ChatBaseComponent, canActivate: [authGuard] },
  {
    path: "playlist/:data",
    component: PlaylistComponent,
    canActivate: [authGuard],
  },
  { path: "search", component: SearchComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "settings", component: SettingsComponent, canActivate: [authGuard] },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: "platform/artistManagement",
    component: MusicArtistComponent,
    canActivate: [authGuard],
  },
  {
    path: "platform/genresManagement",
    component: GenresComponent,
    canActivate: [authGuard]
  },
  { path: "forgot-password", component: RequestResetComponent },
  { path: "reset/:token", component: ResetPasswordComponent },
  { path: "artist/:id", component: ArtistDetailComponent },
];
