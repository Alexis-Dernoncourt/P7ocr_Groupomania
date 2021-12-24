# P7ocr_Groupomania

Projet n°7 de la formation Développeur Web - OpenClassRooms
'Créer un réseau social pour une entreprise'

## Installation
Cloner ou télécharger le dossier.
Installer les dépendances : depuis chaque dossier (frontend et backend) faire un 'npm install' afin d'installer les dépendances.
Démarrer un serveur local (via Wamp, Mamp ou Xamp par exemple).
S'il n'est pas présent au sein du dossier backend, veuillez au préalable créer un dossier 'images' à la racine du dossier backend.

Une fois les services démarrés, se rendre sur PhpMyAdmin afin d'initialiser la base de données et la nommer 'groupomania_bd' (interclassement: UTF8_general_ci). Par défaut, les identifiants en local sont 'utilisateur: root' et pas de mot de passe. L'application créera automatique les tables lors du lancement du serveur (via dossier backend - voir ci dessous).

## Utilisation
Lancer le serveur depuis le dossier backend via 'npm start' (la console indique le port utilisé, par défaut 4000, et les informations de connexion à la base de données: réussite ou echec).
Si échec, vérifiez que vous avez bien initialisé la base de données et que vous avez bien démarré tous les services de Wamp.


Lancer l'application React depuis le dossier frontend via 'npm start'. L'application démarre et s'ouvre automatiquement dans le navigateur (sous le port 3000).
La page login s'ouvre pour vous connecter. À défaut, il est possible de créer un compte.

Pour toute nouvelle inscription, un compte avec le role utilisateur basique (basic) est créé.
Pour tester avec les droit admin, il faut modifier, via PhpMyAdmin, le role d'un utilisateur par 'moderator'. L'admin a alors accès à un espace de modération où il est possible de supprimer ou modérer articles et commentaires (modérer = soft delete).