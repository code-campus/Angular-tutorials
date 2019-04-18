/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';


/**
 * Import des dépendances local du module
 */
import { BooksService } from './../../services/books.service';
import { BooksInterface } from './../../interfaces/books';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  
  isLoading: boolean = true;
  error: string = null;

  books: BooksInterface;

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.booksService.getBooks().subscribe(
      resp => this.books = resp.body,
      err => this.error = err
    ).add(() => {
      this.isLoading = false;
    });
  }

}
