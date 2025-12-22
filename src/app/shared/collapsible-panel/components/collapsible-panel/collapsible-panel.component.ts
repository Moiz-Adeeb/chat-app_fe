import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-collapsible-panel',
  templateUrl: './collapsible-panel.component.html',
  imports: [NgClass, NgIf, TranslatePipe],
  styleUrls: ['./collapsible-panel.component.css'],
})
export class CollapsiblePanelComponent {
  @Input() title: string = 'Filter';
  @Input() isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
