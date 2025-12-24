import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PipesModule } from "../../../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../../../services/auth.service';
import { AppButtonComponent } from '../../../../../../../../shared/app-button/components/app-button/app-button.component';
import { AppSearchFieldComponent } from "../../../../../../../../shared/app-search-field/components/app-search-field/app-search-field.component";
import { BasePaginationComponent } from '../../../../../../../../shared/base-pagination-component';
import { ConversationClient, ConversationDto, UserClient, UsersDto } from './../../../../../../../../api/api';
import { ConversationService } from './../../../../../../../../services/conversation.service';

@Component({
  selector: 'app-search-users-dialog',
  imports: [CommonModule, TranslatePipe, AppButtonComponent, PipesModule, AppSearchFieldComponent],
  templateUrl: './search-users-dialog.component.html',
  styleUrl: './search-users-dialog.component.scss'
})
export class SearchUsersDialogComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  @Input() input: string = '';
  users = new BehaviorSubject<UsersDto[]>([]);
  users$: Observable<UsersDto[]> = this.users.asObservable();

  private  Loading = false;
  private isFullListLoaded = false;
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    public modal: NgbActiveModal,
    public translate: TranslateService,
    public conversationClient: ConversationClient,
    public userClient: UserClient,
    public authService: AuthService,
    public conversationService: ConversationService
  ) {
      super();
    }

  searchControl: FormControl = new FormControl<string>('', []);

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    
  }

  protected override getData(): void {
    if (this.Loading || this.isFullListLoaded) return;
    this.Loading = true;  
      this.alertService.startLoadingMessage();
      this.userClient.getUsers(
        false,
        this.input,
        false,
        this.page,
        10,
        'name'
      ).subscribe((result) => {
        const newData = result.data ?? [];
        const updatedList = [...this.users.getValue(), ...newData];
        this.users.next(updatedList);
        if (newData.length < 10) {
          this.isFullListLoaded = true;
        }
        this.alertService.stopLoadingMessage();
        this.totalPage = result.count ?? 0;
        this.setPagination();
        this.Loading = false;
        console.log(this.users);
      })
  }  

  getSearchData(): void {
    this.input = this.searchControl.value
    this.users.next([]);
    // if (this.Loading || this.isFullListLoaded) return;
    this.Loading = true;  
      this.alertService.startLoadingMessage();
      this.userClient.getUsers(
        false,
        this.input,
        false,
        this.page,
        10,
        'name'
      ).subscribe((result) => {
        const newData = result.data ?? [];
        const updatedList = [...this.users.getValue(), ...newData];
        this.users.next(updatedList);
        if (newData.length < 10) {
          this.isFullListLoaded = true;
        }
        this.alertService.stopLoadingMessage();
        this.totalPage = result.count ?? 0;
        this.setPagination();
        this.Loading = false;
        console.log(this.users);
      })
  }  

  initiateChat(targetUserId: string) {
    this.conversationClient.initiateConversation(targetUserId)
      .subscribe({
          next: (response) => {
            if(response.data) {
              this.conversationService.NewConversationToList(response.data);
              this.conversationClick(response.data);
            } else {
              this.alertService.showErrorMessage("Could not initiate chat please try again")
            }
            this.search = '';
          }
        });
    this.close()    
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.getData();
  }

  conversationClick(chat: ConversationDto) {
    this.conversationService.selectChat(chat);
  }

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    // Calculate if user is near the bottom
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (atBottom && !this.isLoading && !this.isFullListLoaded) {
      this.page++; // Increment page count
      this.getData(); // Call same method to fetch and append
    }
  }


  close() {
    this.modal.close();
  }

}
