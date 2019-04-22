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
import { ForgottenPasswordInterface } from './../../interfaces/forgotten-password';

@Component({
  templateUrl: './forgotten-password.component.html',
})
export class ForgottenPasswordComponent implements OnInit {

  forgottenPasswordForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  user: ForgottenPasswordInterface;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.forgottenPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgottenPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.user = {
      email: this.f.email.value
    };

    this.authenticationService.forgottenPassword(this.user)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([`/login`]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgottenPasswordForm.controls; }

}
