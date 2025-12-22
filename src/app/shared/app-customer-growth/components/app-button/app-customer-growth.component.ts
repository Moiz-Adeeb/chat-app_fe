// app-customer-growth.component.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import { NgFor } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

@Component({
  selector: 'app-customer-growth',
  templateUrl: './app-customer-growth.component.html',
  styleUrls: ['./app-customer-growth.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class AppCustomerGrowthComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;

  customerData = [
    { label: 'United States', value: 58, color: '#4a5568' },
    { label: 'United Kingdom', value: 38, color: '#718096' },
    { label: 'France', value: 25, color: '#a0aec0' },
    { label: 'China', value: 17, color: '#cbd5e0' },
    { label: 'Germany', value: 12, color: '#e2e8f0' }
  ];

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const segmentLabelPlugin = {
      id: 'segmentLabelPlugin',
      afterDatasetsDraw(chart: any) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);

        ctx.save();
        meta.data.forEach((element: any, index: number) => {
          const value = dataset.data[index];
          const percentage = ((value / total) * 100).toFixed(0) + '%';

          const { x, y } = element.tooltipPosition();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(percentage, x, y);
        });
        ctx.restore();
      }
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.customerData.map(item => item.label),
        datasets: [{
          data: this.customerData.map(item => item.value),
          backgroundColor: [
            'rgba(0,0,0,0.9)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,0.7)',
            'rgba(0,0,0,0.6)',
            'rgba(0,0,0,0.5)',
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.3)'
          ],
          borderWidth: 0, // no space between
          spacing: 0      // no gap between slices
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '45%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#4f46e5',
            borderWidth: 1,
            callbacks: {
              label: context => `${context.label}: ${context.parsed}%`
            }
          }
        },
        layout: {
          padding: 0 // no extra padding
        }
      },
      plugins: [segmentLabelPlugin]
    };



    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
