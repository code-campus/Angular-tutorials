/**
 * Import des dépendances Angular
 */
import { Component, Input } from '@angular/core';

/**
 * Import des dépendances local du module
 */
import { BookInterface } from './../../interfaces/books';
import { BooksFormService } from './../../services/books-form.service';

@Component({
  selector: 'book-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent {
  
  // On transmet le model `book`au formulaire HTML
  @Input() book: BookInterface = this.bookForm.book;

  constructor(
    private bookForm: BooksFormService
  ) {}
}
