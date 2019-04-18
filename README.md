# C.R.U.D. en Web Services (avancé)
> ### Objectifs :
> Savoir manipuler les données sur un serveur via un Web Services
> ### Notes :
> Ce cours est la suite du cours [Symfony : C.R.U.D. en Web Services](https://github.com/OSW3-Campus/Symfony4-tutorials/tree/crud-webservice)  
> Ce cours reprend le cours [C.R.U.D. en Web Services](https://github.com/OSW3-Campus/Angular-tutorials/tree/crud-web-services) et optimise le module avec l'ajout du service `BookService` qui gère les requêtes HTTP.




# Création d'un nouveau projet


```bash
ng new my-project --style=less --routing
cd my-project
```




# Démarrer le Serveur de développement

```bash
ng serve
```




# Création du module

Le module va contenir tous les scripts de notre "univers" `book`


## Création du module

```bash
ng generate module modules/books --module=app
```

L'option `--module=app` permet d'importer le module `book` au module principal `app/app.module.ts`.


## Importation des dépendances du module

Importer les dépendances du module dans le fichier pricinpale du module `book.module.ts`.

- Le module de gestion du routage `@angular/router`
- Le module de requêtes HTTP `@angular/common/http`
- Le module de gestion des formulaires `@angular/forms`

```typescript
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// ...
@NgModule({
  imports: [
    // ...
    HttpClientModule,
    RouterModule.forChild(routes) 
  ]
})
```


## Définition du routage

Définir la table de routage du module dans le fichier principale du module `book.module.ts`.

Les routes à définir sont :
- `http://site.com/books` : Liste des livres
- `http://site.com/book/create` : Ajouter un livre
- `http://site.com/book/{id}` : Détails d'un livre
- `http://site.com/book/{id}/edit` : Modifier un livre
- `http://site.com/book/{id}/delete` : Supprimer un livre

```typescript
const routes: Routes = [
  // Books Index
  { 
    path: 'books',
    component: IndexComponent 
  },
  // Book C.R.U.D.
  { 
    path: 'book',
    children: [
      // Add a Book
      { 
        path: 'create',
        component: CreateComponent 
      },
      { 
        path: ':id', 
        children: [
          // Book details
          { 
            path: '',
            component: DetailsComponent 
          },
          // Update a Book
          { 
            path: 'edit',
            component: EditComponent 
          },
          // Delete a Book
          { 
            path: 'delete',
            component: DeleteComponent 
          }
        ]
      }
    ]
  }
];
```

> **/!\ Attention** : tant que les composants `IndexComponent`, `CreateComponent`, `DetailsComponent`, `UpdateComponent` et `DeleteComponent` ne  sont pas créer, Angular retournera une erreur


## Ajouter les éléments de navigation

Dans le fichier `app.component.html` - par exemple - ajouter le bloc de navigation du module.

```html
<nav>
  <a [routerLink]="['/']">Homepage</a> - 
  <a [routerLink]="['books']">Books index</a> - 
  <a [routerLink]="['book/create']">Create book</a>
</nav>
```




# Création des classes et interfaces

## Création des interfaces

### Création du fichier

```bash
ng generate interface modules/books/interfaces/Books
```

### Ajouter les interfaces et propriétés

```typescript
export interface BookInterface {
    id?: number;
    title: string;
    description?: string;
    price: number;
}

export interface BooksInterface {
    data: Array<BookInterface>;
}
```

## Création de la classe

### Création du fichier

```bash
ng generate interface modules/books/classes/Books
```

### Import des interfaces

```typescript
import { BookInterface } from './../interfaces/books';
```

### Ajouter les propriétés et méthodes

```typescript
export class Book implements BookInterface {
  constructor (
    public id: number,
    public title: string,
    public price: number,
    public description?: string
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
  }
}
```




# Création du service

Le service va permettre le passge d'information entre les composants du module.

## Création du service

```bash
ng generate service modules/books/services/books
```


## Importer les dépendances du service

Importer les dépendances du service dans le fichier du composant `app/modules/books/services/book.service.ts`.

- Le module de requêtes HTTP `@angular/common/http`
- Le module `rxjs`
- Le module `rxjs/operators`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BookInterface, BooksInterface } from './../interfaces/books';
// ...
const Headers = new HttpHeaders({
  'Content-Type': 'application/json' 
});
// ...
constructor(private http: HttpClient) {}
```


## Ajouter les méthodes

### La méthode `handleError`

La méthode `handleError` permet de gérer les erreur HTTP au niveau du service.

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

### La méthode `url`

La méthode `url` permet de construire dynamiquement l'url de la requête HTTP.

```typescript
private url(id: number = null): string {
  let endpoint = 'http://127.0.0.1:8000/api/books';
  if (id != null) endpoint+= '/'+id;
  return endpoint+'.json';
};
```

### La méthode `getBooks`

La méthode `getBooks` permet de récupérer la liste des livres.

```typescript
getBooks(): Observable<HttpResponse<BooksInterface>> {
  return this.http.get<BooksInterface>(
    this.url(), { observe: 'response' }
  ).pipe(
    catchError(this.handleError)
  );
}
```

### La méthode `getBook`

La méthode `getBook` permet de récupérer les information d'un livre.  
Cette méthode prend l'ID du livre en entré.

```typescript
getBook(id: number): Observable<HttpResponse<BookInterface>> {
  return this.http.get<BookInterface>(
    this.url(id), { observe: 'response' }
  ).pipe(
    catchError(this.handleError)
  );
}
```

### La méthode `deleteBook`

La méthode `deleteBook` permet de supprimer les information d'un livre.  
Cette méthode prend l'ID du livre en entré.

```typescript
deleteBook(id: number) {
  return this.http.delete(
    this.url(id)
  ).pipe(
    catchError(this.handleError)
  );
}
```




# Création des composants

## Le service `form`

Le service va permettre de partager la propriété `book: BookInterface` entre le composant `form`et les composants `create` et `edit`.

### Création du service

```bash
ng generate service modules/books/services/BooksForm
```


### Importer les dépendances du service

Importer les dépendances du service dans le fichier du composant `app/modules/books/services/books-form.service.ts`.

- L'interface `BookInterface`

```typescript
import { Injectable } from '@angular/core';
import { BookInterface } from './../interfaces/books';
```


### Ajouter les propriétés

```typescript
export class BooksFormService {
  book: BookInterface = {
    title: null,
    description: null,
    price: null
  };
}
```

## Le composant `form`

Le composant `form` est dédié à l'affichage de la liste des livres.

### Créer le composant

```bash
ng generate component modules/books/components/form
```

### Importer le composant dans le module `book`

Angular importe automatiquement le composant dans le module `books.module.ts`.

Vérifier l'importation et la déclaration

```typescript
import { FormComponent } from './components/form/form.component';
// ...
@NgModule({
  declarations: [
    FormComponent
  ],
})
```


### Importation des dépendances du composant

Importer les dépendances du composant dans le fichier du composant `index.component.ts`.

- Le service `BooksFormService`
- L'interface `BookInterface`

```typescript
import { Component, Input } from '@angular/core';
import { BookInterface } from './../../interfaces/books';
import { BooksFormService } from './../../services/books-form.service';
// ...
constructor(private bookForm: BooksFormService) { }
```


### Modifier le HTML du composant

Créer la partie interne du formulaire (les champs).  
La directive `ngModel` est fournie par le propriété `@Input book`

```html
<div class="form-group">
  <label for="title">Title *</label>
  <input 
    type="text" 
    id="title" 
    name="title"
    [(ngModel)]="book.title"
    #title="ngModel"
    class="form-control" 
    required>
    <div class="helper" *ngIf="isSubmitted && title.invalid">Title is required</div>
</div>

<div class="form-group">
  <label for="description">Description</label>
  <textarea 
    id="description" 
    name="description" 
    [(ngModel)]="book.description"
    #description="ngModel"
    class="form-control"
    cols="30" 
    rows="10"></textarea>
</div>

<div class="form-group">
  <label for="price">Price</label>
  <input 
    type="number" 
    id="price"
    name="price" 
    [(ngModel)]="book.price"
    #price="ngModel"
    step="0.01" 
    class="form-control"
    required>
    <div class="helper" *ngIf="isSubmitted && price.invalid">Price is required</div>
</div>

<button 
  type="submit" 
  class="btn btn-success"
  [disabled]="isSubmission">Submit</button>
```


### Modifier le composant

#### Modifier le sélecteur

```typescript
@Component({
  selector: 'book-form',
})
```

#### Modifier la classe

Ajouter la requête dans la classe IndexComponent

```typescript
export class FormComponent {
  
  // On transmet le model `book`au formulaire HTML
  @Input() book: BookInterface = this.bookForm.book;

  constructor(
    private bookForm: BooksFormService
  ) {}
}
```



## Le composant `index`

Le composant `index` est dédié à l'affichage de la liste des livres.

### Créer le composant

```bash
ng generate component modules/books/components/index
```

### Importer le composant dans le module `book`

Angular importe automatiquement le composant dans le module `books.module.ts`.

Vérifier l'importation et la déclaration

```typescript
import { IndexComponent } from './components/index/index.component';
// ...
@NgModule({
  declarations: [
    IndexComponent
  ],
})
```


### Importation des dépendances du composant

Importer les dépendances du composant dans le fichier du composant `index.component.ts`.

- Le service `BooksService`
- L'interface `BooksInterface`

```typescript
import { Component, OnInit } from '@angular/core';
import { BooksService } from './../../services/books.service';
import { BooksInterface } from './../../interfaces/books';

// ...
constructor(private booksService: BooksService) { }
```


### Modifier le HTML du composant

Préparer la vue pour l'affichage de la liste des livres.

```html
<h2>Books list</h2>

<ng-container *ngIf="isLoading; then loading else loaded"></ng-container>

<ng-template #loading>
  loading...
</ng-template>

<ng-template #loaded>
  
  <div [hidden]="!error">{{ error }}</div>

  <ul>

    <li *ngFor="let book of books; let i = index">
      {{i}}
      <a [routerLink]="['/book', book.id]">{{book.title}}</a>
    </li>
    
  </ul>
</ng-template>
```

- `{{i}}` : Index de l'itération de la boucle
- `{{book.id}}` : Propriété **ID** de l'interface `BookInterface`
- `{{book.title}}` : Propriété **Title** de l'interface `BookInterface`
- `['/book', book.id]` : `/book` évite dobtenir le chemin `/books/book/42`


### Modifier le composant

Le sélecteur du composant est gérer par le module de routage, il n'est donc plus utile et peut être supprimer.

Si vous le conservez, je vous conseil de le renomer pour éviter toute ambiguité avec d'autres composants.

```typescript
@Component({
  selector: 'book-index',
})
```

Ajouter la requête dans la classe IndexComponent

```typescript
export class IndexComponent implements OnInit {

  isLoading: boolean = true;
  error: string = null;
  books: BooksInterface;

  constructor(private booksService: BooksService) { }

  ngOnInit() {
    this.booksService.getBooks().subscribe(
      resp => this.books = resp.body,
      err => this.error = err
    ).add(() => {
      this.isLoading = false;
    });
  }

}
```



## Le composant `create`

Le composant `create` est dédié à la création d'un k-livre.

### Créer le composant

```bash
ng generate component modules/books/components/create
```

### Importer le composant dans le module `book`

Angular importe automatiquement le composant dans le module `books.module.ts`.

Vérifier l'importation et la déclaration

```typescript
import { CreateComponent } from './components/create/create.component';
// ...
@NgModule({
  declarations: [
    CreateComponent
  ],
})
```


### Importation des dépendances du composant

Importer les dépendances du composant dans le fichier du composant `create.component.ts`.

- Le module de requêtes HTTP `@angular/common/http`
- Le service `BookService`
- Le service `BooksFormService`
- L'interface `BookInterface`

```typescript
import { Component } from '@angular/core';
import { Router } from "@angular/router"

import { BooksService } from './../../services/books.service';
import { BookInterface } from './../../interfaces/books';
import { BooksFormService } from './../../services/books-form.service';

// ...
constructor(
  private booksService: BooksService,
  private bookForm: BooksFormService,
  private router: Router
) {}
```


### Modifier le HTML du composant

```html
<h2>Create Book</h2>

<form #bookForm="ngForm" (ngSubmit)="onSubmit( bookForm )">
  <div [hidden]="!error">{{ error }}</div>
  <book-form></book-form>
</form>
```


### Modifier le composant

```typescript
export class CreateComponent {

  isSubmitted = false;
  isSubmission = false;
  error: string = null;

  // book: BookInterface = {
  //   title: null,
  //   description: null,
  //   price: null
  // };
  book: BookInterface = this.bookForm.book;
  
  constructor(
    private booksService: BooksService,
    private bookForm: BooksFormService,
    private router: Router
  ) {}

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      this.booksService.createBook( this.book ).subscribe(
        resp => this.router.navigate(['/book', resp.body.id]),
        err => this.error = err
      ).add(() => {
        this.isSubmission = false;
      });
    } 
    
    // Le formulaire contient des erreurs
    else {
      this.isSubmission = false;
    }
  }
}
```



## Le composant `details`

Le composant `details` est dédié à l'affichage des données d'un.

### Créer le composant

```bash
ng generate component modules/books/components/details
```

### Importer le composant dans le module `book`

Angular importe automatiquement le composant dans le module `books.module.ts`.

Vérifier l'importation et la déclaration

```typescript
import { DetailsComponent } from './components/details/details.component';
// ...
@NgModule({
  declarations: [
    DetailsComponent
  ],
})
```


### Importation des dépendances du composant

Importer les dépendances du composant dans le fichier du composant `details.component.ts`.

- Le module de gestion du routage `@angular/router`
- Le service `BooksService`
- L'interface `BookInterface`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from './../../services/books.service';
import { BooksInterface } from './../../interfaces/books';

// ...
constructor(
  private booksService: BooksService,
  private route: ActivatedRoute,
  private router: Router
) {}
```


