# Les modules
> ### Objectifs :
> Savoir créer et intégrer un module



# Création d'un nouveau projet

```bash
ng new my-project
cd my-project
```



# Démarrer le Serveur de développement

```bash
ng serve
```



# Créer un module

## Méthode 1

```bash
ng generate module
```

Avant de créer le module, Angular-CLI vous demande quel sera le nom de celui-ci.

```bash
? What name would you like to use for the NgModule? books
```


## Méthode 2

Il est également possible de nommer le module directement dans la commande :


```bash
ng generate module books
```


# Mise à jour de l'application

La commande créer un répertoire et un fichier au nom du module

```bash
> CREATE src/app/books/books.module.ts (188 bytes)
``` 



# Bonne pratique

Il est préférable de d'organiser les modules dans un répertoire `app/Modules`

```bash
ng generate module Modules/books
```



# Utilisation

Importer le module dans l'application pour pouvoir l'utiliser.

```typescript
import { BooksModule } from "./Modules/books/books.module";
```

```typescript
@NgModule({
  imports: [
    // ... ,
    BooksModule
  ],
})
export class AppModule { }
```