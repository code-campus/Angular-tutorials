/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router"

/**
 * Import des dépendances local du module
 */
import { BookInterface } from './../../interfaces/books';
import { Book } from './../../classes/books';

@Component({
  // selector: 'book-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  // Etat du chargement des données
  // Par défaut : en chragement
  isLoading: boolean = true;

  isSubmitted: boolean = false;
  isSubmission: boolean = false;

  // La propriété `book` est typé avec l'interface `BookInterface`
  book: BookInterface;

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
      this.book = new Book(
        data.id,
        data.title,
        data.price,
        data.description
      );
      this.isLoading = false;
    });
    
  }

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      // console.log('Send form');

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let httpOptions = { headers: headers };

      this.http.put<BookInterface>('http://127.0.0.1:8000/api/books/'+ this.bookID +'.json', this.book, httpOptions).subscribe(
        data => {
          console.log(data);
          console.log(data.id);

          // Redirection vers la page de détails du livre
          this.router.navigate(['/book', data.id]);
          this.isSubmission = false;
        },
        err => {
          this.isSubmission = false;
        }
      );
    } 
    
    // Le formulaire contient des erreurs
    else {
      this.isSubmission = false;
    }
  }

  get diagnostic() { return JSON.stringify(this.book); }

}
