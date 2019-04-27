# Bootstraop
> ### Objectifs :
> Savoir installer et intégrer Bootstrap




# Création d'un projet 

```bash
ng new my-project --style=css --routing=false
cd my-project
```



# Bootstrap

## Installation de la dépendance

```bash
npm install bootstrap --save
```

## Intégration

Ajouter la dépendance au fichier de configuration `angular.json`

```json
"styles": [
    "../node_modules/bootstrap/dist/css/bootstrap.min.css",
    "styles.css"
],
```



# Démarrer le Serveur de développement

```bash
ng serve
```

Redémarrer le serveur de développement si celui-ci été déja en marche.