### Modifier le HTML du composant

Préparer la vue pour l'affichage des données d'un livre.

```html
<h2>Book Details</h2>

<ng-container *ngIf="isLoading; then loading else loaded"></ng-container>

<ng-template #loading>
  loading...
</ng-template>

<ng-template #loaded>
  <div [hidden]="!error">{{ error }}</div>

  <ul>
    <li>Id: {{ book.id }}</li>
    <li>Title: {{ book.title }}</li>
    <li>Description: {{ book.description }}</li>
    <li>Price: {{ book.price }}</li>
  </ul>

  <a [routerLink]="['/book', book.id, 'edit']">Edit</a> - 
  <button 
    type="button" 
    [disabled]="inDeletion"
    (click)="onDelete();">Delete</button>
</ng-template>
```


### Modifier le composant

```typescript
export class DetailsComponent implements OnInit {

  isLoading: boolean = true;
  inDeletion: boolean = false;
  error: string = null;

  book: BookInterface;
  bookID: number;

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Récupération de la valeur du paramètre ID transmit par l'url
    this.bookID = parseInt(this.route.snapshot.paramMap.get('id'));

    // Interrogation du serveur
    this.booksService.getBook( this.bookID ).subscribe(
      resp => this.book = resp.body,
      err => this.error = err
    ).add(() => {
      this.isLoading = false;
    });
  }

  onDelete(): void {
    this.inDeletion = true;

    if (confirm('Delete book id : '+ this.bookID)) {

      // Suppression du livre
      this.booksService.deleteBook( this.bookID ).subscribe(
        resp => this.router.navigate(['/books']),
        err => this.error = err
      ).add(() => {
        this.inDeletion = false;
      });

    }
    else {
      this.inDeletion = false;
    }
  }
}
```



