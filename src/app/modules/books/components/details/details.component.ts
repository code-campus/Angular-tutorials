/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/**
 * Import des dépendances local du module
 */
import { BookInterface } from './../../interfaces/books';

@Component({
  // selector: 'book-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {

  // Etat du chargement des données
  // Par défaut : en chragement
  isLoading: boolean = true;

  inDeletion: boolean = false;

  // La propriété `book` est typé avec l'interface `BookInterface`
  book: BookInterface;
  // On lui affecte les propriété par défaut
  // book: BookInterface = {
  //   id: null,
  //   title: null,
  //   description: null,
  //   price: null
  // };

  bookID: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Récupération de la valeur du paramètre ID transmit par l'url
    this.bookID = parseInt(this.route.snapshot.paramMap.get('id'));

    // Interrogation du serveur
    this.http.get<BookInterface>('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json').subscribe(data => {
      console.log(data);
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
          console.log(data);          
          // this.isLoading = false;
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
