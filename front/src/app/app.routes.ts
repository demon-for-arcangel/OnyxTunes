import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GustosMusicalesComponent } from './components/gustos-musicales/gustos-musicales.component';
import { SelectAccessComponent } from './components/select-access/select-access.component';
import { HomeComponent } from './components/home/home.component';
import { PlatformManagementComponent } from './components/platform-management/platform-management.component';
import { UsersComponent } from './components/management/users/users.component';
import { MusicComponent } from './components/management/music/music.component';
import { ChatComponent } from './components/chatting/chat/chat.component';
import { ChatBaseComponent } from './components/chatting/chat-base/chat-base.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MusicArtistComponent } from './components/management/music-artist/music-artist.component';


export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'gustosMusicales', component: GustosMusicalesComponent },
    { path: 'selectAccess', component: SelectAccessComponent },
    { path: 'home', component: HomeComponent },
    { path: 'platformManagement', component: PlatformManagementComponent},
    { path: 'platform/userManagement', component: UsersComponent },
    { path: 'platform/musicManagement', component: MusicComponent },
    { path: 'chat', component: ChatBaseComponent },
    { path: 'playlist/:id/:name', component: PlaylistComponent },
    { path: 'search', component: SearchComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'platform/artistManagement', component: MusicArtistComponent },
];
