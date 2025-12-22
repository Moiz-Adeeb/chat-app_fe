import {Component, Input, Output, EventEmitter, ElementRef, HostListener} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './app-switch-button.component.html',
  imports: [
    NgStyle,
    FormsModule
  ],
  standalone: true,
  styleUrls: ['./app-switch-button.component.css']
})
export class AppSwitchButtonComponent {
  @Input() isActive: boolean = false;
  @Output() onToggle = new EventEmitter<boolean>();

  toggle() {
    this.isActive = !this.isActive;
    this.onToggle.emit(this.isActive);
  }


}
