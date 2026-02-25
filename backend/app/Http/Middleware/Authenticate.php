<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Pour les requêtes API, retourner null pour générer une réponse JSON 401
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // Pour les requêtes web, rediriger vers la page de login
        // Note: Si vous n'avez pas de route web 'login', vous pouvez retourner null
        // ou créer une route web pour la page de login
        return null;
    }
}
