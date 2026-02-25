<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : Création de la table applications
 * 
 * Gère les candidatures des candidats aux offres d'emploi
 */
return new class extends Migration
{
    /**
     * Exécute les migrations
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('job_offer_id')->constrained('job_offers')->onDelete('cascade');
            $table->foreignId('cv_file_id')->nullable()->constrained('cv_files')->onDelete('set null');
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
            $table->text('message')->nullable();
            $table->timestamps();

            // Empêche un candidat de postuler plusieurs fois à la même offre
            $table->unique(['candidate_id', 'job_offer_id']);
        });
    }

    /**
     * Annule les migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};

