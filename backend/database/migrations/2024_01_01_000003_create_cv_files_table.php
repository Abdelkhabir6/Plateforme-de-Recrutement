<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : Création de la table cv_files
 * 
 * Gère les fichiers CV uploadés par les candidats
 */
return new class extends Migration
{
    /**
     * Exécute les migrations
     */
    public function up(): void
    {
        Schema::create('cv_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained('users')->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->integer('file_size')->nullable(); // Taille en bytes
            $table->string('mime_type')->nullable(); // Ex: application/pdf
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Annule les migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_files');
    }
};

