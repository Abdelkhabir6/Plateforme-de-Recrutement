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
            'phone' => '0123456789',
            'address' => '123 Rue Admin, Ville',
        ]);

        // Création d'entreprises
        $company1 = User::create([
            'name' => 'Tech Solutions',
            'email' => 'entreprise1@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
            'phone' => '0123456780',
            'address' => '456 Rue Entreprise, Ville',
        ]);

        $company2 = User::create([
            'name' => 'Digital Agency',
            'email' => 'entreprise2@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
            'phone' => '0123456781',
            'address' => '789 Rue Digital, Ville',
        ]);

        // Création de candidats
        $candidate1 = User::create([
            'name' => 'Jean Dupont',
            'email' => 'candidat1@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'candidat',
            'phone' => '0123456782',
            'address' => '321 Rue Candidat, Ville',
        ]);

        $candidate2 = User::create([
            'name' => 'Marie Martin',
            'email' => 'candidat2@recruitment.com',
            'password' => Hash::make('password'),
            'role' => 'candidat',
            'phone' => '0123456783',
            'address' => '654 Rue Candidate, Ville',
        ]);

        // Création d'offres d'emploi
        $jobOffer1 = JobOffer::create([
            'title' => 'Développeur Full Stack',
            'description' => 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe.',
            'requirements' => 'Maîtrise de React.js, Laravel, MySQL. Minimum 3 ans d\'expérience.',
            'salary_min' => 45000,
            'salary_max' => 65000,
            'location' => 'Paris',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company1->id,
        ]);

        $jobOffer2 = JobOffer::create([
            'title' => 'Développeur Front-end React',
            'description' => 'Rejoignez notre équipe pour développer des interfaces utilisateur modernes.',
            'requirements' => 'Expert en React.js, Tailwind CSS, JavaScript ES6+.',
            'salary_min' => 40000,
            'salary_max' => 55000,
            'location' => 'Lyon',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company1->id,
        ]);

        $jobOffer3 = JobOffer::create([
            'title' => 'Développeur Back-end Laravel',
            'description' => 'Nous cherchons un développeur back-end spécialisé en Laravel.',
            'requirements' => 'Maîtrise de Laravel, PHP, MySQL. Connaissance de l\'architecture REST API.',
            'salary_min' => 42000,
            'salary_max' => 60000,
            'location' => 'Toulouse',
            'contract_type' => 'CDI',
            'status' => 'active',
            'company_id' => $company2->id,
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

