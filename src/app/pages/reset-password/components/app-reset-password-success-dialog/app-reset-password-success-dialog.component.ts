import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {AppButtonComponent} from '../../../../shared/app-button/components/app-button/app-button.component';

@Component({
  selector: 'app-reset-password-success-dialog',
  templateUrl: './app-reset-password-success-dialog.component.html',
  styleUrls: ['./app-reset-password-success-dialog.component.css'],
  standalone: true,
  imports: [
    AppButtonComponent,
    /* add AppButtonComponent here */]
})
export class AppResetPasswordSuccessDialogComponent {
  constructor(
    private router: Router,
    public activeModal: NgbActiveModal
  ) {}

  onConfirm() {
    this.activeModal.close();
    this.router.navigateByUrl('/login');
  }
}
