/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"

/**
 * Import des dépendances local du module
 */
import { BooksService } from './../../services/books.service';
import { BookInterface } from './../../interfaces/books';
import { Book } from './../../classes/books';
import { BooksFormService } from './../../services/books-form.service';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  isLoading: boolean = true;
  isSubmitted: boolean = false;
  isSubmission: boolean = false;
  error: string = null;

  book: BookInterface = this.bookForm.book;
  bookID: number;

  constructor(
    private booksService: BooksService,
    private bookForm: BooksFormService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Récupération de la valeur du paramètre ID transmit par l'url
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
    else {
      this.isSubmission = false;
    }
  }

  get diagnostic() { return JSON.stringify(this.book); }

}
