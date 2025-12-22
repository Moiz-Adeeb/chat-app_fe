import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-summary-card',
  templateUrl: './app-summary-card.component.html',
  styleUrl: './app-summary-card.component.scss',
  imports: [
  ]
})
export class AppSummaryCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() icon = '';
  @Input() titleIcon :string = '';
  @Input() trend: 'up' | 'down' = 'up';
}
