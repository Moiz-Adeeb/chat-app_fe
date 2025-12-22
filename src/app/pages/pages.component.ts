import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AppNavbarComponent} from '../shared/app-navbar/components/app-navbar/app-navbar.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  imports: [
    RouterOutlet,
  ],
  styleUrl: './pages.component.css'
})
export class PagesComponent {

}
