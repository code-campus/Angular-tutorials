/**
 * Import des dépendances Angular
 */
import { Component } from '@angular/core';

/**
 * Import des services
 */
import { AuthenticationService } from './../../services/authentication.service';

/**
 * Import des interfaces
 */
import { User } from './../../interfaces/user';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent {

  user: User;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.user = x;
    });
  }
}
