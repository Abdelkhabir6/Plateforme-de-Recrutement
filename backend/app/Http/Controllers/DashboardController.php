<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer;
use App\Models\Application;
use Illuminate\Http\Request;

/**
 * Controller du tableau de bord
 * 
 * Fournit les statistiques pour le tableau de bord
 */
class DashboardController extends Controller
{
    /**
     * Constructeur - Protection par authentification
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Récupère les statistiques du tableau de bord
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $stats = [];

        if ($user->isAdmin()) {
            // Statistiques pour l'administrateur
            $stats = [
                'total_users' => User::count(),
                'total_companies' => User::where('role', 'entreprise')->count(),
                'total_candidates' => User::where('role', 'candidat')->count(),
                'total_job_offers' => JobOffer::count(),
                'active_job_offers' => JobOffer::where('status', 'active')->count(),
                'total_applications' => Application::count(),
                'pending_applications' => Application::where('status', 'pending')->count(),
                'recent_job_offers' => JobOffer::with('company')->latest()->take(5)->get(),
                'recent_applications' => Application::with(['candidate', 'jobOffer'])->latest()->take(5)->get(),
            ];
        } elseif ($user->isCompany()) {
            // Statistiques pour l'entreprise
            $stats = [
                'total_job_offers' => JobOffer::where('company_id', $user->id)->count(),
                'active_job_offers' => JobOffer::where('company_id', $user->id)->where('status', 'active')->count(),
                'total_applications' => Application::whereHas('jobOffer', function($q) use ($user) {
                    $q->where('company_id', $user->id);
                })->count(),
                'pending_applications' => Application::whereHas('jobOffer', function($q) use ($user) {
                    $q->where('company_id', $user->id);
                })->where('status', 'pending')->count(),
                'accepted_applications' => Application::whereHas('jobOffer', function($q) use ($user) {
                    $q->where('company_id', $user->id);
                })->where('status', 'accepted')->count(),
                'recent_applications' => Application::with(['candidate', 'jobOffer', 'cvFile'])
                    ->whereHas('jobOffer', function($q) use ($user) {
                        $q->where('company_id', $user->id);
                    })
                    ->latest()
                    ->take(10)
                    ->get(),
            ];
        } elseif ($user->isCandidate()) {
            // Statistiques pour le candidat
            $stats = [
                'total_applications' => Application::where('candidate_id', $user->id)->count(),
                'pending_applications' => Application::where('candidate_id', $user->id)->where('status', 'pending')->count(),
                'accepted_applications' => Application::where('candidate_id', $user->id)->where('status', 'accepted')->count(),
                'total_cv_files' => \App\Models\CvFile::where('candidate_id', $user->id)->count(),
                'recent_applications' => Application::with(['jobOffer.company', 'cvFile'])
                    ->where('candidate_id', $user->id)
                    ->latest()
                    ->take(10)
                    ->get(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ], 200);
    }
}

