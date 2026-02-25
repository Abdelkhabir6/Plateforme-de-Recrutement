<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CvFileController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes de l'API REST pour la plateforme de recrutement
|
*/

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes publiques pour les offres d'emploi (consultation uniquement)
Route::get('/job-offers', [JobOfferController::class, 'index']);
Route::get('/job-offers/{id}', [JobOfferController::class, 'show']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Tableau de bord
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Gestion des utilisateurs (Admin uniquement)
    Route::apiResource('users', UserController::class);

    // Route spécifique pour les offres de l'entreprise connectée
    Route::get('/my-job-offers', [JobOfferController::class, 'myOffers']);

    // Gestion des offres d'emploi (création, modification, suppression)
    Route::post('/job-offers', [JobOfferController::class, 'store']);
    Route::put('/job-offers/{id}', [JobOfferController::class, 'update']);
    Route::patch('/job-offers/{id}', [JobOfferController::class, 'update']);
    Route::delete('/job-offers/{id}', [JobOfferController::class, 'destroy']);

    // Gestion des candidatures
    Route::apiResource('applications', ApplicationController::class);

    // Gestion des CV
    Route::apiResource('cv-files', CvFileController::class);
    Route::get('/cv-files/{id}/download', [CvFileController::class, 'download']);
});

