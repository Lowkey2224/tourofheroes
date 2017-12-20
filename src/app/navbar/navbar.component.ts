import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'Tour of Heroes';

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  logout() {
    this.authService.logout();
  }
}
