import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  label: string;
}

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class LanguageToggleComponent {
  @Input() currentLanguage: string = 'en';
  @Input() languages: Language[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];
  @Output() languageChange = new EventEmitter<string>();

  constructor(private translate: TranslateService) {}

  setLanguage(langCode: string): void {
    this.currentLanguage = langCode;
    this.translate.use(langCode);
    localStorage.setItem('lang', langCode);
    document.documentElement.lang = langCode;
    document.documentElement.dir = 'ltr';
    this.languageChange.emit(langCode);
  }

  getButtonClasses(langCode: string): string {
    // Base classes for all buttons
    const baseClasses = 'px-3 xs:px-3.5 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-1.5 sm:py-2 md:py-2.5 text-xs xs:text-sm sm:text-sm md:text-base font-medium rounded transition-all duration-200 whitespace-nowrap';

    if (this.currentLanguage === langCode) {
      // Active button styles
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 shadow-sm`;
    } else {
      // Inactive button styles
      return `${baseClasses} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600`;
    }
  }
}