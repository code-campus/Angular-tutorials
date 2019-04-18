/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Import des dépendances local du module
 */
import { BookInterface, BooksInterface } from './../interfaces/books';

const Headers = new HttpHeaders({
  'Content-Type': 'application/json' 
});

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, `);
        //  +
        // `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  private url(id: number = null): string {
    let endpoint = 'http://127.0.0.1:8000/api/books';
    if (id != null) endpoint+= '/'+id;

    return endpoint+'.json';
  };

  getBooks(): Observable<HttpResponse<BooksInterface>> {
    return this.http.get<BooksInterface>(
      this.url(), { observe: 'response' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getBook(id: number): Observable<HttpResponse<BookInterface>> {
    return this.http.get<BookInterface>(
      this.url(id), { observe: 'response' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  createBook(book: BookInterface): Observable<HttpResponse<BookInterface>> {
    return this.http.post<BookInterface>(
      this.url(), book, { headers: Headers, observe: 'response' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  editBook(id: number, book: BookInterface): Observable<HttpResponse<BookInterface>> {
    return this.http.put<BookInterface>(
      this.url(id), book, { headers: Headers, observe: 'response' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number) {
    return this.http.delete(
      this.url(id)
    ).pipe(
      catchError(this.handleError)
    );
  }
}
