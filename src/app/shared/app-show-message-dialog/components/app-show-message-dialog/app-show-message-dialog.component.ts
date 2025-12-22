import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppButtonComponent } from '../../../app-button/components/app-button/app-button.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-show-message-dialog',
  templateUrl: './app-show-message-dialog.component.html',
  styleUrls: ['./app-show-message-dialog.component.css'],
  standalone: true,
  imports: [
    TranslatePipe,
    AppButtonComponent,
  ]
})
export class AppShowMessageDialogComponent {
  @Input() message: string = 'YouWantToDeleteThisUser';
  @Input() showButton: boolean = true; // Optional if you ever want to auto-dismiss or show a button
  @Output() cancelled = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.cancelled.emit();
    this.activeModal.dismiss();
  }
}
