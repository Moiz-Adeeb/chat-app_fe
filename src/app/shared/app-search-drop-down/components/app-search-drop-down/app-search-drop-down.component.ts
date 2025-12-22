import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-drop-down',
  templateUrl: './app-search-drop-down.component.html',
  styleUrl: './app-search-drop-down.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppSearchDropDownComponent {
  subscription: Subscription = Subscription.EMPTY;

  private _dropDownControl: FormControl = new FormControl();

  @Output() selectChanged = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  @Output() refreshClicked = new EventEmitter();
  @Input() fieldName = '';
  @Input() buttonText = '';
  @Input() showRefresh = false;

  get dropDownControl(): FormControl {
    return this._dropDownControl;
  }

  @Input() set dropDownControl(value: FormControl | undefined) {
    if (value === null || value === undefined) {
      return;
    }
    this._dropDownControl = value;
    this.initListener();
  }

  @Input() hasMargin = true;
  @Input() showError = true;
  @Input() items: any[] = ['Test', 'Test2'];
  @Input() displayValue = 'name';
  @Input() bindValue = 'id';
  @Input() placeholder = 'Test';
  isFocused = false;

  constructor() {}

  ngOnInit(): void {
    this.initListener();
  }

  initListener(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = Subscription.EMPTY;
    }
    this.subscription = this._dropDownControl.valueChanges.subscribe((p) => {
      this.selectChanged.emit(p);
    });
  }

  buttonClick(): void {
    this.buttonClicked.emit();
  }

  refresh(): void {
    this.refreshClicked.emit();
  }
}
