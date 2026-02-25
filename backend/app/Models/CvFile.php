<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle CvFile - Gère les fichiers CV uploadés
 */
class CvFile extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'is_active',
    ];

    /**
     * Les types d'attributs à caster
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation : Un CV appartient à un candidat
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    /**
     * Relation : Un CV peut être utilisé dans plusieurs candidatures
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Scope : Filtrer les CV actifs
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

