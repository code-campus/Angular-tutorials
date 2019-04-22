/**
 * Import des dépendances Angular
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Import des dépendances du module
 */
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { RenewPasswordComponent } from './components/renew-password/renew-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorInterceptor } from './helper/error.interceptor';
import { JwtInterceptor } from './helper/jwt.interceptor';

/**
 * Import des `guards`
 */
import { AuthGuard } from './guards/auth.guard';

/**
 * Table de routage interne au module
 */
const routes: Routes = [
  // Register
  {
    path: 'register',
    component: RegisterComponent
  },
  // Login
  {
    path: 'login',
    component: LoginComponent
  },
  // Forgotten Password
  {
    path: 'forgotten-password',
    component: ForgottenPasswordComponent
  },
  // Renew Password
  {
    path: 'renew-password',
    component: RenewPasswordComponent,
    canActivate: [AuthGuard]
  },
  // User Profile
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgottenPasswordComponent,
    RenewPasswordComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SecurityModule { }
