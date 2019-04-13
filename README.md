# Web Services REST
> ### Objectifs :
> Savoir interoger un serveur distant et afficher les données retournées
> ### Note :
> Les exemples utilisent la Fake API de http://jsonplaceholder.typicode.com/




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



# Récupérer des données

Créer une requête HTTP dans le fichier `app/app.component.ts`


## Interrogation de l'API

```typescript
export class BooksComponent implements OnInit {
  title = 'my-project';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
    this.http.get('http://jsonplaceholder.typicode.com/users/2').subscribe(data => {
      console.log(data);
    });
  
  }

}
``` 


## Une réponse typée

Lorsqu'on essaye d'accèder à la propriété `username`, on obtient l'erreur : " Property 'username' does not exist on type 'Object'."

```javascript
console.log(data.username);
```

### Création d'une `interface`

Créer l'interface `UserResponse` avant le décorateur `@Component`

```typescript
interface UserResponse {
  username: string;
  email: string;
  company: string;
}
```

### Typer la requête HTTP

Utiliser l'interface lors de la requête HTTP.

```typescript
this.http.get<UserResponse>('http://jsonplaceholder.typicode.com/users/2').subscribe(data => {
  console.log(data.username);
});
```


## Gestion des erreurs

### Capturer l'erreur

Capturer une erreur pour executer une alternative

```typescript
this.http.get<UserResponse>('http://jsonplaceholder.typicode.com/users/42').subscribe(
  data => {
    console.log("Username: " + data.username);
    console.log("Email: " + data.email);
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
this.http.get<UserResponse>('http://jsonplaceholder.typicode.com/users/42').subscribe(
  data => {
    console.log("Username: " + data.username);
    console.log("Email: " + data.email);
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



# Envoyer des données

```typescript
this.http.post('http://jsonplaceholder.typicode.com/posts', {
  title: 'foo',
  body: 'bar',
  userId: 1
})
.subscribe(
  res => {
    console.log(res);
  },
  err => {
    console.log("Error occured");
  }
);
```