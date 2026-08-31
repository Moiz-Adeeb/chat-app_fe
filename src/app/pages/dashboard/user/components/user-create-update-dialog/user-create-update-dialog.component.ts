import { AlertService } from '../../../../../services/alert.service';
import { UserClient, UserDetailDto, CreateUserRequestModel, UpdateUserRequestModel, EmployeeType, Role } from '../../../../../api/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CustomValidator } from '../../../../../customValidator/custom-validator';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTextFieldComponent } from '../../../../../shared/app-text-field/components/app-text-field/app-text-field.component';
import { AppButtonComponent } from '../../../../../shared/app-button/components/app-button/app-button.component';
import { AppDropdownComponent } from '../../../../../shared/app-dropdown/components/app-dropdown/app-dropdown.component';
import { HasRoleDirective } from '../../../../../directives/has-role.directive';

@Component({
  selector: 'app-users-create-update-dialog',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TranslatePipe, AppTextFieldComponent, AppButtonComponent, AppDropdownComponent, HasRoleDirective],
  templateUrl: './user-create-update-dialog.component.html',
  styleUrl: './user-create-update-dialog.component.scss',
})
export class UsersCreateUpdateDialogComponent implements OnInit {
  isEditMode: boolean = false;
  editData?: UserDetailDto = {} as UserDetailDto;

  constructor(
    public modal: NgbActiveModal,
    public translate: TranslateService,
    public userClient: UserClient,
    public alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.initializeDropdownOptions();
    if (this.isEditMode && this.editData) {
      this.populateForm();
    }
  }

  EmployeeTypes: { id: EmployeeType; name: string }[] = [];
  Roles: { id: Role; name: string }[] = [];

  initializeDropdownOptions(): void {
    this.EmployeeTypes = [
      { id: EmployeeType.Onsite, name: 'Onsite' },
      { id: EmployeeType.Remote, name: 'Remote' },
      { id: EmployeeType.Hybrid, name: 'Hybrid' },
    ];

    this.Roles = [
      { id: Role.Administrator, name: 'Admin' },
      { id: Role.Manager, name: 'Manager' },
      { id: Role.Employee, name: 'Employee' },
    ];
  }

  populateForm(): void {
    if (!this.editData) return;

    this.nameControl.setValue(this.editData.name ?? '');
    this.emailControl.setValue(this.editData.email ?? '');
    this.companyEmailControl.setValue(this.editData.companyEmail ?? '');
    this.employeeTypeControl.setValue(this.editData.employeeType ?? EmployeeType.Onsite);
    this.shiftStartTimeControl.setValue(this.editData.shiftStartTime ?? '');
    this.shiftEndTimeControl.setValue(this.editData.shiftEndTime ?? '');
  }

  nameControl = new FormControl<string>('', [CustomValidator.required()]);
  emailControl = new FormControl<string>('', [CustomValidator.required()]);
  companyEmailControl = new FormControl<string>('', [CustomValidator.required()]);
  roleControl = new FormControl<Role>(Role.Employee);
  employeeTypeControl = new FormControl<EmployeeType>(EmployeeType.Onsite);
  shiftStartTimeControl = new FormControl<string | null>(null);
  shiftEndTimeControl = new FormControl<string | null>(null);

  formGroup: FormGroup = new FormGroup({
    name: this.nameControl,
    email: this.emailControl,
    companyEmail: this.companyEmailControl,
    employeeType: this.employeeTypeControl,
    shiftStartTime: this.shiftStartTimeControl,
    shiftEndTime: this.shiftEndTimeControl,
  });

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.alertService.showErrorMessage(this.translate.instant('PleaseCompleteAllRequiredFields'));
      return;
    }

    this.alertService.startLoadingMessage();

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  // private toTimeOnlyString(value: string | null): string {
  //   if (!value) return '';
  //   // <input type="time"> gives "HH:mm" — TimeOnly needs "HH:mm:ss"
  //   return value.length === 5 ? `${value}:00` : value;
  // }
  private toTimeOnlyString(value: string | null): string | undefined {
    if (!value) return undefined;
    return value.length === 5 ? `${value}:00` : value;
  }

  createUser(): void {
    const model = new CreateUserRequestModel({
      name: this.nameControl.value ?? undefined,
      email: this.emailControl.value ?? undefined,
      companyEmail: this.companyEmailControl.value ?? undefined,
      role: this.roleControl.value ?? undefined,
      employeeType: this.employeeTypeControl.value ?? undefined,
      shiftStartTime: this.toTimeOnlyString(this.shiftStartTimeControl.value),
      shiftEndTime: this.toTimeOnlyString(this.shiftEndTimeControl.value),
    });

    this.userClient.createUser(model).subscribe(() => {
      this.alertService.stopLoadingMessage();
      this.modal.close('saved');
      setTimeout(() => {
        this.alertService.showSuccessMessage(this.translate.instant('UserCreatedSuccessfully'));
      }, 500);
    });
  }

  updateUser(): void {
    if (!this.editData?.id) return;

    const model = new UpdateUserRequestModel({
      id: this.editData.id,
      name: this.nameControl.value ?? undefined,
      email: this.emailControl.value ?? undefined,
      companyEmail: this.companyEmailControl.value ?? undefined,
      role: this.roleControl.value ?? undefined,
      employeeType: this.employeeTypeControl.value ?? undefined,
      shiftStartTime: this.toTimeOnlyString(this.shiftStartTimeControl.value),
      shiftEndTime: this.toTimeOnlyString(this.shiftEndTimeControl.value),
    });

    this.userClient.updateUser(this.editData.id, model).subscribe(() => {
      this.alertService.stopLoadingMessage();
      this.modal.close('saved');
      setTimeout(() => {
        this.alertService.showSuccessMessage(this.translate.instant('UserUpdatedSuccessfully'));
      }, 500);
    });
  }

  close() {
    this.modal.close();
    this.resetForm();
  }

  resetForm() {
    this.formGroup.reset();
  }
}
