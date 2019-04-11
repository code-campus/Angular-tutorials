# Les directives
> ### Objectifs :
> Savoir créer et comprendre les directives.



# Création d'un nouveau projet

```bash
ng new my-project
cd my-project
```



# Démarrer le Serveur de développement

```bash
ng serve
```



# Créer une directive

## Méthode 1

```bash
ng generate directive 
```

Avant de créer la directive, Angular-CLI vous demande quel sera le nom de la directive.  
Créons la directive qui nous servira à afficher le copyrigth

```bash
? What name would you like to use for the directive? copyright
```

## Méthode 2

Il est également possible de nommer la directive directement dans la commande :

```bash
ng generate directive copyright
```

## Mise à jour de l'application

La commande créer les fichier `copyright.directive.spec.ts` et `copyright.directive.ts`, puis met à jour le module principal.

```bash
> CREATE src/app/copyright.directive.spec.ts (245 bytes)
> CREATE src/app/copyright.directive.ts (151 bytes)
> UPDATE src/app/app.module.ts (484 bytes)
```



# Bonne pratique

Il est préférable de d'organiser les directives dans un répertoire `app/Directives`

```bash
ng generate directive Directives/copyright/copyright
> CREATE src/app/Directives/copyright/copyright.directive.spec.ts (245 bytes)
> CREATE src/app/Directives/copyright/copyright.directive.ts (151 bytes)
> UPDATE src/app/app.module.ts (484 bytes)
```



# Modifier le fichier TypeScript

```typescript
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyright]'
})
export class CopyrightDirective {

  date = new Date();
  year = this.date.getFullYear();

  constructor(private el: ElementRef) {
    this.el.nativeElement.innerHTML = '&copy '+ this.year +' all right reserved.';
  }

}
```



# Utilisation

Ajouter le ligne suivante au fichier `arc/App/app.component.html`

```html
<div appCopyright></div>
```

Le texte `© 2019 all right reserved.` apparait sur le rendu navigateur.