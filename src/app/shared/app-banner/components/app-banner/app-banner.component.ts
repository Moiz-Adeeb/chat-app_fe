import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './app-banner.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./app-banner.component.css']
})
export class AppBannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @ViewChild('paginationDots') paginationDots!: ElementRef;
  @ViewChild('playPauseBtn') playPauseBtn!: ElementRef;

  currentIndex = 0;
  isPlaying = true;
  slideInterval: any;
  slides: any[] = [
    {
      image: '/assets/svg/mask-group.svg',
      title: 'BELLA CLASSICA APPAREL AND ACCESSORIES',
      subtitle: 'ELEVATE YOUR GAME WITH',
      buttonText: 'Shop Now'
    },
    {
      image: '/assets/svg/mask-group.svg',
      title: 'PREMIUM ATHLEISURE WEAR',
      subtitle: 'NEW COLLECTION',
      buttonText: 'Explore'
    }
    // Add more slides as needed
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    this.pauseSlideShow();
  }


  updatePagination(): void {
    const dots = this.paginationDots.nativeElement.querySelectorAll('div');
    dots.forEach((dot: HTMLElement, index: number) => {
      dot.classList.toggle('opacity-100', index === this.currentIndex);
      dot.classList.toggle('opacity-50', index !== this.currentIndex);
    });
  }

  goToSlide(index: number): void {
    this.currentIndex = (index + this.slides.length) % this.slides.length;
    this.sliderContainer.nativeElement.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updatePagination();
  }

  nextSlide(): void {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide(): void {
    this.goToSlide(this.currentIndex - 1);
  }

  startSlideShow(): void {
    this.pauseSlideShow(); // Clear any existing interval
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    this.isPlaying = true;
    this.updatePlayPauseButton();
  }

  pauseSlideShow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.isPlaying = false;
    this.updatePlayPauseButton();
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this.pauseSlideShow();
    } else {
      this.startSlideShow();
    }
  }

  updatePlayPauseButton(): void {
    if (this.playPauseBtn) {
      this.playPauseBtn.nativeElement.innerHTML = this.isPlaying ?
        `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="3" height="15" stroke="white"/>
          <rect x="6.5" y="0.5" width="3" height="15" stroke="white"/>
        </svg>` :
        `<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7L0 0.00961876V13.9904L12 7Z" fill="white"/>
        </svg>`;
    }
  }

  handleNextClick(): void {
    this.nextSlide();
    if (this.isPlaying) {
      this.pauseSlideShow();
      this.startSlideShow();
    }
  }

  handlePrevClick(): void {
    this.prevSlide();
    if (this.isPlaying) {
      this.pauseSlideShow();
      this.startSlideShow();
    }
  }
}