## Le composant `edit`

Le composant `edit` est dédié à la modification d'un livre.

### Créer le composant

```bash
ng generate component modules/books/components/edit
```

### Importer le composant dans le module `book`

Angular importe automatiquement le composant dans le module `books.module.ts`.

Vérifier l'importation et la déclaration

```typescript
import { EditComponent } from './components/edit/edit.component';
// ...
@NgModule({
  declarations: [
    EditComponent
  ],
})
```


### Importation des dépendances du composant

Importer les dépendances du composant dans le fichier du composant `create.component.ts`.

- Le module de requêtes HTTP `@angular/common/http`
- Le module de gestion du routage `@angular/router`
- L'interface `BookInterface`
- La classe `Book`
- Le service `BooksService`
- Le service `BooksFormService`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"

import { BooksService } from './../../services/books.service';
import { BookInterface } from './../../interfaces/books';
import { Book } from './../../classes/books';
import { BooksFormService } from './../../services/books-form.service';

// ...
constructor(
    private booksService: BooksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
```


### Modifier le HTML du composant

```html
<h2>Edit Book</h2>

<ng-container *ngIf="isLoading; then loading else loaded"></ng-container>

<ng-template #loading>
  loading...
</ng-template>

<ng-template #loaded>
  <form #bookForm="ngForm" (ngSubmit)="onSubmit( bookForm )">
  
    <div [hidden]="!error">{{ error }}</div>
    <book-form></book-form>
  
  </form>
</ng-template>
```


### Modifier le composant

```typescript
export class EditComponent implements OnInit {

  isLoading: boolean = true;
  isSubmitted: boolean = false;
  isSubmission: boolean = false;
  error: string = null;

  // book: BookInterface;
  book: BookInterface = this.bookForm.book;
  bookID: number;

  constructor(
    private booksService: BooksService,
    private bookForm: BooksFormService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.bookID = parseInt(this.route.snapshot.paramMap.get('id'));

    // Interrogation du serveur
    this.booksService.getBook( this.bookID ).subscribe(
      resp => this.book = this.bookForm.book = new Book(
        resp.body.id,
        resp.body.title,
        resp.body.price,
        resp.body.description
      ),
      err => this.error = err
    ).add(() => {
      this.isLoading = false;
    });
  }

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      this.booksService.editBook( this.book.id, this.book ).subscribe(
        resp => this.router.navigate(['/book', resp.body.id]),
        err => this.error = err
      ).add(() => {
        this.isSubmission = false;
      });
    } 
    
    // Le formulaire contient des erreurs
    else {
      this.isSubmission = false;
    }
  }
}
```




# Synthèse des commandes

```bash
ng new my-project --style=less --routing
cd my-project

ng generate module modules/books --module=app
ng generate interface modules/books/interfaces/Books
ng generate interface modules/books/classes/Books
ng generate service modules/books/services/Books
ng generate service modules/books/services/BooksForm
ng generate component modules/books/components/index
ng generate component modules/books/components/create
ng generate component modules/books/components/details
ng generate component modules/books/components/edit

ng serve
```