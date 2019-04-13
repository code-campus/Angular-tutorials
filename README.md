# Web Services REST
> ### Objectifs :
> Savoir interoger un serveur distant et afficher les données retournées




# Création d'un nouveau projet

```bash
ng new my-project --style=less --routing
cd my-project
```



# Démarrer le Serveur de développement

```bash
ng serve
```



# Importer le module `HttpClient` 

## Importer le module `HttpClient` dans le module principal

Dans le fichier `app/app.module.ts`

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    // ...
    HttpClientModule
  ],
})
```



## Importer le module `HttpClient` dans votre composant

Dans le fichier `app/app.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'my-project';

  constructor(private http: HttpClient) { }

  ngOnInit() {}

}
```



# Créer une requête HTTP

Dans le fichier `app/app.component.ts`


## Interrogation de l'API GitHub

```typescript
export class BooksComponent implements OnInit {
  title = 'my-project';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
    this.http.get('https://api.github.com/users/OSW3-Campus').subscribe(data => {
      console.log(data);
    });
  
  }

}
``` 


## Une réponse typée

Lorsqu'on essaye d'accèder à la propriété `login`, on obtient l'erreur : " Property 'login' does not exist on type 'Object'."

```javascript
console.log(data.login);
```

### Création d'une `interface`

Créer l'interface `UserResponse` avant le décorateur `@Component`

```typescript
interface UserResponse {
  login: string;
  bio: string;
  company: string;
}
```

### Typer la requête HTTP

Utiliser l'interface lors de la requête HTTP.

```typescript
this.http.get<UserResponse>('https://api.github.com/users/OSW3-Campus').subscribe(data => {
  console.log(data.login);
});
```


## Gestion des erreurs

### Capturer l'erreur

Capturer une erreur pour executer une alternative

```typescript
this.http.get<UserResponse>('https://api.github.com/users/OSW3---Campus').subscribe(
  data => {
    console.log("User Login: " + data.login);
    console.log("Bio: " + data.bio);
    console.log("Company: " + data.company);
  },
  err => {
    console.log("Une erreur s'est produite.");
  }
);
``` 

### Capturer le message d'erreur

Les message d'erreur sont de type `HttpErrorResponse`

```typescript
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// ...
this.http.get<UserResponse>('https://api.github.com/users/OSW3---Campus').subscribe(
  data => {
    console.log("User Login: " + data.login);
    console.log("Bio: " + data.bio);
    console.log("Company: " + data.company);
  },
  (err: HttpErrorResponse) => {
    if (err.error instanceof Error) {
      console.log("Client-side error occured.");
    } else {
      console.log("Server-side error occured.");
    }
  }
);
``` 