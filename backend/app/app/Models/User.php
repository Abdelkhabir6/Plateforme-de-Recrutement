<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modèle User - Gère les utilisateurs de la plateforme
 * 
 * Types de rôles : admin, entreprise, candidat
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs qui sont assignables en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
    ];

    /**
     * Les attributs qui doivent être cachés pour la sérialisation
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les types d'attributs à caster
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Vérifie si l'utilisateur est un administrateur
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est une entreprise
     *
     * @return bool
     */
    public function isCompany(): bool
    {
        return $this->role === 'entreprise';
    }

    /**
     * Vérifie si l'utilisateur est un candidat
     *
     * @return bool
     */
    public function isCandidate(): bool
    {
        return $this->role === 'candidat';
    }

    /**
     * Relation : Un utilisateur entreprise peut avoir plusieurs offres d'emploi
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jobOffers()
    {
        return $this->hasMany(JobOffer::class);
    }

    /**
     * Relation : Un utilisateur candidat peut avoir plusieurs candidatures
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Relation : Un utilisateur candidat peut avoir plusieurs CV
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cvFiles()
    {
        return $this->hasMany(CvFile::class);
    }
}

