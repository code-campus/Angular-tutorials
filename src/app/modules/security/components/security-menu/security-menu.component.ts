/**
 * Import des dépendances Angular
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Import des services
 */
import { AuthenticationService } from './../../services/authentication.service';

/**
 * Import des interfaces
 */
import { User } from './../../interfaces/user';

@Component({
  selector: 'security-menu',
  templateUrl: './security-menu.component.html',
})
export class SecurityMenuComponent {

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
