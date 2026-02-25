<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : Création de la table users
 * 
 * Gère les utilisateurs (admin, entreprise, candidat)
 */
return new class extends Migration
{
    /**
     * Exécute les migrations
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'entreprise', 'candidat'])->default('candidat');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Annule les migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

