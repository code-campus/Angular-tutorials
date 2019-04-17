import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import des modules
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// Import du composant BookForm
import { BookFormComponent } from './components/book-form/book-form.component';


@NgModule({
  declarations: [
    AppComponent,
    BookFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
