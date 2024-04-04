# TP COMPLEMENT WEB

## Groupe : 

MASERATI Amaël

GRATADE Sébastien

## Initialisation du projet

Pour ouvrir le projet, vous devez posséder un terminal pour le json-server et un autre pour le client.

Pour le serveur json, vous devez taper les commandes suivantes : 

```bash
npm install

json-server --watch server/db.json
```

Pour le client, vous devez taper :

```bash
php -S localhost:5000
```

Le port est au choix mais doit être différent de 3000 car c'est le port utilisé par le json-server.

## Fonctionnalités

Lorsque vous lancez arrivez sur la SPA, vous être dirigé vers une page d'accueil qui vous définit ce que le site propose.

Vous pouvez ensuite vous diriger vers la page listant tous les personnages. Cette page possède différents points : 
- Une pagination qui effectue des requêtes à l'API
- Une barre de recherche
- Un bouton qui détaille un personnage
- Un bouton qui améliore un personnage
- Un bouton qui réinitialise l'évolution d'un personnage
- Un bouton pour mettre un personnage en favoris qui les enregistre dans le local storage
- Un système de notation des personnages qui est enregistré dans le local storage

Vous avez ensuite la page des favoris dans laquelle vous pouvez consulter vos favoris et les retirez si vous le souhaitez.
