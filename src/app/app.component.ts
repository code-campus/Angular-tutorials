import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface UserResponse {
  login: string;
  bio: string;
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
    // this.http.get('https://api.github.com/users/OSW3-Campus').subscribe(data => {
    //   console.log(data);
    // });

    // Une réponse typée
    // this.http.get<UserResponse>('https://api.github.com/users/OSW3-Campus').subscribe(data => {
    //   console.log(data.login);
    // });

    // Gestion des erreurs
    this.http.get<UserResponse>('https://api.github.com/users/OSW3---Campus').subscribe(
      data => {
        console.log("User Login: " + data.login);
        console.log("Bio: " + data.bio);
        console.log("Company: " + data.company);
      },
      // err => {
      //   console.log("Une erreur s'est produite.");
      // }
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    );

  }

}
