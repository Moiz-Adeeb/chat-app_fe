import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserClient, UserDetailDto } from '../../../../../api/api';
import { AppButtonComponent } from '../../../../../shared/app-button/components/app-button/app-button.component';
import { AlertService } from '../../../../../services/alert.service';
import { UsersCreateUpdateDialogComponent } from '../user-create-update-dialog/user-create-update-dialog.component';
import { AppConfirmationDialogComponent } from '../../../../../shared/app-confirmation-dialog/components/app-confirmation-dialog/app-confirmation-dialog.component';
import { HasRoleDirective } from '../../../../../directives/has-role.directive';
import { RoleNames } from '../../../../../constants/role-names';


@Component({
  selector: 'app-user-view-dialog',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AppButtonComponent, HasRoleDirective],
  templateUrl: './user-view-dialog.component.html',
  styleUrl: './user-view-dialog.component.scss',
})
export class UserViewDialogComponent implements OnInit {
  protected readonly RoleNames = RoleNames;
  userData: UserDetailDto = {} as UserDetailDto;
  userId: string = '';

  constructor(
    public modal: NgbActiveModal,
    public translate: TranslateService,
    private userClient: UserClient,
    private alertService: AlertService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserDetails();
    }
  }

  setUserData(data: UserDetailDto): void {
    this.userData = data;
    this.userId = data.id ?? '';
  }

  private loadUserDetails(): void {
    this.alertService.startLoadingMessage();
    this.userClient.getUserById(this.userId).subscribe({
      next: (result) => {
        this.userData = result.data ?? ({} as UserDetailDto);
        this.alertService.stopLoadingMessage();
      },
      error: () => {
        this.alertService.showErrorMessage(this.translate.instant('ErrorLoadingUserData'))
      }

    });
  }

  close(): void {
    this.modal.close();

  }
  onEdit(): void {
    if (!this.userId) return;
    const ref = this.modalService.open(UsersCreateUpdateDialogComponent, { size: 'lg' });
    ref.componentInstance.isEditMode = true;
    ref.componentInstance.editData = this.userData;
    ref.result.then((res) => {
      if (res === 'saved') this.loadUserDetails();
    }).catch(() => { });
  }


  onDelete(): void {
    if (!this.userId) return;

    const ref = this.modalService.open(AppConfirmationDialogComponent, { size: 'md' });
    ref.componentInstance.title = 'AreYouSure';
    ref.componentInstance.message = 'YouWantToDeleteThisUser';

    const sub = ref.componentInstance.confirmed.subscribe(() => {
      this.alertService.startLoadingMessage();
      this.userClient.deleteUser(this.userId).subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.modal.close('deleted');
          setTimeout(() => {
            this.alertService.showSuccessMessage(this.translate.instant('UserDeletedSuccessfully'));
          }, 500);
        },
        error: () => {
          this.alertService.stopLoadingMessage();
          this.alertService.showErrorMessage(this.translate.instant('ErrorDeletingUser'));
        },
      });
    });

    ref.result.finally(() => sub.unsubscribe());
  }
}
