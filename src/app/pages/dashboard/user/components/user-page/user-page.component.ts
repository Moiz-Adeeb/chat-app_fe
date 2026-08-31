import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { BasePaginationComponent } from '../../../../../shared/base-pagination-component';
import { CommonModule } from '@angular/common';
import { AppTableComponent } from '../../../../../shared/app-table/components/app-table/app-table.component';
import { AppButtonComponent } from '../../../../../shared/app-button/components/app-button/app-button.component';
import { TableHeader } from '../../../../../models/table-header';
import { UserClient, UserDto, EmployeeType, Role } from '../../../../../api/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersCreateUpdateDialogComponent } from '../user-create-update-dialog/user-create-update-dialog.component';
import { UserViewDialogComponent } from '../user-view-dialog-component/user-view-dialog.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppSearchFieldComponent } from '../../../../../shared/app-search-field/components/app-search-field/app-search-field.component';
import { FormControl } from '@angular/forms';
import { HasRoleDirective } from '../../../../../directives/has-role.directive';
import { RoleNames } from '../../../../../constants/role-names';


@Component({
  selector: 'app-pages',
  templateUrl: './user-page.component.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AppTableComponent, AppButtonComponent, AppSearchFieldComponent, TranslatePipe, HasRoleDirective],
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent extends BasePaginationComponent implements OnInit {
  protected readonly RoleNames = RoleNames;
  protected readonly Role = Role;
  protected readonly EmployeeType = EmployeeType;

  users: UserDto[] = [];

  columns: TableHeader[] = [
    new TableHeader('Name', 'name', true),
    new TableHeader('Email', 'email', true, '', false, undefined, {}, 'hidden lg:table-cell'),
    new TableHeader('CompanyEmail', 'companyEmail', true, '', false, undefined, {}, 'hidden lg:table-cell'),
    new TableHeader('Role', 'Role', true),
    new TableHeader('EmployeeType', 'employeeType', false),
    new TableHeader('CreatedDate', 'createdDate', true),
    // new TableHeader('Actions', '', false),
  ];

  constructor(
    private userClient: UserClient,
    private router: Router,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
  }


  searchControl: FormControl = new FormControl<string>('', []);

  protected override getData(): void {
    this.alertService.startLoadingMessage();
    this.userClient
      .getUsers(
        false,
        this.search || undefined,
        this.isDescending,
        this.page,
        this.pageSize,
        this.sort || undefined
      )
      .subscribe({
        next: (result) => {
          this.users = result.data ?? [];
          this.totalPage = result.count ?? 0;
          this.setPagination();
          this.alertService.stopLoadingMessage();
        },
        error: () => {
          this.alertService.showErrorMessage(this.translate.instant('ErrorLoadingUserData'))
          this.users = [];
          this.totalPage = 0;
        },
      });
  }

  onSort(column: TableHeader): void {
    this.sortData(column);
  }

  onPageChange(event: { page: number }): void {
    this.changePage(event.page);
  }

  onSearch(term: string): void {
    this.onSearchChanged(term);
  }

  onView(user: UserDto): void {
    const ref = this.modalService.open(UserViewDialogComponent, { size: 'lg' });
    if (user.id) {
      ref.componentInstance.userId = user.id;
    }
    ref.result.then((res) => {
      if (res === 'saved' || res === 'deleted') this.getData();
    }).catch(() => { });
  }

  onCreate(): void {
    const ref = this.modalService.open(UsersCreateUpdateDialogComponent, { size: 'lg' });
    ref.componentInstance.isEditMode = false;
    ref.result.then((result) => {
      if (result === 'saved') this.getData();
    }).catch(() => { });
  }

  onEdit(user: UserDto): void {
    if (!user.id) return;

    this.userClient.getUserById(user.id).subscribe({
      next: (result) => {
        const ref = this.modalService.open(UsersCreateUpdateDialogComponent, { size: 'lg' });
        ref.componentInstance.isEditMode = true;
        ref.componentInstance.editData = result.data;
        ref.result.then((res) => {
          if (res === 'saved') this.getData();
        }).catch(() => { });
      },
      error: () => {
        this.alertService.showErrorMessage(this.translate.instant('ErrorLoadingUserData'))
      },
    });
  }
}
