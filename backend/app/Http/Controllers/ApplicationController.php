<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Controller de gestion des candidatures
 * 
 * CRUD complet pour les candidatures
 */
class ApplicationController extends Controller
{
    /**
     * Constructeur - Protection par authentification
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Liste toutes les candidatures
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Application::with(['candidate', 'jobOffer.company', 'cvFile']);

        $user = $request->user();

        // Les candidats voient leurs propres candidatures
        if ($user->isCandidate()) {
            $query->where('candidate_id', $user->id);
        }

        // Les entreprises voient les candidatures pour leurs offres
        if ($user->isCompany()) {
            $query->whereHas('jobOffer', function($q) use ($user) {
                $q->where('company_id', $user->id);
            });
        }

        // Filtre par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtre par offre d'emploi
        if ($request->has('job_offer_id')) {
            $query->where('job_offer_id', $request->job_offer_id);
        }

        $applications = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications
        ], 200);
    }

    /**
     * Affiche une candidature spécifique
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $application = Application::with(['candidate', 'jobOffer.company', 'cvFile'])->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Candidature non trouvée'
            ], 404);
        }

        // Vérification des permissions
        $user = $request->user();
        $canView = false;

        if ($user->isAdmin()) {
            $canView = true;
        } elseif ($user->isCandidate() && $application->candidate_id === $user->id) {
            $canView = true;
        } elseif ($user->isCompany() && $application->jobOffer->company_id === $user->id) {
            $canView = true;
        }

        if (!$canView) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $application
        ], 200);
    }

    /**
     * Crée une nouvelle candidature (réservé aux candidats)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Vérification du rôle
        if (!$request->user()->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les candidats peuvent postuler'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'job_offer_id' => 'required|exists:job_offers,id',
            'message' => 'nullable|string',
            'cv_file_id' => 'nullable|exists:cv_files,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier que l'offre est active
        $jobOffer = JobOffer::find($request->job_offer_id);
        if ($jobOffer->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Cette offre d\'emploi n\'est plus disponible'
            ], 400);
        }

        // Vérifier que le candidat n'a pas déjà postulé
        $existingApplication = Application::where('candidate_id', $request->user()->id)
            ->where('job_offer_id', $request->job_offer_id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà postulé à cette offre'
            ], 400);
        }

        // Vérifier que le CV appartient au candidat si spécifié
        if ($request->cv_file_id) {
            $cvFile = \App\Models\CvFile::find($request->cv_file_id);
            if ($cvFile && $cvFile->candidate_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'CV non autorisé'
                ], 403);
            }
        }

        $application = Application::create([
            'candidate_id' => $request->user()->id,
            'job_offer_id' => $request->job_offer_id,
            'cv_file_id' => $request->cv_file_id,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Candidature envoyée avec succès',
            'data' => $application->load(['candidate', 'jobOffer.company', 'cvFile'])
        ], 201);
    }

    /**
     * Met à jour une candidature (statut principalement)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $application = Application::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Candidature non trouvée'
            ], 404);
        }

        $user = $request->user();

        // Seules les entreprises et l'admin peuvent modifier le statut
        $canUpdate = false;
        if ($user->isAdmin()) {
            $canUpdate = true;
        } elseif ($user->isCompany() && $application->jobOffer->company_id === $user->id) {
            $canUpdate = true;
        }

        if (!$canUpdate) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas le droit de modifier cette candidature'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewed,accepted,rejected',
            'message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application->update($request->only(['status', 'message']));

        return response()->json([
            'success' => true,
            'message' => 'Candidature mise à jour avec succès',
            'data' => $application->fresh()->load(['candidate', 'jobOffer.company', 'cvFile'])
        ], 200);
    }

    /**
     * Supprime une candidature
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $application = Application::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Candidature non trouvée'
            ], 404);
        }

        $user = $request->user();

        // Les candidats peuvent supprimer leurs propres candidatures
        // Les admins peuvent tout supprimer
        $canDelete = false;
        if ($user->isAdmin()) {
            $canDelete = true;
        } elseif ($user->isCandidate() && $application->candidate_id === $user->id) {
            $canDelete = true;
        }

        if (!$canDelete) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas le droit de supprimer cette candidature'
            ], 403);
        }

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Candidature supprimée avec succès'
        ], 200);
    }
}

