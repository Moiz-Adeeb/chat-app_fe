import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppButtonComponent } from '../../../app-button/components/app-button/app-button.component';
import { NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { CustomValidator } from '../../../../customValidator/custom-validator';
import { AppTextAreaFieldComponent } from '../../../app-text-area-field/components/app-text-area-field/app-text-area-field.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './app-confirmation-dialog.component.html',
  styleUrls: ['./app-confirmation-dialog.component.css'],
  standalone: true,
  imports: [AppButtonComponent, TranslatePipe, NgIf, AppTextAreaFieldComponent],
})
export class AppConfirmationDialogComponent {
  @Input() title: string = 'AreYouSure';
  @Input() message: string = 'YouWantToDeleteThisUser';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'No';

  @Input() isInput: boolean = false;
  @Input() modelValue: boolean = false;
  @Output() modelValueChange = new EventEmitter<boolean>();

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}
  reasonController: FormControl = new FormControl('', [
    CustomValidator.required(),
  ]);
  onConfirm() {
    if (this.isInput) {
      if (this.reasonController.invalid) {
        this.reasonController.markAsTouched();
        return;
      }
      this.confirmed.emit(this.reasonController.value);
    } else {
      this.confirmed.emit();
    }
    this.activeModal.close(); // closes the modal
  }

  onCancel() {
    this.cancelled.emit();
    this.activeModal.dismiss(); // dismisses the modal
  }
}
