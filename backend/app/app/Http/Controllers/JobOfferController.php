<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Controller de gestion des offres d'emploi
 * 
 * CRUD complet pour les offres d'emploi
 */
class JobOfferController extends Controller
{
    /**
     * Constructeur - Protection par authentification
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Liste toutes les offres d'emploi (accessible publiquement)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = JobOffer::with('company');

        // Filtre par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Par défaut, on montre les offres actives
            $query->where('status', 'active');
        }

        // Filtre par localisation
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filtre par type de contrat
        if ($request->has('contract_type')) {
            $query->where('contract_type', $request->contract_type);
        }

        // Recherche dans titre et description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtre par entreprise (pour les entreprises)
        if ($request->user() && $request->user()->isCompany() && !$request->has('all')) {
            $query->where('company_id', $request->user()->id);
        }

        $offers = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $offers
        ], 200);
    }

    /**
     * Affiche une offre d'emploi spécifique
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $offer = JobOffer::with('company', 'applications')->find($id);

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'Offre d\'emploi non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $offer
        ], 200);
    }

    /**
     * Crée une nouvelle offre d'emploi (réservé aux entreprises)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Vérification du rôle
        if (!$request->user()->isCompany() && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Seules les entreprises peuvent créer des offres d\'emploi'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'location' => 'nullable|string|max:255',
            'contract_type' => 'nullable|in:CDI,CDD,Stage,Freelance,Temps partiel',
            'status' => 'nullable|in:active,inactive,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['company_id'] = $request->user()->isCompany() ? $request->user()->id : $request->company_id;
        $data['status'] = $data['status'] ?? 'active';

        $offer = JobOffer::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Offre d\'emploi créée avec succès',
            'data' => $offer->load('company')
        ], 201);
    }

    /**
     * Met à jour une offre d'emploi
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $offer = JobOffer::find($id);

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'Offre d\'emploi non trouvée'
            ], 404);
        }

        // Vérification des permissions
        $user = $request->user();
        if (!$user->isAdmin() && $offer->company_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas le droit de modifier cette offre'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'requirements' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'location' => 'nullable|string|max:255',
            'contract_type' => 'nullable|in:CDI,CDD,Stage,Freelance,Temps partiel',
            'status' => 'nullable|in:active,inactive,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $offer->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Offre d\'emploi mise à jour avec succès',
            'data' => $offer->fresh()->load('company')
        ], 200);
    }

    /**
     * Supprime une offre d'emploi
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $offer = JobOffer::find($id);

        if (!$offer) {
            return response()->json([
                'success' => false,
                'message' => 'Offre d\'emploi non trouvée'
            ], 404);
        }

        // Vérification des permissions
        $user = $request->user();
        if (!$user->isAdmin() && $offer->company_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas le droit de supprimer cette offre'
            ], 403);
        }

        $offer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Offre d\'emploi supprimée avec succès'
        ], 200);
    }
}

