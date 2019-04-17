# Création d'un projet Angular
> ### Objectifs :
> Savoir créer un formulaire à partir d'un model




# Création d'un nouveau projet

```bash
ng new my-project --style=less --routing=false
cd my-project
```




# Démarrer le Serveur de développement

```bash
ng serve
```




# Importer les modules dans l'application

Importer les modules `FormsModule` et `HttpClient` dans le fichier `app/app.module.ts`

```typescript
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// ...
@NgModule({
  imports: [
    // ...
    FormsModule,
    HttpClientModule
  ],
})
```




# Création du model

## Générer la classe

```bash
ng generate class classes/Book
```

## Ajouter les propriétés

### Classe de base

```typescript
export class Book {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public description?: string
  ) {}
}
```

Le point d'interrogation de la propriété `description` permet de rendre la propriété facultative.

### Classe combinée avec une Interface

```typescript
export interface BookInterface {
  id: number;
  title: string;
  description?: string;
  price: number;
}

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



# Création du composant

## Générer le composant

```bash
ng generate component components/BookForm --module=app
```

## Ajouter les propriétés et fonctions au composant

### Importer la classe `Book`

Importe la classe `Book` et l'interface `BookInterface`

```typescript
import { Book, BookInterface } from './../../classes/book';
```

### Définition du model

#### Création d'un model vierge

Créer la propriété `model` basée sur l'interface `BookInterface`.

```typescript
model: BookInterface = {
  id: null,
  title: null,
  description: null,
  price: null
};
```

#### Création d'un model à partir de données

Créer la propriété `model` en lui affectant une nouvelle instance de la classe `Book`.

```typescript
model = new Book(42, 'Le guide du voyageur intergalactique', 9.99, 'Ce livre est la réponse à la grande question.');
```

### Ajout de l'écouteur d'évènement `submit`

Ajouter la directive `ngSubmit` au formulaire HTML.

```html
<form #bookForm="ngForm" (ngSubmit)="onSubmit( bookForm )">...</form>
```

Ajouter la méthode `onSubmit()` au composant `book-form.components.ts`.

```typescript
onSubmit({value, valid}): void { ... }
```

### Ajouter une fonction de débug

La fonction `diagnostic` permet de visualisé le model

```typescript
get diagnostic() { return JSON.stringify(this.model); }
```

## Ajouter le composant à l'application

```typescript
import { BookFormComponent } from './components/book-form/book-form.component';
// ...
@NgModule({
  declarations: [
    // ...
    BookFormComponent
  ],
})
```

## Ajouter le selecteur dans la vue

Le sélecteur de notre nouveau composant est `app-book-form` (c.f. `app/components/book-form/book-form.component.ts`).

Modifier le fichier `app/app.component.html` pour ajouter le sélecteur du formulaire.

```html
<app-book-form></app-book-form>
```

## Créer le formulaire HTML

Ouvrir le fichier `app/components/book-form/book-form.component.html` et ajouter le code :

```html
<div class="container">
  <h1>Book Form</h1>

  <form #bookForm="ngForm" (ngSubmit)="onSubmit( bookForm )">

    <div class="form-group">

      <label for="title">Title</label>
      
      <input 
        type="text" 
        id="title" 
        name="title"
        [(ngModel)]="model.title"
        #title="ngModel"
        class="form-control" 
        required
        #spyTitle>

      <div *ngIf="title.touched && title.invalid">Title is required</div>

    </div>

    

    <div class="form-group">
      <label for="description">Description</label>
      <textarea 
        id="description" 
        name="description" 
        [(ngModel)]="model.description"
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
        [(ngModel)]="model.price"
        step="0.01" 
        class="form-control"
        required>
    </div>

    <button type="submit" class="btn btn-success">Submit</button>
  </form>
  
  <pre>{{diagnostic}}</pre>
  <pre>{{ bookForm }}</pre>
  <pre>Is submitted : {{submitted}}</pre>
  <pre>Title : Classname="{{spyTitle.className}}"</pre>
  
</div>
```

- `#bookForm="ngForm"` Définit le nom du formulaire pour la directive `ngForm`.
- `(ngSubmit)="onSubmit( bookForm )"` la directive `ngSubmit` écoute l'envois du formulaire.

- `[(ngModel)]="model.title"` propriété `title`de l'objet `model``
- `#title="ngModel"` La directive `ngModel` permet de suivre l'objet `title` (e.g. `title.invalid`)
- `#spyTitle` est l'objet `ngModel` qui permet d'écouté les propriété d'un champ