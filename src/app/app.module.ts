import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { HeroService } from './hero.service';
import { RoleService } from './role.service';
import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { RolesComponent } from './roles/roles.component';
import { NavbarComponent } from './navbar/navbar.component';
import {AuthenticationService} from './authentication/authentication.service';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './_guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    RolesComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
//    HttpClientInMemoryWebApiModule.forRoot(
//      InMemoryDataService, {dataEncapsulation: false}
//    )
  ],
  providers: [HeroService, MessageService, RoleService, AuthenticationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
