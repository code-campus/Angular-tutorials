# Création d'un projet Angular
> ### Objectifs :
> Savoir créer un nouveau projet Angular avec le gestionaire NG
> ### Notes :
> Dans ce cours, le terme **my-project** réprésente le nom du projet. Remplacez ce terme par le nom de votre projet.




# Création d'un nouveau projet

```bash
ng new my-project
cd my-project
```



# Démarrer le Serveur de développement

```bash
ng serve
```



# Les options de la commande `serve`

## Choix du port d'écoute

```bash
ng serve --port=4200
```

## Ouverture automatique du navigateur

```bash
ng serve --open
ng serve -o
```



# Utils

```bash
ng serve --port=8080 --open --disable-host-check
```
```bash
ng serve --port=8080 --disable-host-check
```
```bash
ng serve --open --disable-host-check
```
```bash
ng serve --disable-host-check
```