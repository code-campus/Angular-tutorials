/**
 * Import des dépendances Angular
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Import des services
 */
import { AuthenticationService } from './modules/security/services/authentication.service';

/**
 * Import des interfaces
 */
import { User } from './modules/security/interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'my-project';

  // currentUser: User;

  // constructor(
  //   private router: Router,
  //   private authenticationService: AuthenticationService
  // ) {
  //   this.authenticationService.currentUser.subscribe(x => {
  //     this.currentUser = x;
  //     console.log( x );
      
  //   });
  // }

  // logout() {
  //   this.authenticationService.logout();
  //   this.router.navigate(['/login']);
  // }
}
