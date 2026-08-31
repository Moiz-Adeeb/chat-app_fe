import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: true,
  templateUrl: './home-page.component.html',
  imports: [
    RouterOutlet,
  ],
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent { }
