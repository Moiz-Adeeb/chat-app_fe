import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export interface StatsCardData {
  name: string;
  icon?: string;       // SVG path
  iconClass?: string;  // Fallback icon class, e.g., 'fas fa-dollar-sign'
  count: number | string;
  text: string;
}

@Component({
  selector: 'app-kpi-cards',
  templateUrl: './app-kpi-cards.component.html',
  imports: [SvgIconComponent, TranslatePipe, NgIf],
  styleUrls: ['./app-kpi-cards.component.css'],
})
export class AppKpiCardsComponent {

  @Input() data!: StatsCardData;
  // @Input() kpiData: any;
  // kpiCards: any[] = [];

  // ngOnInit(): void {
  //   if (this.kpiData) {
  //     this.prepareKpiCards();
  //   }
  // }

  // ngOnChanges(): void {
  //   if (this.kpiData) {
  //     this.prepareKpiCards();
  //   }
  // }

  // private prepareKpiCards(): void {
  //   this.kpiCards = [
  //     {
  //       title: 'Total MOD Requests',
  //       value: this.kpiData.totalModRequests,
  //       trend: '12% from last month', // You would calculate this from your data
  //       trendIcon: 'fas fa-arrow-up',
  //       trendColor: 'text-success',
  //       icon: 'fas fa-file-lines',
  //       iconBg: 'bg-blue-100',
  //       iconColor: 'text-primary',
  //     },
  //     {
  //       title: 'Approval Rate',
  //       value:
  //         this.kpiData.totalApprovedModRequests > 0
  //           ? (
  //               (this.kpiData.totalApprovedModRequests /
  //                 this.kpiData.totalModRequests) *
  //               100
  //             ).toFixed(1) + '%'
  //           : '0%',
  //       trend: '2.1% improvement', // Calculate this from your data
  //       trendIcon: 'fas fa-arrow-up',
  //       trendColor: 'text-success',
  //       icon: 'fas fa-circle-check',
  //       iconBg: 'bg-green-100',
  //       iconColor: 'text-success',
  //     },
  //     {
  //       title: 'Avg Approval Time',
  //       value: this.kpiData.avgApprovalTime + 'h',
  //       trend: 'Same as last month', // Calculate this from your data
  //       trendIcon: 'fas fa-minus',
  //       trendColor: 'text-warning',
  //       icon: 'fas fa-clock',
  //       iconBg: 'bg-yellow-100',
  //       iconColor: 'text-warning',
  //     },
  //     {
  //       title: 'Late Requests',
  //       value:
  //         this.kpiData.totalLateModRequests > 0
  //           ? (
  //               (this.kpiData.totalLateModRequests /
  //                 this.kpiData.totalModRequests) *
  //               100
  //             ).toFixed(1) + '%'
  //           : '0%',
  //       trend: '1.2% reduction', // Calculate this from your data
  //       trendIcon: 'fas fa-arrow-down',
  //       trendColor: 'text-danger',
  //       icon: 'fas fa-triangle-exclamation',
  //       iconBg: 'bg-red-100',
  //       iconColor: 'text-danger',
  //     },
  //   ];
  // }
}
