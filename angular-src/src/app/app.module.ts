import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { MusicService } from './services/music.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { MusicComponent } from './components/music/music.component';
import { ConvertComponent } from './components/convert/convert.component';
import { UrlbypassPipe } from './pipes/urlbypass.pipe';
import { YoutubePlayerModule } from 'ngx-youtube-player';

const appRoutes: Routes = [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'music', component: MusicComponent, canActivate:[AuthGuard]},
  {path:'convert', component: ConvertComponent, canActivate:[AuthGuard]}       
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    MusicComponent,
    ConvertComponent,
    UrlbypassPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    FormsModule,
    HttpClientModule,
    YoutubePlayerModule
  ],
  providers: [ValidateService, AuthService, MusicService, AuthGuard, UrlbypassPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
