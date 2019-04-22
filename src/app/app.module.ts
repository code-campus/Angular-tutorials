import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/**
 * Module `security`
 */
import { SecurityModule } from './modules/security/security.module';
import { SecurityMenuComponent } from './modules/security/components/security-menu/security-menu.component';

/**
 * Composants de test
 */
import { HomepageComponent } from './homepage/homepage.component';
import { PrivatepageComponent } from './privatepage/privatepage.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PrivatepageComponent,
    SecurityMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SecurityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
