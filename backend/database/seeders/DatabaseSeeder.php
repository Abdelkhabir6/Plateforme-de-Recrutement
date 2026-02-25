<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\JobOffer;
use App\Models\Application;
use App\Models\CvFile;

/**
 * Seeder principal - Crée des données de test
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Exécute le seeding de la base de données
     */
    public function run(): void
    {
        // Création de l'administrateur
        $admin = User::create([
            'name' => 'Administrateur',
            'email' => 'admin@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+212 6 00 00 00 00',
            'address' => 'Avenue Hassan II, Casablanca, Maroc',
        ]);

        // Création d'entreprises marocaines
        $company1 = User::create([
            'name' => 'TechMaroc Solutions',
            'email' => 'entreprise1@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
            'phone' => '+212 6 12 34 56 78',
            'address' => 'Avenue Mohammed V, Casablanca, Maroc',
        ]);

        $company2 = User::create([
            'name' => 'Digital Morocco',
            'email' => 'entreprise2@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
            'phone' => '+212 6 23 45 67 89',
            'address' => 'Hay Riad, Rabat, Maroc',
        ]);

        $company3 = User::create([
            'name' => 'InnovTech Maroc',
            'email' => 'entreprise3@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
            'phone' => '+212 6 34 56 78 90',
            'address' => 'Gueliz, Marrakech, Maroc',
        ]);

        // Création de candidats marocains
        $candidate1 = User::create([
            'name' => 'Ahmed Benali',
            'email' => 'candidat1@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'candidat',
            'phone' => '+212 6 11 22 33 44',
            'address' => 'Hay Hassani, Casablanca, Maroc',
        ]);

        $candidate2 = User::create([
            'name' => 'Fatima Alaoui',
            'email' => 'candidat2@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'candidat',
            'phone' => '+212 6 22 33 44 55',
            'address' => 'Agdal, Rabat, Maroc',
        ]);

        $candidate3 = User::create([
            'name' => 'Youssef Amrani',
            'email' => 'candidat3@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'candidat',
            'phone' => '+212 6 33 44 55 66',
            'address' => 'Sidi Maarouf, Casablanca, Maroc',
        ]);

        // Création d'offres d'emploi marocaines
        $jobOffer1 = JobOffer::create([
            'title' => 'Développeur Full Stack',
            'description' => 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique à Casablanca. Vous travaillerez sur des projets innovants dans un environnement stimulant.',
            'requirements' => 'Maîtrise de React.js, Laravel, MySQL. Minimum 2 ans d\'expérience. Bonne communication en français et anglais. Capacité à travailler en équipe.',
            'salary_min' => 12000,
            'salary_max' => 18000,
            'location' => 'Casablanca',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company1->id,
        ]);

        $jobOffer2 = JobOffer::create([
            'title' => 'Développeur Front-end React',
            'description' => 'Rejoignez notre équipe à Rabat pour développer des interfaces utilisateur modernes et performantes. Nous cherchons un profil créatif et technique.',
            'requirements' => 'Expert en React.js, Tailwind CSS, JavaScript ES6+. Connaissance de TypeScript appréciée. Minimum 1 an d\'expérience.',
            'salary_min' => 10000,
            'salary_max' => 15000,
            'location' => 'Rabat',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company2->id,
        ]);

        $jobOffer3 = JobOffer::create([
            'title' => 'Développeur Back-end Laravel',
            'description' => 'Nous cherchons un développeur back-end spécialisé en Laravel pour renforcer notre équipe technique à Casablanca. Vous participerez au développement d\'applications web robustes.',
            'requirements' => 'Maîtrise de Laravel, PHP, MySQL. Connaissance de l\'architecture REST API. Expérience avec les tests unitaires. Minimum 2 ans d\'expérience.',
            'salary_min' => 11000,
            'salary_max' => 16000,
            'location' => 'Casablanca',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company1->id,
        ]);

        $jobOffer4 = JobOffer::create([
            'title' => 'Développeur Mobile React Native',
            'description' => 'Poste de développeur mobile React Native pour développer des applications iOS et Android. Environnement de travail moderne à Marrakech.',
            'requirements' => 'Maîtrise de React Native, JavaScript/TypeScript. Connaissance d\'Expo. Expérience avec les API REST. Minimum 1 an d\'expérience.',
            'salary_min' => 9000,
            'salary_max' => 14000,
            'location' => 'Marrakech',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company3->id,
        ]);

        $jobOffer5 = JobOffer::create([
            'title' => 'Développeur DevOps',
            'description' => 'Nous recherchons un développeur DevOps pour gérer notre infrastructure cloud et améliorer nos processus de déploiement. Poste basé à Rabat.',
            'requirements' => 'Connaissance de Docker, Kubernetes, CI/CD. Expérience avec AWS ou Azure. Maîtrise de Linux. Minimum 2 ans d\'expérience.',
            'salary_min' => 13000,
            'salary_max' => 20000,
            'location' => 'Rabat',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company2->id,
        ]);

        $jobOffer6 = JobOffer::create([
            'title' => 'Développeur Full Stack Junior',
            'description' => 'Opportunité pour un développeur junior motivé de rejoindre notre équipe à Casablanca. Formation et accompagnement assurés.',
            'requirements' => 'Connaissances de base en HTML, CSS, JavaScript. Notions de PHP/Laravel ou React.js. Motivation et capacité d\'apprentissage. Stage ou première expérience acceptée.',
            'salary_min' => 6000,
            'salary_max' => 9000,
            'location' => 'Casablanca',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company1->id,
        ]);

        // Note : Pour les fichiers CV, il faudrait uploader de vrais fichiers
        // Ici, on simule juste la structure
        // Dans un vrai projet, on créerait des fichiers de test

        $this->command->info(' Données de test créées avec succès!');
        $this->command->info(' Admin: admin@recruitment.com / password');
        $this->command->info(' Entreprise: entreprise1@recruitment.com / password');
        $this->command->info(' Candidat: candidat1@recruitment.com / password');
    }
}

