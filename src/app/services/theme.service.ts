import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';
export type ActualTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'preferred-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());
  private actualThemeSubject = new BehaviorSubject<ActualTheme>(this.resolveActualTheme(this.getStoredTheme()));

  theme$ = this.themeSubject.asObservable();
  actualTheme$ = this.actualThemeSubject.asObservable();

  constructor() {
    const initialTheme = this.getStoredTheme();
    this.applyTheme(initialTheme);

    // Listen for system theme changes when system theme is selected
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.themeSubject.value === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    let newTheme: Theme;

    switch (currentTheme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'system';
        break;
      default:
        newTheme = 'light';
        break;
    }

    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.storeTheme(theme);
    this.applyTheme(theme);

    const actualTheme = this.resolveActualTheme(theme);
    this.actualThemeSubject.next(actualTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  getCurrentActualTheme(): ActualTheme {
    return this.actualThemeSubject.value;
  }

  private getStoredTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return 'light'; // Default to light theme
  }

  private storeTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }

  private getSystemPreference(): ActualTheme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private resolveActualTheme(theme: Theme): ActualTheme {
    if (theme === 'system') {
      return this.getSystemPreference();
    }
    return theme;
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const actualTheme = this.resolveActualTheme(theme);

      if (actualTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}