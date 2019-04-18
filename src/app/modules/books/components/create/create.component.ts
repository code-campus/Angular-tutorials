/**
 * Import des dépendances Angular
 */
import { Component } from '@angular/core';
import { Router } from "@angular/router"

/**
 * Import des dépendances local du module
 */
import { BooksService } from './../../services/books.service';
import { BookInterface } from './../../interfaces/books';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent {

  isSubmitted: boolean = false;
  isSubmission: boolean = false;
  error: string = null;

  book: BookInterface = {
    title: null,
    description: null,
    price: null
  };
  
  constructor(
    private booksService: BooksService,
    private router: Router
  ) {}

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    if (valid) {

      this.booksService.createBook( this.book ).subscribe(
        resp => this.router.navigate(['/book', resp.body.id]),
        err => this.error = err
      ).add(() => {
        this.isSubmission = false;
      });

    } 
    else {
      this.isSubmission = false;
    }
  }

  get diagnostic() { return JSON.stringify(this.book); }

}
