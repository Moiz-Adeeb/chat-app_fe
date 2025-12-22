import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { PipesModule } from "../../../../../../pipes/pipes.module";
import { UnreadMessageService } from '../../../../../../services/unread-message.service';
import { AppButtonComponent } from "../../../../../../shared/app-button/components/app-button/app-button.component";
import { AppSearchBoxComponent } from '../../../../../../shared/app-search-box/components/app-search-box/app-search-box.component';
import { AppSearchFieldComponent } from "../../../../../../shared/app-search-field/components/app-search-field/app-search-field.component";
import { BasePaginationComponent } from '../../../../../../shared/base-pagination-component';
import { ConversationClient, ConversationDto, UserClient, UsersDto } from './../../../../../../api/api';
import { SearchUsersDialogComponent } from './components/search-users-dialog/search-users-dialog.component';

@Component({
  selector: 'app-search-users',
  imports: [PipesModule, AsyncPipe, JsonPipe, AppSearchFieldComponent, AppButtonComponent],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.css'
})
export class SearchUsersComponent extends BasePaginationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private unreadMessageService = inject(UnreadMessageService);
  
  constructor(
    private conversationClient: ConversationClient,
    // private userClient: UserClient,
    private modal: NgbModal,
  ) {
    super();
  }

  unreadMessages$ = this.unreadMessageService.unreadMessages$

  
  searchControl: FormControl = new FormControl<string>('', []);
  
  conversations: ConversationDto[] = [];
  users: UsersDto[] = [];
  
  ngOnInit(): void {
    this.unreadMessageService.unreadMessages();
    // this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();   
  }

  // protected override getData(): void {
  //   this.alertService.startLoadingMessage();
  //   this.userClient.getUsers(
  //     false,
  //     this.searchControl.value,
  //     false,
  //     this.page,
  //     this.pageSize,
  //     'name'
  //   ).subscribe((result) => {
  //     this.users = result.data ?? [];
  //     this.alertService.stopLoadingMessage();
  //     this.totalPage = result.count ?? 0;
  //     this.setPagination();
  //     console.log(this.users);
  //   })
  // }

  applyFilters(): void {
    this.page = 1;
    this.getData();
  }

  protected initiate() {
    this.conversationClient.initiateConversation(this.search).subscribe((result) => console.log(result))
  }
  
  onPageChange(event: any) {
    this.page = event.page;
    this.getData();
  }

  @Output() input = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  getUsers(): void {
    // this.getData();
    const modalRef = this.modal.open(SearchUsersDialogComponent);
    modalRef.componentInstance.title = 'ApproveCompany';
    modalRef.componentInstance.message = 'YouWantToApproveThisCompany';
    modalRef.componentInstance.confirmText = 'Approve';
    modalRef.componentInstance.isInput = false;

    modalRef.componentInstance.input = this.searchControl.value;
  }

}
