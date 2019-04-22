/**
 * Import des dépendances Angular
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

/**
 * Import des dépendances du module
 */
import { AuthenticationService } from './../../services/authentication.service';
import { RenewPasswordInterface } from './../../interfaces/renew-password';

@Component({
  templateUrl: './renew-password.component.html',
})
export class RenewPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
