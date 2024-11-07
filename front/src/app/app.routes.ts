import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GustosMusicalesComponent } from './components/gustos-musicales/gustos-musicales.component';
import { SelectAccessComponent } from './components/select-access/select-access.component';
import { HomeComponent } from './components/home/home.component';


export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'gustosMusicales', component: GustosMusicalesComponent },
    { path: 'selectAccess', component: SelectAccessComponent },
    { path: 'home', component: HomeComponent }
];
