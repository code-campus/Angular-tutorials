import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface UserResponse {
  username: string;
  email: string;
  company: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'my-project';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
    // Interrogation de l'API GitHub
    // this.http.get('http://jsonplaceholder.typicode.com/users/2').subscribe(data => {
    //   console.log(data);
    // });

    // Une réponse typée
    // this.http.get<UserResponse>('http://jsonplaceholder.typicode.com/users/2').subscribe(data => {
    //   console.log(data.username);
    // });

    // Gestion des erreurs
    // this.http.get<UserResponse>('http://jsonplaceholder.typicode.com/users/42').subscribe(
    //   data => {
    //     console.log("Username: " + data.username);
    //     console.log("Email: " + data.email);
    //     console.log("Company: " + data.company);
    //   },
    //   // err => {
    //   //   console.log("Une erreur s'est produite.");
    //   // }
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       console.log("Client-side error occured.");
    //     } else {
    //       console.log("Server-side error occured.");
    //     }
    //   }
    // );

    // Envoyer des données
    this.http.post('http://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    );

  }

}
