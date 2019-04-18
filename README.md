# C.R.U.D. en Web Services (modules + components + services)
> ### Objectifs :
> Savoir manipuler les données sur un serveur via un Web Services
> ### Notes :
> Ce cours est la suite du cours [Symfony : C.R.U.D. en Web Services](https://github.com/OSW3-Campus/Symfony4-tutorials/tree/crud-webservice)




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




# Création des composants

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

- Le module de requêtes HTTP `@angular/common/http`
- L'interface `BooksInterface`

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BooksInterface } from './../../interfaces/books';

// ...
constructor(private http: HttpClient) { }
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
  books: BooksInterface;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<BooksInterface>('http://jsonplaceholder.typicode.com/posts').subscribe(data => {
      this.books = data;
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
- Le module de gestion du routage `@angular/router`
- L'interface `BookInterface`

```typescript
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router"

import { BookInterface } from './../../interfaces/books';
// ...
constructor(
  private http: HttpClient,
  private router: Router
) {}
```


### Modifier le HTML du composant

```html
<h2>Create Book</h2>

<form #bookForm="ngForm" (ngSubmit)="onSubmit( bookForm )">

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

</form>
```


### Modifier le composant

```typescript
export class CreateComponent {

  isSubmitted = false;
  isSubmission = false;

  // Note : on ne met pas la propriété ID
  book: BookInterface = {
    title: null,
    description: null,
    price: null
  };
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let httpOptions = { headers: headers };

      this.http.post<BookInterface>('http://127.0.0.1:8000/api/books.json', this.book, httpOptions).subscribe(data => {
        this.router.navigate(['/book', data.id]);
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

- Le module de requêtes HTTP `@angular/common/http`
- Le module de gestion du routage `@angular/router`
- L'interface `BookInterface`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BooksInterface } from './../../interfaces/books';

// ...
constructor(
  private http: HttpClient,
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
  book: BookInterface;
  bookID: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookID = parseInt(this.route.snapshot.paramMap.get('id'));
    
    this.http.get<BookInterface>('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json').subscribe(data => {
      this.book = data;
      this.isLoading = false;
    });
  }

  onDelete(): void {
    this.inDeletion = true;
    if (confirm('Delete book id : '+ this.bookID)) {

      // Suppression du livre
      this.http.delete('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json').subscribe(
        data => {
          this.router.navigate(['/books']);
        },
        err => {
          this.inDeletion = false;
        }
      );

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

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router"

import { BookInterface } from './../../interfaces/books';
import { Book } from './../../classes/books';
// ...
constructor(
    private http: HttpClient,
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
  
  </form>
</ng-template>
```


### Modifier le composant

```typescript
export class EditComponent implements OnInit {

  isLoading: boolean = true;
  isSubmitted: boolean = false;
  isSubmission: boolean = false;

  book: BookInterface;
  bookID: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.bookID = parseInt(this.route.snapshot.paramMap.get('id'));

    // Interrogation du serveur
    this.http.get<BookInterface>('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json').subscribe(data => {
      this.book = new Book(
        data.id,
        data.title,
        data.price,
        data.description
      );
      this.isLoading = false;
    });
  }

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let httpOptions = { headers: headers };

      this.http.put<BookInterface>('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json', this.book, httpOptions).subscribe(
        data => {
          console.log(data);
          console.log(data.id);

          // Redirection vers la page de détails du livre
          this.router.navigate(['/book', data.id]);
          this.isSubmission = false;
        },
        err => {
          this.isSubmission = false;
        }
      );
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
ng generate component modules/books/components/index
ng generate component modules/books/components/create
ng generate component modules/books/components/details
ng generate component modules/books/components/edit

ng serve
```