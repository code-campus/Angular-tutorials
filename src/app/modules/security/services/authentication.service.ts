/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

/**
 * Import des dépendances du module
 */
import { User } from './../interfaces/user';
import { RegisterInterface } from './../interfaces/register';
import { LoginInterface } from './../interfaces/login';
import { ForgottenPasswordInterface } from './../interfaces/forgotten-password';

const Headers = new HttpHeaders({
    'Content-Type': 'application/json' 
});

@Injectable({ 
    providedIn: 'root' 
})
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     * Register
     * 
     * @param user: RegisterInterface
     */
    register(user: RegisterInterface) {
        
        var url = environment.apiEndpoint + 'register';

        return this.http.post<any>(url, user, {headers: Headers})
            .pipe(map(
                response => {
                    return response;
                }));
    }

    /**
     * Login
     * 
     * Contact le serveur de l'API et tente d'identifier un utilisateur
     * 
     * @param user: LoginInterface
     */
    login(user: LoginInterface) {
        
        var url = environment.apiEndpoint + 'login';

        return this.http.post<any>(url, user, {headers: Headers})
            .pipe(map(
                user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }

                    return user;
                }));
    }

    /**
     * Logout
     * 
     * Efface du stockage locale, les données de l'utilisateur
     */
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    /**
     * Forgotten Password
     * 
     * @param user 
     */
    forgottenPassword(user: ForgottenPasswordInterface) {
        
        var url = environment.apiEndpoint + 'forgotten-password';

        return this.http.post<any>(url, user, {headers: Headers})
            .pipe(map(
                response => {
                    return response;
                }));

    }

    // TODO: Ajout de la méthode `renewPassword`
}