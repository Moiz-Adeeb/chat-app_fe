import { translate } from '@angular/localize/tools';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './app-dropdown.component.html',
  styleUrls: ['./app-dropdown.component.css'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, FormsModule, TranslatePipe],
})
export class AppDropdownComponent implements OnInit, OnDestroy {
  @Input() options: any[] = [];
  @Input() placeholder: string = "SelectAnOption";
  @Output() optionSelected = new EventEmitter<any>();
  @Output() buttonClicked = new EventEmitter();
  @Output() refreshClicked = new EventEmitter();
  @Input() label: string = '';
  @Input() readonly: boolean = false;
  @Input() labelFontSize: string = 'text-[14px]';
  @Input() labelFontFamily: string = 'font-gilroy-semibold';
  @Input() showRefresh: boolean = false;
  @Input() buttonText: string = '';
  @Input() isMultiple: boolean = false;
  @Input() displayValue: string = 'name';
  @Input() bindValue: string = 'id';
  @Input() hasMargin: boolean = true;
  @Input() showError: boolean = true;

  searchTerm: string = '';
  _dropDownControl: FormControl = new FormControl();
  private subscription: Subscription = Subscription.EMPTY;
  dropdownOpen = false;
  dropdownPosition = { top: 0, left: 0, width: 0 };

  toggleDropdown(buttonRef?: HTMLElement) {
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen && buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + 10,
        left: rect.left,
        width: rect.width,
      };
    }
  }

  setDropdownPosition() {
    const buttonEl = document.querySelector(
      '.dropdown-button-class',
    ) as HTMLElement;
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect();
      this.dropdownPosition.top = rect.top - 240; // position above, adjust height
      this.dropdownPosition.left = rect.left;
    }
  }

  @Input()
  set dropDownControl(value: FormControl | undefined) {
    if (!value) return;
    this._dropDownControl = value;
    this.initListener();
  }

  get dropDownControl(): FormControl {
    return this._dropDownControl;
  }

  constructor(private _eref: ElementRef, public translate: TranslateService) {}

  ngOnInit(): void {
    this.initListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initListener(): void {
    this.subscription.unsubscribe();
    this.subscription = this._dropDownControl.valueChanges.subscribe(
      (value) => {
        this.optionSelected.emit(value);
      },
    );
  }

  showErrorState(): boolean {
    return (
      this.dropDownControl.invalid &&
      (this.dropDownControl.dirty || this.dropDownControl.touched)
    );
  }

  markAsTouched(): void {}

  // toggleDropdown() {
  //   if (!this.readonly) {
  //     this.dropdownOpen = !this.dropdownOpen;
  //   }
  // }

  getItemDisplay(item: any): string {
    return item ? item[this.displayValue] : '';
  }

  getItemValue(item: any): any {
    return item ? item[this.bindValue] : null;
  }

  buttonClick(): void {
    this.buttonClicked.emit();
  }

  refresh(): void {
    this.refreshClicked.emit();
  }

  trackByFn(index: number, item: any): any {
    return this.bindValue ? item[this.bindValue] : index;
  }

  selectOption(option: any) {
    if (this.readonly) return;

    const selectedValue = this.bindValue ? this.getItemValue(option) : option;

    if (this.isMultiple) {
      const currentValue = this._dropDownControl.value || [];
      const index = currentValue.indexOf(selectedValue);

      if (index === -1) {
        this._dropDownControl.setValue([...currentValue, selectedValue]);
      } else {
        const newValue = [...currentValue];
        newValue.splice(index, 1);
        this._dropDownControl.setValue(newValue);
      }
    } else {
      this._dropDownControl.setValue(selectedValue);
      this.optionSelected.emit(selectedValue);
      this.apply();
    }
  }
  apply() {
    this.dropdownOpen = false;
    this.markAsTouched();
  }
  isSelected(option: any): boolean {
    const optionValue = this.bindValue ? this.getItemValue(option) : option;
    const controlValue = this._dropDownControl.value;
    if (!controlValue) return false;
    return this.isMultiple
      ? controlValue.includes(optionValue)
      : controlValue === optionValue;
  }

  getSelectedDisplay(): string {
    const controlValue = this._dropDownControl.value;
    if (controlValue === null || controlValue === undefined)
      return this.placeholder;

    if (this.isMultiple) {
      return controlValue.length > 0
        ? controlValue
            .map((value: any) => {
              const option = this.options.find((opt) =>
                this.bindValue
                  ? this.getItemValue(opt) === value
                  : opt === value,
              );
              return option ? this.getItemDisplay(option) : '';
            })
            .filter(Boolean)
            .join(', ')
        : this.placeholder;
    } else {
      const selectedOption = this.bindValue
        ? this.options.find((opt) => this.getItemValue(opt) === controlValue)
        : controlValue;

      return selectedOption
        ? this.getItemDisplay(selectedOption)
        : this.placeholder;
    }
  }

  get filteredOptions(): any[] {
    const term = this.searchTerm?.toLowerCase() || '';
    if (!term) return this.options;

    return this.options.filter((option) =>
      this.getItemDisplay(option)?.toLowerCase().includes(term),
    );
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.markAsTouched();
    }
  }
}
