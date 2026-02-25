<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle JobOffer - Gère les offres d'emploi
 */
class JobOffer extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'salary_min',
        'salary_max',
        'location',
        'contract_type',
        'status',
        'company_id',
    ];

    /**
     * Les types d'attributs à caster
     *
     * @var array<string, string>
     */
    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation : Une offre d'emploi appartient à une entreprise (utilisateur)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    /**
     * Relation : Une offre d'emploi peut avoir plusieurs candidatures
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Scope : Filtrer les offres actives
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

