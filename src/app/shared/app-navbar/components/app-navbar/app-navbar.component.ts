import {Component, HostListener} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  imports: [
    RouterLink,
    FormsModule,
    RouterLinkActive,
    NgIf,
    NgForOf,
  ],
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent {
  navItems = [
    { label: 'Our Products', link: '/products' },
    { label: 'Collectibles', link: '/product-category' },
    { label: 'Community', link: '/community' },
    { label: 'Rewards', link: '/rewards' },
    { label: 'Games', link: '/games' },
    { label: 'Contact Us', link: '/contact-us' }
  ];
  isMobileMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';
  cartItemsCount = 2;



  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.toggleSearch();
    }
  }
}
