# Le routage
> ### Objectifs :
> Savoir gérer le routage




# Création d'un nouveau projet

Partons du principe que le module de routage ne soit pas installé lors de la création du projet.

```bash
ng new my-project
cd my-project
```




# Démarrer le Serveur de développement

```bash
ng serve
``` 




# Déclaration du module de routage

## Créer le module

```bash
ng generate module app-routing --flat --module=app
``` 

- L'option `--flat` permet de créer le fichier `app/app-routing.module.ts` au lieu de  `app/app-routing/app-routing.module.ts`.
- L'option `--module=app` permet d'importer automatiquement le module `app-routing` dans le fichier `app.module.ts`.



## Importer le module

Dans le fichier `app.module.ts` ajouter les lignes suivante :

```typescript
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // ..
    AppRoutingModule
  ]
})
``` 


## Ajouter la directive de routage

Ajouter la directive de routage `router-outlet` dans le fichier `app/app.component.html`

```html
<router-outlet></router-outlet>
```




# Définition de la table de routage

Ajouter les routes dans le tableau de routage du fichier `app/app-routing.module.ts`

```typescript
const routes: Routes = [];
``` 


## Création des composants

```bash
ng generate component components/homepage
ng generate component components/contact
``` 


## Importer les composants

Importer les composants `homepage` et `contact` au fichier `app/app-routing.module.ts`.

```typescript
import { HomepageComponent } from './components/homepage/homepage.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'contact', component: ContactComponent },
];
``` 




# Intégration de la navigation

Dans le fichier `app.component.html`,  ajouter le bloc de navigation suivant :

```html
<nav>
  <a [routerLink]="['/']">Accueil</a> - 
  <a [routerLink]="['contact']">Contact</a> 
</nav>
<hr>
<router-outlet></router-outlet>
```

**Notez** : l'attribut `href` est remplacer par la directive d'attribut `routerLink`.