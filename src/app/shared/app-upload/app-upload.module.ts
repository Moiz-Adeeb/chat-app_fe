import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUploadComponent } from './components/app-upload/app-upload.component';

@NgModule({
  exports: [AppUploadComponent],
  declarations: [AppUploadComponent],
  imports: [CommonModule],
})
export class AppUploadModule {}
