/**
 * Import des dépendances Angular
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Import des composants
 */
import { HomepageComponent } from './homepage/homepage.component'
import { PrivatepageComponent } from './privatepage/privatepage.component'

/**
 * Import des `guards`
 */
import { AuthGuard } from './modules/security/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'private',
    component: PrivatepageComponent,
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
