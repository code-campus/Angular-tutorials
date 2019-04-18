/**
 * Import des dépendances Angular
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/**
 * Import des composants du module
 */
import { IndexComponent } from './components/index/index.component';
import { CreateComponent } from './components/create/create.component';
import { DetailsComponent } from './components/details/details.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  // Books Index
  { 
    path: 'books', // e.g. http://site.com/books
    component: IndexComponent 
  },
  // Book C.R.U.D.
  { 
    path: 'book', // e.g. http://site.com/book/
    children: [
      // Book add
      { 
        path: 'create', // e.g. http://site.com/book/create
        component: CreateComponent 
      },
      // Book details
      { 
        path: ':id', 
        children: [
          // Book details
          { 
            path: '', // e.g. http://site.com/book/{id}
            component: DetailsComponent 
          },
          { 
            path: 'edit', // e.g. http://site.com/book/{id}/edit
            component: EditComponent 
          },
          // { 
          //   path: 'delete', // e.g. http://site.com/book/{id}/delete
          //   component: DeleteComponent 
          // }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    DetailsComponent,
    EditComponent,
    // DeleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class BooksModule { }
