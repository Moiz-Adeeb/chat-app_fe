import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgStyle, SvgIconComponent]
})
export class AppButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'danger' | 'custom' = 'primary';
  @Input() iconBefore?: string;
  @Input() iconAfter?: string;
  @Input() isIconImage = false;
  @Input() disabled = false;
  @Input() bgColor = 'black';
  @Input() hoverBgColor?: string;
  @Input() borderWidth = '0px';
  @Input() borderColor = 'black';
  @Input() hoverBorderColor?: string;
  @Input() iconOnly = false;
  @Input() textColor = 'white';
  @Input() hoverTextColor?: string;
  @Input() fontSize = '14px';
  @Input() fontFamily = 'font-montserrat';
  @Input() radius = '';
  @Input() padding = '';
  @Input() width = 'auto';
  @Input() height = 'auto';
  @Output() clicked = new EventEmitter();
  @Input() iconSize: string = 'h-5 w-5';
  @Input() iconGap: string = '0.5rem';
  @Input() customClass: string = '';

  private isHovering = false;

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  get customStyles() {
    if (this.type === 'custom') {
      const activeBg = this.isHovering && this.hoverBgColor ? this.hoverBgColor : this.bgColor;
      const activeBorderColor = this.isHovering && this.hoverBorderColor ? this.hoverBorderColor : this.borderColor;
      const activeTextColor = this.isHovering && this.hoverTextColor ? this.hoverTextColor : this.textColor;
      return {
        'background-color': activeBg,
        'text-color': activeTextColor,
        'color': activeTextColor,
        'font-size': this.fontSize,
        'font-family': this.fontFamily,
        'border-width': this.borderWidth,
        'border-color': activeBorderColor,
        'border-radius': this.radius,
        'width': this.width,
        'padding': this.padding
      };
    }
    return {};
  }
}

// import { NgClass, NgIf, NgStyle } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { SvgIconComponent } from 'angular-svg-icon';
//
// @Component({
//   selector: 'app-button',
//   templateUrl: './app-button.component.html',
//   styleUrls: ['./app-button.component.scss'],
//   standalone: true,
//   imports: [NgClass, NgIf, NgStyle, SvgIconComponent]
// })
// export class AppButtonComponent {
//   @Input() type: 'primary' | 'secondary' | 'danger' | 'custom' = 'primary';
//   @Input() iconBefore?: string;
//   @Input() iconAfter?: string;
//   @Input() isIconImage = false;
//   @Input() disabled = false;
//   @Input() bgColor = 'black';
//   @Input() iconOnly = false;
//   @Input() textColor = 'white';
//   @Input() fontSize = '14px';
//   @Input() fontFamily = 'font-montserrat';
//   @Input() radius = '';
//   @Input() padding = '';
//   @Input() width = 'auto';
//   @Input() height = 'auto';
//   @Output() clicked = new EventEmitter();
//   @Input() iconSize: string = 'h-5 w-5'; // for font icon fallback
//   @Input() iconGap: string = '0.5rem'; // Default to 0.5rem (8px)
//
//   onClick() {
//     if (!this.disabled) {
//       this.clicked.emit();
//     }
//   }
//
//   get customStyles() {
//     if (this.type === 'custom') {
//       return {
//         'background-color': this.bgColor,
//         'text-color': this.textColor,
//         'color': this.textColor,
//         'font-size': this.fontSize,
//         'font-family': this.fontFamily,
//         'border-radius': this.radius,
//         'width': this.width,
//         'padding': this.padding
//       };
//     }
//     return {};
//   }
// }
