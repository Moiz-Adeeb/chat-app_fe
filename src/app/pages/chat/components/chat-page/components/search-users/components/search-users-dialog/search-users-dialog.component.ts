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

  // Get the Search Input from the Search Bar Parent
  @Input() input: string = '';

  // Current List of Users Updates in Real-Time
  users = new BehaviorSubject<UsersDto[]>([]);
  users$: Observable<UsersDto[]> = this.users.asObservable();

  // Loading and Full List Load Check
  private  Loading = false;
  private isFullListLoaded = false;
  
  // Initialiaing the Scrolling Container the Container that will have diplay the Conversation List  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Injecting the Necessary Services and Clients into the Component for Later Use
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

  // To Store the Value of the Search Box Input
  searchControl: FormControl = new FormControl<string>('', []);

  // Load the Data Upon Initializing Component
  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
  }

  // Function to Get the List of Initial Users
  protected override getData(): void {

    // Alrady Loading Check
    if (this.Loading || this.isFullListLoaded) return;
    this.Loading = true;  
      this.alertService.startLoadingMessage();

      // API CALL
      this.userClient.getUsers(
        false,
        this.input,
        false,
        this.page,
        10,
        'name'
      ).subscribe((result) => {
        const newData = result.data ?? [];

        // Add New Users To The List
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

  // Function th Get the List of Users After Searching Inside the Modal
  getSearchData(): void {
    this.input = this.searchControl.value

    // Empty the Exisitng User List
    this.users.next([]);
    // if (this.Loading || this.isFullListLoaded) return;
    this.Loading = true;  
      this.alertService.startLoadingMessage();

      // API CALL
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

  // Function to Initiate a New Chat With a User
  initiateChat(targetUserId: string) {

    // API CALl
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

    // Close the Modal After Initiating the Chat
    this.close()    
  }

  // Helper Function Called Inisde the Initaite Chat Function To Join Conversation
  conversationClick(chat: ConversationDto) {

    // Function to Join Conversation Via Conversation Service
    this.conversationService.selectChat(chat);
  }

  // Function To Load More Data Upon Scrolling to the bottom of the Div
  onScroll() {

    // Get the Scrolling Container and Check Position of Scrollbar
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    // Check to See if Already Loading or if not at the Bottom
    if (atBottom && !this.isLoading && !this.isFullListLoaded) {

      // Increment in Page
      this.page++;

      // API CALL 
      this.getData();
    }
  }

  // Modal Close Function
  close() {
    this.modal.close();
  }

}
