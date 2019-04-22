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
import { RegisterInterface } from './../../interfaces/register';

@Component({
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  user: RegisterInterface;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  // TODO: Email format validator
  // TODO: Password format validator
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required], 
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.user = {
      firstname: this.f.firstname.value,
      lastname: this.f.lastname.value,
      email: this.f.email.value,
      password: this.f.password.value,
    };

    this.authenticationService.register(this.user)
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
  get f() { return this.registerForm.controls; }
}
