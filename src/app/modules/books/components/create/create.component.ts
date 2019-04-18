/**
 * Import des dépendances Angular
 */
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router"

/**
 * Import des dépendances local du module
 */
import { BookInterface } from './../../interfaces/books';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent {

  isSubmitted: boolean = false;
  isSubmission: boolean = false;

  book: BookInterface = {
    title: null,
    description: null,
    price: null
  };
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit({value, valid}): void {

    this.isSubmitted = true; 
    this.isSubmission = true;

    // Le formulaire est valide
    if (valid) {
      // console.log('Send form');

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let httpOptions = { headers: headers };

      this.http.post<BookInterface>('http://127.0.0.1:8000/api/books.json', this.book, httpOptions).subscribe(
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

    // console.log( value, valid );
    // console.log( JSON.stringify(this.book) );
  }

  get diagnostic() { return JSON.stringify(this.book); }

}
