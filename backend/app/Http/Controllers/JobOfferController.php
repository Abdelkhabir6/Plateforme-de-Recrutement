<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
        // Les méthodes index et show sont publiques mais peuvent utiliser l'auth si disponible
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * Liste toutes les offres d'emploi (accessible publiquement)
     * Affiche uniquement les offres actives pour les visiteurs publics
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
            // Par défaut, on montre les offres actives pour les visiteurs publics
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

        $offers = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $offers
        ], 200);
    }

    /**
     * Liste les offres d'emploi de l'entreprise connectée (route authentifiée)
     * Les entreprises ne peuvent voir QUE leurs propres offres
     * Les admins peuvent voir TOUTES les offres
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function myOffers(Request $request)
    {
        $user = $request->user();

        // Vérification du rôle
        if (!$user->isCompany() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux entreprises et aux administrateurs'
            ], 403);
        }

        $query = JobOffer::with('company');

        // Les entreprises ne peuvent voir QUE leurs propres offres
        // Les admins voient TOUTES les offres (pas de filtre)
        if ($user->isCompany()) {
            $query->where('company_id', $user->id);
        }
        // Si c'est un admin, pas de filtre par company_id

        // Filtre par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
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
        $user = $request->user();
        
        // Vérification du rôle - Seules les entreprises peuvent créer des offres
        // L'admin peut modifier/supprimer mais ne peut pas créer
        if (!$user->isCompany()) {
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

        $data = $request->all();
        
        // Les entreprises ne peuvent pas modifier le company_id de leurs offres
        if ($user->isCompany()) {
            unset($data['company_id']);
        }

        $offer->update($data);

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

