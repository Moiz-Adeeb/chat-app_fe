import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from "../../../../../../pipes/pipes.module";
import { AuthService } from '../../../../../../services/auth.service';
import { UnreadMessageService } from '../../../../../../services/unread-message.service';
import { AppButtonComponent } from "../../../../../../shared/app-button/components/app-button/app-button.component";
import { AppSearchFieldComponent } from "../../../../../../shared/app-search-field/components/app-search-field/app-search-field.component";
import { BasePaginationComponent } from '../../../../../../shared/base-pagination-component';
import { SignalRService } from './../../../../../../services/signal-r.service';
import { SearchUsersDialogComponent } from './components/search-users-dialog/search-users-dialog.component';

@Component({
  selector: 'app-search-users',
  imports: [CommonModule, PipesModule, AsyncPipe, AppSearchFieldComponent, AppButtonComponent],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.css'
})
export class SearchUsersComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  // Injecting Unread Message Service to Get the Current Bumber of Unread Messages the User has
  private unreadMessageService = inject(UnreadMessageService);

  // To Store the Number of Unread Messages Update in Real-Time
  unreadMessages$ = this.unreadMessageService.unreadMessages$

  // Outputs for Search Box Input to Send to Modal Component
  @Output() input = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  // Initializing Constructor for Services will Need Later
  constructor(
    private router : Router,
    private authService: AuthService,
    private signalRService: SignalRService,
    private modal: NgbModal,
  ) {
    super();
  }

  // To Store the Value of the Search Box Input
  searchControl: FormControl = new FormControl<string>('', []);
  
  // Get The Initial umber of Unread Messages Via the Unread Messages Service
  ngOnInit(): void {
    // API CALL
    this.unreadMessageService.unreadMessages();
    // this.getData();
  }

  ngOnDestroy(): void {  
  }

  // Reset The Page Back to 1
  applyFilters(): void {
    this.page = 1;
    this.getData();
  }

  // Function to open the Modal
  getUsers(): void {
    // this.getData();
    const modalRef = this.modal.open(SearchUsersDialogComponent);
    modalRef.componentInstance.isInput = false;
    
    // Send the Value of the Search Box Input into the Modal
    modalRef.componentInstance.input = this.searchControl.value;
  }

  // Log the User out and Remove the User Data Stored in Local Store and Diconnect from SignalR
  onLogout() {

    // Disconeect from the Websocket Connection
    this.signalRService.disconnect();

    // Delete User Data from the Local Store and Remove Acces Token
    this.authService.logout();

    // Navigate Back to Login Page
    this.router.navigate(['/login']);
  }  

}
