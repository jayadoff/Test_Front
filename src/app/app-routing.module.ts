import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { OtpMatchComponent } from './components/otp-match/otp-match.component';
import { PasswordSetupComponent } from './components/password-setup/password-setup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OnlineAddFormComponent } from './components/online-add-form/online-add-form.component';
import { ApplicationStatusComponent } from './components/application-status/application-status.component';
import { AuthGuard } from './guard/auth.guard';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  {path: '', redirectTo:'/login', pathMatch:'full'},
  { path: 'login', component:LoginComponent },
  { path: 'registration', component:RegistrationComponent},
  { path: 'otp', component:OtpMatchComponent},
  { path: 'password', component:PasswordSetupComponent},

  // { path: 'dashboard', component:DashboardComponent},
  {
    path: 'dashboard',
    canActivate: [AuthGuard], // Use AuthGuard to protect dashboard route
    component: DashboardComponent
  },
  { path: 'application-status', component:ApplicationStatusComponent},
  { path: 'payment', component:PaymentComponent},
  { path: '**', component: LoginComponent },


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
