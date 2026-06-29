# Système de gestion des documents accessibles

Application web de gestion et de diffusion de documents accessibles, développée pour répondre aux besoins des services d'accessibilité en milieu universitaire. Elle permet de cataloguer des ressources documentaires adaptées, de traiter les demandes des usagers et de leur transmettre un accès sécurisé et limité dans le temps à leurs documents.

---

## Aperçu du système

Le système repose sur une architecture client-serveur composée de deux parties distinctes.

La partie frontale est une application monopage développée avec Angular 16. Elle offre une interface complète pour la gestion du catalogue de documents, le traitement des demandes et la consultation de l'historique des opérations. L'authentification s'appuie sur Azure Active Directory, ce qui permet une intégration directe avec les comptes institutionnels.

La partie dorsale est un serveur Node.js avec Express. Il expose une API REST consommée par le frontal, gère les sessions, les téléversements de fichiers et la communication avec la base de données MySQL.

---

## Fonctionnalités principales

**Gestion du catalogue**
- Création, modification et suppression d'items documentaires (livres, articles, ressources numériques) avec leurs métadonnées d'accessibilité : format, langue, présence d'un document complet, visuels accessibles, ISBN, éditeur, etc.
- Organisation des items en collections thématiques.

**Traitement des demandes**
- Enregistrement des demandes d'accès aux documents par les usagers.
- Génération de liens d'accès sécurisés, associés à une clé unique et une date d'expiration configurable.
- Suivi du statut de chaque demande et envoi des informations de récupération à l'usager.

**Récupération des documents**
- Interface publique permettant à un usager de récupérer ses documents via un lien personnalisé, sans nécessiter de compte dans le système.

**Historique et rapports**
- Consultation de l'historique complet des opérations.
- Génération de rapports à des fins de suivi et de reddition de comptes.

**Gestion des accès**
- Trois niveaux d'accès : administrateur, visualiseur et usager.
- Protection des routes par des gardes d'authentification et d'autorisation.

---

## Prérequis

- Node.js 18 ou supérieur
- Angular CLI 16
- MySQL 8
- Un locataire Azure Active Directory configuré pour l'authentification OAuth2

---

## Installation

**Frontal**

Depuis la racine du dépôt, installer les dépendances :

```bash
npm install
```

**Serveur**

Depuis le répertoire `backend/`, installer les dépendances :

```bash
cd backend
npm install
```

---

## Configuration

Créer un fichier `.env` dans le répertoire `backend/` en se basant sur le fichier d'exemple fourni. Les variables à renseigner incluent les paramètres de connexion à la base de données MySQL, les identifiants Azure AD ainsi que les paramètres de session.

---

## Démarrage en développement

**Serveur dorsale**

```bash
cd backend
node app.js
```

**Application frontale**

```bash
ng serve
```

L'application est ensuite accessible à l'adresse `http://localhost:4200`. Elle se recharge automatiquement lors de toute modification du code source.

---

## Construction pour la production

```bash
ng build
```

Les artefacts compilés sont déposés dans le répertoire `dist/`. Ils peuvent ensuite être servis par n'importe quel serveur web statique.

---

## Tests

**Tests unitaires**

```bash
ng test
```

Les tests unitaires sont exécutés via Karma.

**Tests de bout en bout**

```bash
ng e2e
```

Un adaptateur de test de bout en bout doit être installé séparément avant d'utiliser cette commande.

---

## Génération de composants

Pour ajouter un nouveau composant Angular au projet :

```bash
ng generate component nom-du-composant
```

La commande `ng generate` accepte également les types suivants : `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, `module`.

---

## Aide supplémentaire

Pour obtenir de l'aide sur l'interface de ligne de commande Angular, consulter la [documentation officielle de l'Angular CLI](https://angular.io/cli) ou exécuter :

```bash
ng help
```

---

## Conception et développement

Conçu et développé par **Natalia Jabinschi**
Direction des bibliothèques, Université de Montréal
