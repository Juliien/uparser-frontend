import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ParserComponent} from './components/parser/parser.component';
import {LoginComponent} from './components/authentication/login/login.component';
import {RegisterComponent} from './components/authentication/register/register.component';
import {GuardService} from './services/guard.service';
import {ProfileComponent} from './components/profile/profile.component';
import {CatalogueComponent} from './components/catalogue/catalogue.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'parser', component: ParserComponent,  canActivate: [GuardService] },
  { path: 'profile', component: ProfileComponent,  canActivate: [GuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
