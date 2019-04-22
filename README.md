#  Sécurité : Enregistrement et connexion d'un utilisateur
> ### Objectifs :
> Savoir créer un systeme complet d'identification d'utilisateur
> ### Notes :
> Ce cours est la suite du cours [Symfony : Gestion des utilisateurs en WebService](https://github.com/OSW3-Campus/Symfony4-tutorials/tree/user-webservice)




# Création d'un projet 

```bash
ng new my-project --style=less --routing
cd my-project
```



# Modifier la constante d'environement

Ajouter à la constante d'environement du fichier `src/environments/environment[.prod].ts`. 

- `apiEndpoint` : définition de l'adresse du serveur d'API.

```typescript
export const environment = {
  // ...
  apiEndpoint: 'http://127.0.0.1:8000/api/'
};
```



# Création du module `security`

Le module `security` va contenir tous les éléments relatif à la sécurité de l'application.


## Création du module

```bash
ng generate module modules/security --module=app
```


## Importation des dépendances du module

Importer les dépendances du module dans le fichier pricinpale du module `security.module.ts`.

- Le module de gestion du routage `@angular/router`
- Le module de gestion des formulaires `@angular/forms`
- Le module de requêtes HTTP `@angular/common/http`
- Le composant `register.component`
- Le composant `forgotten-password.component`
- Le composant `reset-password.component`
- Le composant `renew-password.component`
- L'intercepteur `error.interceptor`
- L'intercepteur `jwt.interceptor`

```typescript
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

/**
 * Import des `guards`
 */
import { AuthGuard } from './guards/auth.guard';
// ...

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgottenPasswordComponent,
    RenewPasswordComponent,
    ProfileComponent
  ],
  imports: [
    // ...
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
```


## Définition du routage du module

Définir la table de routage du module dans le fichier principale du module `security.module.ts`.

Liste des routes de la table de routage du module : 

- `site.com/register`
- `site.com/login`
- `site.com/forgotten-password`
- `site.com/renew-password`
- `site.com/profile`

```typescript
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'renew-password', component: RenewPasswordComponent },
  { path: 'profile', component: ProfilesComponent, canActivate: [AuthGuard] }
];
```


## Importation des intercepteurs

Importer les intercepteurs dans le fichier pricinpale du module `security.module.ts`.

```typescript
/**
 * Import des composants du module
 */
import { ErrorInterceptor } from './helper/error.interceptor';
import { JwtInterceptor } from './helper/jwt.interceptor';

// ...

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
``` 





# Création du Garde

## Création du fichier

```bash
ng generate guard modules/security/guards/auth
```
Sélectionner 'CanActivate'


## Importer les dépendances du Garde

Importer les dépendances

- Le module de gestion du routage `@angular/router`
- Le service `authentication.service`

```typescript
/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../services/authentication.service';

// ...

constructor(
  private router: Router,
  private authenticationService: AuthenticationService
) {}
```


## Modifier la classe

```typescript
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
```




# Création des Intercepteur

## Http Error Interceptor

L'intercepteur de code HTTP, exécute une action selon le code réponse HTTP du serveur.

### Création du fichier

```bash
ng generate class modules/security/helper/error --type=interceptor
```


### Importer les dépendances

- Le module de requêtes HTTP `@angular/common/http`
- Le module `rxjs`
- Les opérateur `rxjs/operators`
- Le service `authentication.service`

```typescript
/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../services/authentication.service';

// ...

constructor(
  private authenticationService: AuthenticationService
) {}
```


### Modifier la classe

```typescript
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      // Si le serveur retourne le code 401 (Unauthorized)
      // On force la déconexion de l'application
      if (err.status === 401) {
        this.authenticationService.logout();
        location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
```



## JWT Interceptor

L'intercepteur Json Web Token se charge d'ajouter de modifier l'entête HTTP des requêtes en injectant le paramètre `Authorization` avec le token. 

### Création du fichier

```bash
ng generate class modules/security/helper/jwt --type=interceptor
```


### Importer les dépendances

- Le module de requêtes HTTP `@angular/common/http`
- Le module `rxjs`
- Le service `authentication.service`

```typescript
/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../services/authentication.service';

// ...

constructor(
  private authenticationService: AuthenticationService
) {}
```


### Modifier la classe

```typescript
export class JwtInterceptor implements HttpInterceptor {
    
  constructor(
    private authenticationService: AuthenticationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
    // Ajout de l'autorisation à l'entête HTTP si le token existe
    let currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
```





# Création des Interfaces

## Création de l'interface `User`

### Création du fichier

```bash
ng generate interface modules/security/interfaces/User
```

### Ajout des propriétés

```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string;
  token?: string;
}
```


## Création de l'interface `Register`

L'interface `Register` va permettre de typer l'objet `user` lors du processus d'enregistrement d'un utilisateur.

### Création du fichier

```bash
ng generate interface modules/security/interfaces/Register
```

### Ajout des propriétés

```typescript
export interface RegisterInterface {
  firstname: string,
  lastname: string,
  email: string,
  password: string
}
```


## Création de l'interface `Login`

L'interface `Login` va permettre de typer l'objet `user` lors du processus d'identification.

### Création du fichier

```bash
ng generate interface modules/security/interfaces/Login
```

### Ajout des propriétés

```typescript
export interface LoginInterface {
  email: string,
  password: string
}
```

## Création de l'interface `ForgottenPassword`

### Création du fichier

```bash
ng generate interface modules/security/interfaces/ForgottenPassword
```

### Ajout des propriétés

```typescript
export interface ForgottenPasswordInterface {
  email: string;
}
```

## Création de l'interface `RenewPassword`

### Création du fichier

```bash
ng generate interface modules/security/interfaces/RenewPassword
```

### Ajout des propriétés

```typescript
export interface RenewPasswordInterface {
  passwordOld: string;
  passwordNew: string;
  passwordConfirmation: string;
}
```




# Création des Services

## Création du service `Authentication`

### Création du fichier

```bash
ng generate service modules/security/services/Authentication
```


### Importer les dépendances

- Le module de gestion des requêtes `@angular/common/http`
- Le module `rxjs`
- Les opérateurs `rxjs/operators`
- La config d'environnement `environment`
- L'interface `User`
- L'interface `Register`
- L'interface `Login`
- L'interface `ForgottenPassword`

```typescript
/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

/**
 * Import des dépendances du module
 */
import { User } from './../interfaces/user';
import { RegisterInterface } from './../interfaces/register';
import { LoginInterface } from './../interfaces/login';
import { ForgottenPasswordInterface } from './../interfaces/forgotten-password';

// ...

const Headers = new HttpHeaders({
  'Content-Type': 'application/json' 
});

// ...

constructor(
  private http: HttpClient
) {
  this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  this.currentUser = this.currentUserSubject.asObservable();
}
```


### Ajouter les propriétés et méthodes

```typescript
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Register
   * 
   * @param user: RegisterInterface
   */
  register(user: RegisterInterface) {
      
    var url = environment.apiEndpoint + 'register';

    return this.http.post<any>(url, user, {headers: Headers})
      .pipe(map(
        response => {
          return response;
        }));
  }

  /**
   * Login
   * 
   * Contact le serveur de l'API et tente d'identifier un utilisateur
   * 
   * @param user: LoginInterface
   */
  login(username: string, password: string) {

    var url = environment.apiEndpoint + 'login';

    return this.http.post<any>(url, user, {headers: Headers})
      .pipe(map(
        user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        }));
  }

  /**
   * Logout
   * 
   * Efface du stockage locale, les données de l'utilisateur
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Forgotten Password
   * 
   * @param user 
   */
  forgottenPassword(user: ForgottenPasswordInterface) {
      
    var url = environment.apiEndpoint + 'forgotten-password';

    return this.http.post<any>(url, user, {headers: Headers})
      .pipe(map(
        response => {
          return response;
        }));

  }

  // TODO: Ajout de la méthode `renewPassword`
}
```


## Création du service `User`

### Création du fichier

```bash
ng generate service modules/security/services/User
```


### Importer les dépendances

- Le module de gestion des requêtes `@angular/common/http`
- La config d'environnement `environment`
- L'interface `User`

```typescript
/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';

/**
 * Import des dépendances du module
 */
import { User } from './../interfaces/user';

// ...

constructor(
  private http: HttpClient
) {}
```


### Ajouter les propriétés et méthodes

```typescript
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  getAll() {
    return this.http.get<User[]>( environment.apiEndpoint + 'users' );        
  }
}
```




# Création des Composants

## Création du composant `register`

### Création du fichier

```bash
ng generate component modules/security/components/register
```

### Importer le composant dans le module `security`

importer le composant dans le fichier principal du module `security.module.ts` et ajouter la composant à la table de routage du module.

```typescript
import { RegisterComponent } from './components/register/register.component';

// ...

const routes: Routes = [
  // ...
  { path: 'register', component: RegisterComponent },
  // ...
];

// ...

@NgModule({
  declarations: [
    RegisterComponent
  ],
})
```

### Importer les dépendances du composant

- Le module de gestion du routage `@angular/router`
- Le module de gestion des formulaire `@angular/forms`
- Les opérateurs rxjs `rxjs/operators`
- Le service `authentication.service`
- L'interface `register`

```typescript
/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../../services/authentication.service';
import { RegisterInterface } from './../../interfaces/register';

// ... 

constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private authenticationService: AuthenticationService
) {}
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({
  templateUrl: './register.component.html',
})
```

#### Modifier la classe

```typescript
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  user: RegisterInterface;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  // TODO: Email format validator
  // TODO: Password format validator
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required], 
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.user = {
      firstname: this.f.firstname.value,
      lastname: this.f.lastname.value,
      email: this.f.email.value,
      password: this.f.password.value,
    };

    this.authenticationService.register(this.user)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([`/login`]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
}
```

### Modifier le HTML du composant

```html
<h2>Register</h2>

<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    
	<div class="form-group">
    <label for="firstname">Firstname</label>
    <input type="text" formControlName="firstname" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.firstname.errors }" />
    <div *ngIf="submitted && f.firstname.errors" class="invalid-feedback">
      <div *ngIf="f.firstname.errors.required">Firstname is required</div>
    </div>
  </div>

  <div class="form-group">
    <label for="lastname">Lastname</label>
    <input type="text" formControlName="lastname" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.lastname.errors }" />
    <div *ngIf="submitted && f.lastname.errors" class="invalid-feedback">
      <div *ngIf="f.lastname.errors.required">Lastname is required</div>
    </div>
  </div>

	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" formControlName="email" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.email.errors }" />
		<div *ngIf="submitted && f.email.errors" class="invalid-feedback">
			<div *ngIf="f.email.errors.required">Email is required</div>
		</div>
	</div>

	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" formControlName="password" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.password.errors }" />
		<div *ngIf="submitted && f.password.errors" class="invalid-feedback">
			<div *ngIf="f.password.errors.required">Password is required</div>
		</div>
	</div>

	<div class="form-group">
		<button [disabled]="loading" class="btn btn-primary">Register</button>
		<img *ngIf="loading" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
	</div>

	<div *ngIf="error" class="alert alert-danger">{{error}}</div>

</form>

<a [hidden]="currentUser" [routerLink]="['/login']">Login</a>
```


## Création du composant `login`

Le composant `login` permet de gérer l'identification d'un utilisateur.

### Création du fichier

```bash
ng generate component modules/security/components/login
```

### Importer le composant dans le module `security`

importer le composant dans le fichier principal du module `security.module.ts` et ajouter la composant à la table de routage du module.

```typescript
import { LoginComponent } from './components/login/login.component';

// ...

const routes: Routes = [
  // ...
  { path: 'login', component: LoginComponent },
  // ...
];

// ...

@NgModule({
  declarations: [
    LoginComponent
  ],
})
```

### Importer les dépendances du composant

- Le module de gestion du routage `@angular/router`
- Le module de gestion des formulaire `@angular/forms`
- Les opérateurs rxjs `rxjs/operators`
- Le service `authentication.service`
- L'interface `login`

```typescript
/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../../services/authentication.service';
import { LoginInterface } from './../../interfaces/login';

// ... 

constructor(
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService
) {}
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({ 
  templateUrl: 'login.component.html' 
})
```

#### Modifier la classe

```typescript
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  user: LoginInterface;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.user = {
      email: this.f.email.value,
      password: this.f.password.value
    };
        
    this.authenticationService.login(this.user)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
}
```

### Modifier le HTML du composant

```html
<h2>Login</h2>

<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    
	<div class="form-group">
		<label for="email">Email</label>
		<input type="text" formControlName="email" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.email.errors }" />
		<div *ngIf="submitted && f.email.errors" class="invalid-feedback">
			<div *ngIf="f.email.errors.required">Email is required</div>
		</div>
	</div>

	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" formControlName="password" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.password.errors }" />
		<div *ngIf="submitted && f.password.errors" class="invalid-feedback">
			<div *ngIf="f.password.errors.required">Password is required</div>
		</div>
	</div>

	<div class="form-group">
		<button [disabled]="loading" class="btn btn-primary">Login</button>
		<img *ngIf="loading" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
	</div>

	<div *ngIf="error" class="alert alert-danger">{{error}}</div>
	
</form>

<a [hidden]="currentUser" [routerLink]="['register']">Register</a> - 
<a [hidden]="currentUser" [routerLink]="['forgotten-password']">Forgotten Password</a> 
```


## Création du composant `forgottenPassword`

### Création du fichier

```bash
ng generate component modules/security/components/forgottenPassword
```

### Importer le composant dans le module `security`

importer le composant dans le fichier principal du module `security.module.ts` et ajouter la composant à la table de routage du module.

```typescript
import { ForgottenPasswordComponent } from './components/forgottenPassword/forgottenPassword.component';

// ...

const routes: Routes = [
  // ...
  { path: 'forgottenPassword', component: ForgottenPasswordComponent },
  // ...
];

// ...

@NgModule({
  declarations: [
    ForgottenPasswordComponent
  ],
})
```

### Importer les dépendances du composant

- Le module de gestion du routage `@angular/router`
- Le module de gestion des formulaire `@angular/forms`
- Les opérateurs rxjs `rxjs/operators`
- Le service `authentication.service`
- L'interface `ForgottenPassword`

```typescript
/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../../services/authentication.service';
import { ForgottenPasswordInterface } from './../../interfaces/forgotten-password';

// ... 

constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private authenticationService: AuthenticationService
) {}
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({
  templateUrl: './forgotten-password.component.html',
})
```

#### Modifier la classe

```typescript
export class ForgottenPasswordComponent implements OnInit {

  forgottenPasswordForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  user: ForgottenPasswordInterface;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.forgottenPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgottenPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.user = {
      email: this.f.email.value
    };

    this.authenticationService.forgottenPassword(this.user)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([`/login`]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgottenPasswordForm.controls; }

}
```

### Modifier le HTML du composant

```html
<h2>Forgotten Password</h2>

<form [formGroup]="forgottenPasswordForm" (ngSubmit)="onSubmit()">
    
	<div class="form-group">
		<label for="email">Email</label>
		<input type="text" formControlName="email" class="form-control" [ngClass]="{ 'is-invalid': submitted && f.email.errors }" />
		<div *ngIf="submitted && f.email.errors" class="invalid-feedback">
			<div *ngIf="f.email.errors.required">Email is required</div>
		</div>
	</div>

	<div class="form-group">
		<button [disabled]="loading" class="btn btn-primary">Login</button>
		<img *ngIf="loading" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
	</div>

	<div *ngIf="error" class="alert alert-danger">{{error}}</div>

</form>

<a [hidden]="currentUser" [routerLink]="['/register']">Register</a> - 
<a [hidden]="currentUser" [routerLink]="['/login']">Login</a> 
```



## XXX Création du composant `renewPassword`

### Création du fichier

```bash
ng generate component modules/security/components/renewPassword
```

### Importer le composant dans le module `security`

importer le composant dans le fichier principal du module `security.module.ts` et ajouter la composant à la table de routage du module.

```typescript
import { RenewPasswordComponent } from './components/renew-password/renew-password.component';

// ...

const routes: Routes = [
  // ...
  { path: 'renewPassword', component: RenewPasswordComponent, canActivate: [AuthGuard] },
  // ...
];

// ...

@NgModule({
  declarations: [
    RenewPasswordComponent
  ],
})
```

### Importer les dépendances du composant

- Le module de gestion du routage `@angular/router`
- Le module de gestion des formulaire `@angular/forms`
- Les opérateurs rxjs `rxjs/operators`
- Le service `authentication.service`
- L'interface `RenewPassword`

```typescript
/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../../services/authentication.service';
import { RenewPasswordInterface } from './../../interfaces/renew-password';

// ... 

constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private authenticationService: AuthenticationService
) {}
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({
  templateUrl: './renew-password.component.html',
})
```

#### Modifier la classe

```typescript
```

### Modifier le HTML du composant

```html
```


## Création du composant `profile`

### Création du fichier

```bash
ng generate component modules/security/components/profile
```

### Importer le composant dans le module `security`

importer le composant dans le fichier principal du module `security.module.ts` et ajouter la composant à la table de routage du module.

```typescript
import { ProfileComponent } from './components/profile/profile.component';

// ...

const routes: Routes = [
  // ...
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // ...
];

// ...

@NgModule({
  declarations: [
    ProfileComponent
  ],
})
```

### Importer les dépendances du composant

- Le service `authentication.service`
- L'interface `User`

```typescript
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
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
```

#### Modifier la classe

```typescript
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
```

### Modifier le HTML du composant

```html
<h2>Profile</h2>

<div>ID: {{ user.id }}</div>
<div>Firstname: {{ user.firstname }}</div>
<div>Lastname: {{ user.lastname }}</div>
<div>Email: {{ user.email }}</div>
```


## Création du composant `securityMenu`

### Création du fichier

```bash
ng generate component modules/security/components/securityMenu
```

### Importer le composant dans le module `security`

Inutile d'importer ce composant dans le fichier principal du module `security.module.ts`.

### Importer les dépendances du composant

- Le module de gestion du routage `@angular/router`
- Le service `authentication.service`
- L'interface `User`

```typescript
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
```

### Modifier le composant

#### Définir le composant

```typescript
@Component({
  selector: 'security-menu',
  templateUrl: './security-menu.component.html',
})
```

#### Modifier la classe

```typescript
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
```

### Modifier le HTML du composant

```html
<nav>

  <ng-template [ngIf]="currentUser" [ngIfElse]="loggedOut">
    <a [routerLink]="['/profile']">{{ currentUser.firstname }}</a> - 
    <a (click)="logout()">Logout</a>
  </ng-template>

  <ng-template #loggedOut>
    <a [routerLink]="['/register']">Register</a> - 
    <a [routerLink]="['/login']">Login</a>
  </ng-template>

</nav>
```

### Utiliser le composant

Pour utiliser le menu dans le composant principal.

#### Importer dans le module principal

```typescript
import { SecurityMenuComponent } from './modules/security/components/security-menu/security-menu.component';

// ...

@NgModule({
  declarations: [
    // ...
    SecurityMenuComponent
  ],
})
```

#### Utiliser le selecteur

Dans le template HTML `app.component.html` 

```html
<security-menu></security-menu>
```


# Création des composants test

L'objectif des composants de test `homepage` et `privatepage` et d'avoir un contenu en accès libre et un contenu en accès protégés.  
Pour la démo, les composants sont simplement créés et ajoutés au module principal de l'application sans être modifiés.

## Création du composant `homepage`

Le composant `homepage` permet d'avoir un lien avec du contenu en accès public.

### Création du fichier

```bash
ng generate component homepage
```

### Importer le composant dans le module principale de l'application

```typescript
import { HomepageComponent } from './homepage/homepage.component';

// ...

@NgModule({
  declarations: [
    // ...
    HomepageComponent,
  ],
})
```

### Ajouter le composant à la table de routage de l'appilication

Dans le fichier `app/app-routing.module.ts`.

```typescript
const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
];
```

## Création du composant `privatepage`

Le composant `privatepage` permet d'avoir un lien avec du contenu en accès protégé.

### Création du fichier

```bash
ng generate component privatepage
```

### Importer le composant dans le module principale de l'application

```typescript
import { PrivatepageComponent } from './privatepage/privatepage.component';

// ...

@NgModule({
  declarations: [
    // ...
    PrivatepageComponent,
  ],
})
```

### Ajouter le composant à la table de routage de l'appilication

Dans le fichier `app/app-routing.module.ts`.

```typescript
const routes: Routes = [
  {
    path: 'private',
    component: PrivatepageComponent,
    canActivate: [AuthGuard]
  },
];
```



# Modifier le template du composant principal

## Navigation `test`

Ajouter la navigation vers les pages tests dans le fichier `app/app.component.html`.

```html
<nav>
  <a [routerLink]="['/']">Home</a> - 
  <a [routerLink]="['private']">Private</a>
</nav>
```

## Navigation du module security

Les directives `ngIf` et `ngIfElse` permettent d'afficher les éléments de navigation selon l'état de la connexion utilisateur.

```html
<nav>
  <ng-template [ngIf]="currentUser" [ngIfElse]="loggedOut">
    <a [routerLink]="['/profile']">{{ currentUser.firstname }}</a> - 
    <a (click)="logout()">Logout</a>
  </ng-template>

  <ng-template #loggedOut>
    <a [routerLink]="['/register']">Register</a> - 
    <a [routerLink]="['/login']">Login</a>
  </ng-template>
</nav>
```



# Modifier le composant principal

## Importer les dépendances

- Le module de gestion du routage `@angular/router`
- Le service `authentication.service`
- L'interface `User`

```typescript
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

// ...

constructor(
  private router: Router,
  private authenticationService: AuthenticationService
) {
  this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}
```

## Ajouter les propriétés et méthodes

```typescript
export class AppComponent {
  title = 'my-project';

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
```



# Modifier le module principal

Ajouter le module `security` et les composants test `homepage` et  `privatepage` au module principale de l'application `app/app.module.ts`.

```typescript
/**
 * Module `security`
 */
import { SecurityModule } from './modules/security/security.module';

/**
 * Composants de test
 */
import { HomepageComponent } from './homepage/homepage.component';
import { PrivatepageComponent } from './privatepage/privatepage.component';

// ...

@NgModule({
  declarations: [
    // ...
    HomepageComponent,
    PrivatepageComponent
  ],
  imports: [
    // ...
    SecurityModule
  ],
})
```



# Modifier la table de routage principale

## Importer les dépendances

- Les composants test `HomepageComponent` et `PrivatepageComponent`
- Le guage d'authentification `AuthGuard`

```typescript
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
```

## Ajouter les routes

```typescript
const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'private',
    component: PrivatepageComponent,
    canActivate: [AuthGuard]
  }
];
```




# Démarrer le Serveur de développement

```bash
ng serve
```



# Création du module `security`




















## Création des interfaces


### Interface `forgotten-password`
### Interface `reset-password`
### Interface `renew-password`


# Création du service

Le service va permettre le passge d'information entre les composants du module.

## Création du service

```bash
ng generate service modules/security/services/security
```

## Importer les dépendances du service

Importer les dépendances du service dans le fichier du composant `app/modules/security/services/security.service.ts`.

- Le module de requêtes HTTP `@angular/common/http`
- Le module `rxjs`
- Le module `rxjs/operators`
- L'interface `RegisterInterface`
- L'interface `loginInterface`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RegisterInterface } from './../interfaces/register';

// ...
const Headers = new HttpHeaders({
  'Content-Type': 'application/json' 
});
// ...
constructor(private http: HttpClient) {}
```

## Ajouter les propriétés

```typescript
private securityToken = new Subject<TokenInterface>();
```

## Ajouter les méthodes

### La méthode `handleError`

La méthode `handleError` permet de gérer les erreurs HTTP au niveau du service.

```typescript
private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, `);
  }
  return throwError(
    'Something bad happened; please try again later.');
};
```

### La méthode `register`

```typescript
register(user: RegisterInterface): Observable<HttpResponse<RegisterInterface>>  {
  return this.http.post<RegisterInterface>(
    'http://127.0.0.1:8000/api/register', user, { headers: Headers, observe: 'response' }
  ).pipe(
    catchError(this.handleError)
  );
}
```

### La méthode `login`

```typescript
```

### La méthode `forgottenPassword`

```typescript
```

### La méthode `resetPassword`

```typescript
```

### La méthode `renewPassword`

```typescript
```

### La méthode `setSecurityToken`

```typescript
setSecurityToken(token: TokenInterface) {
  this.securityToken.next( token );
}
```

### La méthode `getSecurityToken`

```typescript
getSecurityToken(): Observable<TokenInterface> {
  return this.securityToken;
}
```



# Création des composants

## Le composant `user`

Le composant `user` permet de gérer l'affichage du profile.

### Création du composant

```bash
ng generate component modules/security/components/user
```

### Importer le composant dans le module `security`

```typescript
import { UserComponent } from './components/user/user.component';
// ...
@NgModule({
  declarations: [
    UserComponent
  ],
})
```

### Importation des dépendances du composant

### Modifier le HTML du composant

### Modifier le composant



## Le composant `user-nav`

Le composant `user-nav` permet de gérer le menu utilisateur.

### Création du composant

```bash
ng generate component modules/security/components/user-nav
```

### Importer le composant dans le module principal de l'application

Importer le composant dans le fichier `app/app.component.ts` 

```typescript
import { UserNavComponent } from './modules/security/components/user-nav/user-nav.component';
// ...
@NgModule({
  declarations: [
    UserNavComponent
  ],
})
```

### Importation des dépendances du composant

### Modifier le HTML du composant

```html
<nav>
  <a [routerLink]="['/']">Homepage</a> - 
  <a [routerLink]="['register']">Register</a> - 
  <a [routerLink]="['login']">login</a>
</nav>
```

### Modifier le composant

#### Modifier le sélecteur

```typescript
@Component({
  selector: 'app-user-nav',
})
```

#### Modifier la classe


### Ajouter le menu utilisateur à l'application

Dans le fichier `app/app.component.html` par exemple, ajouter :

```html
<app-user-nav></app-user-nav>
```



## Le composant `forgotten-password`

Le composant `forgotten-password` permet de gérer le renouvellement d'un mot de passe.

### Création du composant

```bash
ng generate component modules/security/components/forgotten-password
```

### Importer le composant dans le module `security`

```typescript
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
// ...
@NgModule({
  declarations: [
    ForgottenPasswordComponent
  ],
})
```

### Importation des dépendances du composant

### Modifier le HTML du composant

### Modifier le composant



## Le composant `reset-password`

Le composant `reset-password` permet de gérer la demande de mot de passe perdu d'un utilisateur.

### Création du composant

```bash
ng generate component modules/security/components/reset-password
```

### Importer le composant dans le module `security`

```typescript
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
// ...
@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
})
```

### Importation des dépendances du composant

### Modifier le HTML du composant

### Modifier le composant



## Le composant `renew-password`

Le composant `renew-password` permet de gérer le renouvellement d'un mot de passe.

### Création du composant

```bash
ng generate component modules/security/components/renew-password
```

### Importer le composant dans le module `security`

```typescript
import { RenewPasswordComponent } from './components/renew-password/renew-password.component';
// ...
@NgModule({
  declarations: [
    RenewPasswordComponent
  ],
})
```

### Importation des dépendances du composant

### Modifier le HTML du composant

### Modifier le composant







# Synthèse des commandes

```bash
ng generate module modules/security --module=app
ng generate guard modules/security/guards/auth

ng generate component modules/security/components/user
ng generate component modules/security/components/register
ng generate component modules/security/components/login
ng generate component modules/security/components/forgotten-password
ng generate component modules/security/components/renew-password
```