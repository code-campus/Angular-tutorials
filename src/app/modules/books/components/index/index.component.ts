/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Import des dépendances local du module
 */
import { BooksInterface } from './../../interfaces/books';

@Component({
  // selector: 'book-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  // Etat du chargement des données
  // Par défaut : en chragement
  isLoading: boolean = true;

  // Propriété `books` typé comme un tableau de livres
  // prete à recevoir la liste des livres
  books: BooksInterface;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.http.get<BooksInterface>('http://jsonplaceholder.typicode.com/posts').subscribe(data => {
    this.http.get<BooksInterface>('http://127.0.0.1:8000/api/books.json').subscribe(data => {
      console.log(data);
      this.books = data;
      this.isLoading = false;
    });
  }

}
