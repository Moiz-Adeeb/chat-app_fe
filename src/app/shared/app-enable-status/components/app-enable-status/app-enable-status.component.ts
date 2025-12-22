import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-enable-status',
  templateUrl: './app-enable-status.component.html',
  styleUrls: ['./app-enable-status.component.scss'],
  standalone: true,
  imports: [NgClass, TranslatePipe]
})
export class AppEnableStatusComponent {
  @Input() status: boolean = false;
}
