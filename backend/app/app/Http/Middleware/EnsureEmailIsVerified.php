<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware pour vérifier que l'email est vérifié
 * (Optionnel pour ce projet - peut être utilisé plus tard)
 */
class EnsureEmailIsVerified
{
    /**
     * Gère une requête entrante
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pour l'instant, on laisse passer toutes les requêtes
        // Cette classe peut être utilisée plus tard pour la vérification d'email
        return $next($request);
    }
}

