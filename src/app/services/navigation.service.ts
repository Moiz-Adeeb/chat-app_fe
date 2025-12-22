import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private router: Router,
    private location: Location,
    private alertService: AlertService,
  ) {}

  navigateByUrl(url: string) {
    this.alertService.startLoadingMessage('Navigating...');
    this.router
      .navigateByUrl(url)
      .then((p) => {
        this.alertService.stopLoadingMessage();
      })
      .catch((e) => {
        this.alertService.stopLoadingMessage();
        this.alertService.showErrorMessage('Error in Navigation');
        console.log(e);
      });
  }

  back() {
    this.location.back();
  }
}
