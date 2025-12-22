import { inject } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { TableHeader } from '../models/table-header';
import { AlertService } from '../services/alert.service';

export class BasePaginationComponent {
  private getDataSubject = new Subject<void>();
  constructor() {
    this.initialize(); // make sure it's called
  }
  protected initialize(): void {
    const sub = this.getDataSubject.pipe(debounceTime(700)).subscribe(() => {
      console.log('Debounced call');
      this.getData();
    });

    this.subscriptions.push(sub);
  }
  openMenuId: number | null | string = null;
  resetPopup() {
    // this.openMenuId = null;
  }
  subscriptions: Subscription[] = [];
  prevHead?: TableHeader = undefined;
  sort = '';
  direction = 'desc';
  totalPages = 0;

  get direction_bool() {
    return this.direction == 'desc';
  }

  search = '';
  page = 1;
  pageSize = 10;
  totalPage = 0;
  alertService: AlertService = inject(AlertService);

  get isDescending(): boolean {
    return this.direction === 'desc';
  }

  get isLoading(): boolean {
    return this.alertService.isLoadingInProgress;
  }

  refresh(): void {
    this.page = 1;
    this.totalPage = 1;
    if (this.search === '') {
      this.getData();
    } else {
      this.search = '';
    }
  }

  changePage(page: number): void {
    this.page = page;
    this.getData();
  }

  sortData(head: TableHeader): void {
    if (!head.sortable) {
      return;
    }
    if (this.sort === head.sort) {
      this.prevHead = head;
      if (this.direction === 'desc') {
        this.direction = 'asc';
        this.prevHead.sortingDirection = true;
      } else {
        this.direction = 'desc';
        this.prevHead.sortingDirection = false;
      }
    } else {
      if (this.prevHead) {
        this.prevHead.revertSorting();
        this.prevHead = undefined;
      }
      this.sort = head.sort;
      this.direction = 'desc';
      this.prevHead = head;
      this.prevHead.sortingDirection = false;
    }

    this.getData();
  }

  onSearchChanged(search: string): void {
    console.log(search + ' is the new search');
    this.page = 1;
    this.totalPage = 1;
    this.search = search;
    this.getDataSubject.next();
  }

  pages: number[] = [];
  showEllipsis = false;
  maxSize = 3; // Adjust the max number of visible pages
  setPagination() {
    this.totalPages = Math.ceil(this.totalPage / this.pageSize);

    // Handle case when there are no items
    if (this.totalPages <= 1) {
      this.pages = [];
      this.showEllipsis = false;
      return;
    }

    const pages = [];
    const maxVisiblePages = this.maxSize;
    let startPage: number, endPage: number;

    // When total pages is less than max visible pages, show all pages
    if (this.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = this.totalPages;
    }
    // When current page is near the beginning
    else if (this.page <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = maxVisiblePages;
    }
    // When current page is near the end
    else if (this.page + Math.floor(maxVisiblePages / 2) >= this.totalPages) {
      startPage = this.totalPages - maxVisiblePages + 1;
      endPage = this.totalPages;
    }
    // When current page is in the middle
    else {
      startPage = this.page - Math.floor(maxVisiblePages / 2);
      endPage = this.page + Math.floor(maxVisiblePages / 2);
    }

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Determine if ellipsis should be shown
    this.showEllipsis = endPage < this.totalPages;
    this.pages = pages;
  }
  protected getData(): void {}
}
