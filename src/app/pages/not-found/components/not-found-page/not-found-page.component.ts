import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-getting-started-page',
  standalone: false,
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {


  isLoggedIn = false;

  constructor(
    private router: Router,
    // private authService: AuthService,
    ) {
    // this.isLoggedIn = this.authService.isLoggedIn;
  }

  navigate() {
    this.router.navigate([this.isLoggedIn ? '/dashboard/home' : '/login']);
  }
}
