import { Component, OnInit } from '@angular/core';

import { Book, BookInterface } from './../../classes/book';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.less']
})
export class BookFormComponent implements OnInit {

  submitted = false;

  // Définition d'un Model pour le formulaire
  // Le model se base sur l'interface `BookInterface`
  model: BookInterface = {
    id: null,
    title: null,
    description: null,
    price: null
  };

  ngOnInit() {
    // Lorsque le composant est initialisé, on surcharge la propriété
    // model en se basant sur la classe `Book`.
    // On peut imaginer récupérer les données avec une requête HTTP GET
    this.model = new Book(42, 'Le guide du voyageur intergalactique', 9.99, 'Ce livre est la réponse à la grande question.');    
  }

  onSubmit({value, valid}): void {
    this.submitted = true; 

    if (valid) {
      console.log('Send form');
    } else {
      console.log('invalid form');
    }

    console.log( value, valid );
    console.log( JSON.stringify(this.model) );
  }

  get diagnostic() { return JSON.stringify(this.model); }

}
