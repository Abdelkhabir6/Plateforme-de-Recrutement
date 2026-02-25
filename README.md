<div align="center">

# Plateforme de Recrutement en Ligne

**Une solution complète de mise en relation entre entreprises et candidats**

[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Table des matieres

- [A propos](#a-propos)
- [Fonctionnalites](#fonctionnalites)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Installation](#installation)
- [Comptes de test](#comptes-de-test)
- [Endpoints API](#endpoints-api)

---

## A propos

Plateforme web full-stack permettant de digitaliser le processus de recrutement. Elle met en relation **entreprises**, **candidats** et un **administrateur** au sein d'un espace unifie, securise et intuitif.

Le projet a ete developpe dans le cadre d'un **Projet de Fin d'Etudes (PFE)**.

---

## Fonctionnalites

| Role | Fonctionnalites |
|---|---|
| **Admin** | Gestion complete des utilisateurs (CRUD), tableau de bord statistiques global |
| **Entreprise** | Publication et gestion des offres d'emploi, consultation et traitement des candidatures |
| **Candidat** | Consultation des offres, candidature avec message, upload et gestion des CVs |

Fonctionnalites transversales :

- Authentification securisee avec tokens (Laravel Sanctum)
- Inscription avec choix de role (Candidat / Entreprise)
- Protection des routes par role
- Upload de fichiers CV (PDF, DOC, DOCX - max 10 MB)
- Tableau de bord personnalise par role
- Recherche et filtres avances (localisation, type de contrat, statut)
- Gestion des statuts de candidatures (En attente, Examinees, Acceptee, Refusee)

---

## Stack technique

### Backend

- **PHP 8.2+** / **Laravel 10.x**
- **Laravel Sanctum** - authentification par tokens API
- **MySQL / MariaDB** - base de donnees relationnelle
- Architecture **MVC** avec API REST

### Frontend

- **React 18** + **Vite 5**
- **Tailwind CSS 3** - design utilitaire
- **Axios** - client HTTP
- **React Router v6** - navigation
- **Context API** - gestion de l'etat d'authentification

---

## Architecture

```
Plateforme-de-Recrutement/
├── backend/                  # API REST Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # AuthController, UserController, JobOfferController...
│   │   └── Models/           # User, JobOffer, Application, CvFile
│   ├── database/
│   │   ├── migrations/       # Schema de la base de donnees
│   │   └── seeders/          # Donnees de test
│   └── routes/api.php        # Definition des routes API
│
└── frontend/                 # SPA React
    └── src/
        ├── pages/            # Login, Register, Dashboard, JobOffers...
        ├── components/       # Composants reutilisables
        └── contexts/         # AuthContext
```

---

## Installation

### Prerequis

- PHP >= 8.2 + Composer
- Node.js >= 18 + npm
- MySQL ou MariaDB

### 1. Cloner le depot

```bash
git clone https://github.com/Abdelkhabir6/Plateforme-de-Recrutement.git
cd Plateforme-de-Recrutement
```

### 2. Backend - Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Editer `.env` avec vos parametres de base de donnees :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recruitment_platform
DB_USERNAME=root
DB_PASSWORD=
```

```bash
mysql -u root -p -e "CREATE DATABASE recruitment_platform;"
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

> L'API est accessible sur **http://localhost:8000**

### 3. Frontend - React

```bash
cd ../frontend
npm install
npm run dev
```

> L'interface est accessible sur **http://localhost:5173**

---

## Comptes de test

Apres execution de `php artisan migrate --seed` :

| Role | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@recruitment.com` | `password` |
| Entreprise | `entreprise1@recruitment.com` | `password` |
| Entreprise | `entreprise2@recruitment.com` | `password` |
| Candidat | `candidat1@recruitment.com` | `password` |
| Candidat | `candidat2@recruitment.com` | `password` |

---

## Endpoints API

### Publics

| Methode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Inscription |
| `POST` | `/api/login` | Connexion |
| `GET` | `/api/job-offers` | Liste des offres d'emploi |
| `GET` | `/api/job-offers/{id}` | Detail d'une offre |

### Proteges (token Sanctum requis)

| Methode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/logout` | Deconnexion |
| `GET` | `/api/me` | Profil utilisateur connecte |
| `GET` | `/api/dashboard` | Statistiques du tableau de bord |
| `CRUD` | `/api/users` | Gestion des utilisateurs (Admin) |
| `CRUD` | `/api/applications` | Gestion des candidatures |
| `CRUD` | `/api/cv-files` | Gestion des CVs |
| `GET` | `/api/my-job-offers` | Offres de l'entreprise connectee |

---

<div align="center">

Developpe dans le cadre d'un PFE - 2024

</div>
