<?php

namespace App\Http\Controllers;

use App\Models\CvFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

/**
 * Controller de gestion des fichiers CV
 * 
 * Gère l'upload, la consultation et la suppression des CV
 */
class CvFileController extends Controller
{
    /**
     * Constructeur - Protection par authentification
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Liste les CV d'un candidat
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Les candidats voient leurs propres CV
        // L'admin peut voir tous les CV
        $query = CvFile::with('candidate');

        if ($user->isCandidate()) {
            $query->where('candidate_id', $user->id);
        }

        $cvFiles = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $cvFiles
        ], 200);
    }

    /**
     * Affiche un CV spécifique
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $cvFile = CvFile::with('candidate')->find($id);

        if (!$cvFile) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé'
            ], 404);
        }

        // Vérification des permissions
        $user = $request->user();
        $canView = false;

        if ($user->isAdmin()) {
            $canView = true;
        } elseif ($user->isCandidate() && $cvFile->candidate_id === $user->id) {
            $canView = true;
        } elseif ($user->isCompany()) {
            // Les entreprises peuvent voir les CV associés aux candidatures de leurs offres
            $canView = $cvFile->applications()
                ->whereHas('jobOffer', function($q) use ($user) {
                    $q->where('company_id', $user->id);
                })
                ->exists();
        }

        if (!$canView) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $cvFile
        ], 200);
    }

    /**
     * Télécharge un fichier CV
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function download(Request $request, $id)
    {
        $cvFile = CvFile::find($id);

        if (!$cvFile) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé'
            ], 404);
        }

        // Vérification des permissions (même logique que show)
        $user = $request->user();
        $canDownload = false;

        if ($user->isAdmin()) {
            $canDownload = true;
        } elseif ($user->isCandidate() && $cvFile->candidate_id === $user->id) {
            $canDownload = true;
        } elseif ($user->isCompany()) {
            $canDownload = $cvFile->applications()
                ->whereHas('jobOffer', function($q) use ($user) {
                    $q->where('company_id', $user->id);
                })
                ->exists();
        }

        if (!$canDownload) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        // Vérifier que le fichier existe
        if (!Storage::disk('public')->exists($cvFile->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé sur le serveur'
            ], 404);
        }

        return Storage::disk('public')->download($cvFile->file_path, $cvFile->file_name);
    }

    /**
     * Upload un nouveau fichier CV (réservé aux candidats)
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
                'message' => 'Seuls les candidats peuvent uploader des CV'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('cv_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('cv_files', $fileName, 'public');

        $cvFile = CvFile::create([
            'candidate_id' => $request->user()->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CV uploadé avec succès',
            'data' => $cvFile
        ], 201);
    }

    /**
     * Supprime un fichier CV
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $cvFile = CvFile::find($id);

        if (!$cvFile) {
            return response()->json([
                'success' => false,
                'message' => 'CV non trouvé'
            ], 404);
        }

        // Seuls les candidats propriétaires et l'admin peuvent supprimer
        $user = $request->user();
        if (!$user->isAdmin() && $cvFile->candidate_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas le droit de supprimer ce CV'
            ], 403);
        }

        // Supprimer le fichier physique
        if (Storage::disk('public')->exists($cvFile->file_path)) {
            Storage::disk('public')->delete($cvFile->file_path);
        }

        // Supprimer l'enregistrement
        $cvFile->delete();

        return response()->json([
            'success' => true,
            'message' => 'CV supprimé avec succès'
        ], 200);
    }
}

