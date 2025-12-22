export class TableHeader {
  title: string;
  sort: string;
  sortable = true;
  isCheckBox = false;
  toolTip = '';
  width = '50';
  minWidth?: string;
  sortIcon = 'fas fa fa-sort';
  style?: { [key: string]: string };
  className?: string;

  constructor(
    title: string,
    sort: string,
    sortable: boolean,
    width = '50',
    isCheckBox = false,
    toolTip = '',
    style?: { [key: string]: string },
    className?: string,
    minWidth?: string
  ) {
    this.title = title;
    this.sort = sort;
    this.sortable = sortable;
    this.isCheckBox = isCheckBox;
    this.width = width;
    this.toolTip = toolTip;
    this.style = style;
    this.className = className;
    this.minWidth = minWidth;
  }

  set sortingDirection(value: boolean) {
    if (value) {
      this.sortIcon = 'fas fa fa-sort-up';
    } else {
      this.sortIcon = 'fas fa fa-sort-down';
    }
  }

  revertSorting(): void {
    this.sortIcon = 'fas fa fa-sort';
  }
}
