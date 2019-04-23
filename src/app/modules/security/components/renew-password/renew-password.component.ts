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

  renewPasswordForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  passwords: RenewPasswordInterface;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.renewPasswordForm = this.formBuilder.group({
      passwordOld: ['', Validators.required],
      passwordNew: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.renewPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.passwords = {
      passwordOld: this.f.passwordOld.value,
      passwordNew: this.f.passwordNew.value,
      passwordConfirmation: this.f.passwordConfirmation.value,
    };

    this.authenticationService.renewPassword(this.passwords)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/profile']);
          console.log(data);

          // this.loading = false;
          // this.submitted = false;
          // this.renewPasswordForm.reset();
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.renewPasswordForm.controls; }

}
