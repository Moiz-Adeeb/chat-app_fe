import {Component, HostListener, Input, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-top-background-view',
  templateUrl: './app-top-background-view.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrl: './app-top-background-view.component.css'
})
export class AppTopBackgroundViewComponent {
  @Input() image: string = "/assets/img/faq_background.png" ;
  @Input() centerText: string = 'FAQS';

}
