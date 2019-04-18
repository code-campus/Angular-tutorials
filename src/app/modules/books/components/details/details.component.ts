/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Import des dépendances local du module
 */
import { BooksService } from './../../services/books.service';
import { BookInterface } from './../../interfaces/books';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
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
