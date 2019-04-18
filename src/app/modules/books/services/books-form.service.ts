/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';

/**
 * Import des dépendances local du module
 */
import { BookInterface } from './../interfaces/books';

@Injectable({
  providedIn: 'root'
})
export class BooksFormService {

  book: BookInterface = {
    title: null,
    description: null,
    price: null
  };

}
