import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center">
      <div class="bg-gray-100 rounded-lg p-1 flex transition-colors">
        <button
          (click)="setTheme('light')"
          [class]="currentTheme === 'light' ?
            'px-3 py-2 text-sm font-medium bg-theme-white text-dark rounded-md shadow-sm transition-all flex items-center gap-2' :
            'px-3 py-2 text-sm font-medium text-secondary hover:text-dark transition-all flex items-center gap-2'"
          [attr.aria-pressed]="currentTheme === 'light'"
          aria-label="Switch to light theme">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
          <span class="hidden sm:inline">Light</span>
        </button>
        <button
          (click)="setTheme('dark')"
          [class]="currentTheme === 'dark' ?
            'px-3 py-2 text-sm font-medium bg-theme-white text-dark rounded-md shadow-sm transition-all flex items-center gap-2' :
            'px-3 py-2 text-sm font-medium text-secondary hover:text-dark transition-all flex items-center gap-2'"
          [attr.aria-pressed]="currentTheme === 'dark'"
          aria-label="Switch to dark theme">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:inline">Dark</span>
        </button>
        <button
          (click)="setTheme('system')"
          [class]="currentTheme === 'system' ?
            'px-3 py-2 text-sm font-medium bg-theme-white text-dark rounded-md shadow-sm transition-all flex items-center gap-2' :
            'px-3 py-2 text-sm font-medium text-secondary hover:text-dark transition-all flex items-center gap-2'"
          [attr.aria-pressed]="currentTheme === 'system'"
          aria-label="Use system theme">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 3H4a2 2 0 00-2 2v10a2 2 0 002 2h5v2H7a1 1 0 000 2h10a1 1 0 000-2h-2v-2h5a2 2 0 002-2V5a2 2 0 00-2-2zM4 5h16v10H4V5z"/>
          </svg>
          <span class="hidden sm:inline">Auto</span>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ThemeToggleComponent {
  currentTheme: Theme = 'system';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}