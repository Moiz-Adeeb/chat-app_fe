import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableHeader } from '../../../../models/table-header';
import { TranslatePipe } from '@ngx-translate/core';

export interface TableAction {
  name: string;
  icon?: string; // SVG path data for icons
  image?: string; // URL for images
  color?: string;
  title?: string;
  type?: 'icon' | 'image'; // Explicit type indicator
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PageChangeEvent {
  page: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
})
export class AppTableComponent {
  @Input() columns: TableHeader[] = [];
  @Input() paddingClass: string = 'p-[30px]'; // default padding
  @Input() pageSize: number = 10;
  @Input() page: number = 1;
  @Input() totalPage: number = 0;
  @Input() showPagination: boolean = true;
  @Input() rowClass: string = '';
  @Input() headerClass: string = '';
  @Input() tableClass: string = '';
  @Input() emptyMessage: string = 'No data available';
  @Input() emptyMessageHeight: string = '300';
  @Input() trackBy: string = 'id';
  @Input() pages: number[] = [];
  @Input() isEmpty: boolean = false;

  @Output() sortChange = new EventEmitter<TableHeader>();
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  @Output() isSelectedAll = new EventEmitter<{
    checked: boolean;
    title: string;
  }>();

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get totalPages(): number {
    return Math.ceil(this.totalPage / this.pageSize);
  }

  onSort(head: TableHeader): void {
    if (this.sortColumn === head.title) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = head.title;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit(head);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.page = page;
    this.pageChange.emit({
      page: this.page,
    });
  }

  protected readonly Math = Math;

  onCheckBoxChange(event: Event, title: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isSelectedAll.emit({ checked, title });
  }
}
