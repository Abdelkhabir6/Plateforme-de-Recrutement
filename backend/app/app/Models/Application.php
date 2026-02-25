<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Application - Gère les candidatures
 */
class Application extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_id',
        'job_offer_id',
        'status',
        'message',
        'cv_file_id',
    ];

    /**
     * Les types d'attributs à caster
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation : Une candidature appartient à un candidat
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    /**
     * Relation : Une candidature appartient à une offre d'emploi
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }

    /**
     * Relation : Une candidature peut avoir un CV associé
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cvFile()
    {
        return $this->belongsTo(CvFile::class);
    }

    /**
     * Statuts possibles des candidatures
     *
     * @return array
     */
    public static function getStatuses(): array
    {
        return [
            'pending' => 'En attente',
            'reviewed' => 'Examinée',
            'accepted' => 'Acceptée',
            'rejected' => 'Refusée',
        ];
    }
}

