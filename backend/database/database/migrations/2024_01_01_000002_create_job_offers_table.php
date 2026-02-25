<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : Création de la table job_offers
 * 
 * Gère les offres d'emploi publiées par les entreprises
 */
return new class extends Migration
{
    /**
     * Exécute les migrations
     */
    public function up(): void
    {
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->string('location')->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'Stage', 'Freelance', 'Temps partiel'])->nullable();
            $table->enum('status', ['active', 'inactive', 'closed'])->default('active');
            $table->foreignId('company_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Annule les migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};

