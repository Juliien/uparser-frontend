import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { ParserComponent } from './components/parser/parser.component';
import { FormsModule } from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import { LoginComponent } from './account/login.component';
import { RegistrationComponent } from './account/register.component';
import { AlertComponent } from './components/alert/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    ParserComponent,
    LoginComponent,
    RegistrationComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
