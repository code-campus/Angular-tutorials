/**
 * Import des dépendances Angular
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';

/**
 * Import des dépendances du module
 */
import { User } from './../interfaces/user';

@Injectable({ 
    providedIn: 'root' 
})
export class UserService {

    constructor(
        private http: HttpClient
    ) {}

    getAll() {
        return this.http.get<User[]>( environment.apiEndpoint + 'users' );        
    }

    // TODO: Ajout des méthode de modif du profile
}