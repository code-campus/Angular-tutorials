/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../services/authentication.service';

@Injectable({ 
  providedIn: 'root' 
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const currentUser = this.authenticationService.currentUserValue;
    
    // Si l'utilisateur est identifier, on retourne `true`
    if (currentUser) return true;
    
    // Si l'utilisateur n'est pas identifier, on le redirige vers la page `login`
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    
    return false;
  }
}