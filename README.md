# Plateforme de Bureau de Recrutement en Ligne

## Description
Plateforme web complète permettant de connecter les entreprises, les candidats et un administrateur pour gérer le processus de recrutement.

## Stack Technique

### Front-end
- HTML5
- CSS3
- Tailwind CSS
- JavaScript
- React.js

### Back-end
- PHP 8.1+
- Laravel 10.x
- MySQL

## Structure du Projet

```
Jhilel/
├── backend/          # Application Laravel
├── frontend/         # Application React
└── README.md
```

## Installation

### Backend (Laravel)
```bash
cd backend
composer install
```

**Configuration de l'environnement** : 
- Si vous avez un fichier `.env.example`, copiez-le : `cp .env.example .env`
- Sinon, consultez le fichier `backend/ENV_TEMPLATE.md` pour créer votre fichier `.env`

```bash
php artisan key:generate
```

**Configuration de la base de données** : Éditez le fichier `.env` et configurez :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recruitment_platform
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE recruitment_platform;

# Retour dans le terminal
php artisan migrate --seed
php artisan storage:link
mkdir -p storage/app/public/cv_files
php artisan serve
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000` (ou le port configuré par Vite)

## Fonctionnalités

- ✅ Authentification sécurisée (Admin / Entreprise / Candidat)
- ✅ Gestion des utilisateurs (CRUD)
- ✅ Gestion des offres d'emploi (CRUD)
- ✅ Gestion des candidatures
- ✅ Upload et consultation des CV
- ✅ Tableau de bord avec statistiques

## Rôles

- **Admin** : Gestion complète de la plateforme (utilisateurs, offres, candidatures)
- **Entreprise** : Publication d'offres, consultation des candidatures
- **Candidat** : Consultation des offres, candidature, upload de CV

## Comptes de test

Après avoir exécuté les seeders :

- **Administrateur** : `admin@recruitment.com` / `password`
- **Entreprise** : `entreprise1@recruitment.com` / `password`
- **Candidat** : `candidat1@recruitment.com` / `password`

## Architecture

### Backend (Laravel)
- **Authentification** : Laravel Sanctum (tokens API)
- **Base de données** : MySQL avec migrations et seeders
- **Architecture** : MVC (Modèles, Vues, Contrôleurs)
- **Sécurité** : Validation, hash des mots de passe, protection CSRF

### Frontend (React)
- **Framework** : React 18 avec React Router
- **Styling** : Tailwind CSS
- **HTTP Client** : Axios
- **State Management** : Context API pour l'authentification

## Fonctionnalités détaillées

### Authentification
- Inscription avec choix de rôle (Candidat/Entreprise)
- Connexion sécurisée
- Gestion des tokens d'authentification
- Protection des routes par rôle

### Gestion des utilisateurs (Admin)
- Liste, création, modification, suppression
- Filtres par rôle
- Recherche par nom/email

### Gestion des offres d'emploi
- **Entreprises** : CRUD complet
- **Candidats** : Consultation et recherche
- Filtres : localisation, type de contrat, statut
- Recherche dans titre et description

### Gestion des candidatures
- **Candidats** : Postuler avec CV et message
- **Entreprises** : Voir, filtrer et changer le statut
- Statuts : En attente, Examinée, Acceptée, Refusée

### Gestion des CV
- Upload de fichiers (PDF, DOC, DOCX) - max 10MB
- Liste et suppression
- Téléchargement pour les entreprises (lié aux candidatures)

### Tableau de bord
- **Admin** : Statistiques globales (utilisateurs, offres, candidatures)
- **Entreprise** : Statistiques sur ses offres et candidatures
- **Candidat** : Statistiques sur ses candidatures et CV

## Documentation

- **INSTALLATION.md** : Guide d'installation détaillé et liste complète des endpoints API
- **ARCHITECTURE.md** : Documentation de l'architecture du projet, schémas de base de données et flux de données
- **backend/ENV_TEMPLATE.md** : Template pour le fichier de configuration `.env`

## Licence

Ce projet a été développé pour un Projet de Fin d'Études (PFE).

