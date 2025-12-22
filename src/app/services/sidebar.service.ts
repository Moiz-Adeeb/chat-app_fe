import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsed$ = new BehaviorSubject<boolean>(true);
  private mobileSidebarOpen$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.sidebarCollapsed$.next(JSON.parse(savedState));
    } else {
      // Set default to collapsed (true) and save to localStorage
      this.sidebarCollapsed$.next(true);
      localStorage.setItem('sidebarCollapsed', JSON.stringify(true));
    }
  }

  getSidebarCollapsed(): Observable<boolean> {
    return this.sidebarCollapsed$.asObservable();
  }

  getMobileSidebarOpen(): Observable<boolean> {
    return this.mobileSidebarOpen$.asObservable();
  }

  toggleSidebar(): void {
    const newState = !this.sidebarCollapsed$.value;
    this.sidebarCollapsed$.next(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen$.next(!this.mobileSidebarOpen$.value);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen$.next(false);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed$.next(collapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }
}