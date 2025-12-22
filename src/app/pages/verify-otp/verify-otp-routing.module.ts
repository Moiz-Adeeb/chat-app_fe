import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VerifyOtpPageComponent} from './components/verify-otp-page/verify-otp-page.component';

const routes: Routes = [{
  path: '',
  component: VerifyOtpPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyOtpRoutingModule { }
