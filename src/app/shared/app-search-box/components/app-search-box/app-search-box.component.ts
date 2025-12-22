import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-box',
  templateUrl: './app-search-box.component.html',
  styleUrl: './app-search-box.component.scss',
  imports: [ReactiveFormsModule]
})
export class AppSearchBoxComponent implements OnInit {
  @Input() showLabel = false;
  @Input() noMargin = true;
  @Input() searchContorl = '';
  showSuggestions = false;

  @Input()
  isLoading = false;

  @Input()
  suggestions: string[] = [];

  @Input()
  isFullWidth = false;

  @Input()
  placeholder = 'Search...';

  @Input()
  set searchValue(value: string) {
    if (value == '') {
      this.searchControl.setValue(value);
    }
  }

  @Input()
  set resetValue(value: boolean) {
    if (value) {
      this.searchControl.reset();
    }
  }

  @Output()
  searchChange = new EventEmitter<string>();

  @Output()
  valueChange = new EventEmitter<string>();

  // @ViewChild('searchInput', {static: false})
  // searchInput: ElementRef;
  searchControl: FormControl = new FormControl();

  constructor(private ngCheck: ChangeDetectorRef) {}

  initForm() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.onSearchChange();
      });
  }
  onSearchChange() {
    setTimeout(() => this.searchChange.emit(this.searchControl.value));
  }

  clear() {
    this.searchControl.reset();
  }

  clearValue() {
    this.searchControl.reset();
  }

  setValue(value: string) {
    this.searchControl.setValue(value);
  }

  ngOnInit(): void {
    this.initForm();
  }
}
