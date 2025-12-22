import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BoolToLabelPipe } from './bool-to-label.pipe';
import { AppCurrencyPipe } from './app-currency.pipe';
import { AppDatePipe } from './app-date.pipe';

@NgModule({
  declarations: [BoolToLabelPipe, AppCurrencyPipe, AppDatePipe],
  exports: [BoolToLabelPipe, AppCurrencyPipe, AppDatePipe],
  imports: [CommonModule],
  providers: [DatePipe],
})
export class PipesModule {}
