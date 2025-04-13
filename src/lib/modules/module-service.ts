// src/lib/modules/module-service.ts
import { promises as fs } from 'fs';
import path from 'path';
// Importez le client Supabase SERVEUR
import { createServerSupabaseClient } from '@/services/supabase/server';
// Importez les types nécessaires (adaptez selon votre structure)
import type { Database } from '@/types/database.types';
import type { Lesson } from '@/types/course.types'; // Supposons un type Lesson simple

// --- Types ---

// Type correspondant à la structure de la table 'modules' dans Supabase (simplifié)
interface DbModule {
    id: string; // ou number
    slug: string; // Colonne slug unique
    title: string;
    description?: string | null;
    level?: string | null;
    order?: number | null;
    // Ajoutez d'autres colonnes de votre table 'modules'
}

// Type pour les informations de base du module (utilisé par la page module)
export interface ModuleBasicInfo {
    slug: string;
    title: string;
    description: string;
    level?: string | null;
    // Ajoutez d'autres métadonnées si nécessaire
}

// Type pour une leçon listée dans le module (simplifié)
export interface ModuleLessonInfo {
    slug: string; // Slug de la leçon
    title: string;
    order: number;
    isCompleted: boolean; // Statut pour l'utilisateur actuel
}

// Type de retour pour la fonction listant les leçons d'un module
export interface ModuleWithLessons extends ModuleBasicInfo {
    lessons: ModuleLessonInfo[];
    completionPercent: number;
    nextLessonSlug?: string | null; // Slug de la prochaine leçon à faire
    isLocked?: boolean; // Si le module est accessible
}


// --- Fonctions Service ---

/**
 * Récupère les informations de base d'un module par son slug.
 */
export async function getModuleBySlug(moduleId: string): Promise<ModuleBasicInfo | null> {
    console.log(`Module Service: Fetching module data for slug: ${moduleId}`);
    try {
        const supabase = createServerSupabaseClient(); // Client serveur créé ici
        const { data, error } = await supabase
            .from('modules') // Assurez-vous que la table s'appelle 'modules'
            .select('slug, title, description, level') // Sélectionnez les colonnes nécessaires
            .eq('slug', moduleId) // Filtrer par SLUG
            .maybeSingle(); // Utiliser maybeSingle si le slug est unique

        if (error) { throw error; } // Lancer l'erreur Supabase
        if (!data) { return null; } // Module non trouvé

        // Mapper les données de la DB vers notre type (ajuste les noms si nécessaire)
        return {
            slug: data.slug,
            title: data.title,
            description: data.description ?? 'Aucune description disponible.', // Fournir une valeur par défaut
            level: data.level,
        };
    } catch (error) {
        console.error(`Error fetching module by slug [${moduleId}]:`, error);
        return null; // Retourner null en cas d'erreur
    }
}


/**
 * Récupère les leçons d'un module AVEC le statut de complétion pour un utilisateur.
 * C'est la fonction que la page /modules/[moduleId] devrait appeler.
 */
export async function getModuleLessons(moduleId: string, userId: string | null): Promise<ModuleWithLessons | null> {
    console.log(`Module Service: Fetching lessons for module ${moduleId}, User=${userId ?? 'N/A'}`);
    try {
        const supabase = createServerSupabaseClient();

        // 1. Récupérer les infos du module (similaire à getModuleBySlug)
        const { data: moduleData, error: moduleError } = await supabase
            .from('modules')
            .select('slug, title, description, level') // Et autres champs nécessaires
            .eq('slug', moduleId)
            .maybeSingle();

        if (moduleError) throw moduleError;
        if (!moduleData) return null; // Module non trouvé

        // 2. Récupérer TOUTES les leçons de ce module, triées par ordre
        const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons') // Assurez-vous que la table s'appelle 'lessons'
            .select('slug, title, order') // Sélectionnez les colonnes nécessaires
            .eq('module_slug', moduleId) // Filtrer par module_slug
            .order('order', { ascending: true });

        if (lessonsError) throw lessonsError;
        const lessons = lessonsData || [];
        const totalLessons = lessons.length;

        // 3. Récupérer la progression de l'utilisateur pour ces leçons (si connecté)
        let completedSlugs = new Set<string>();
        if (userId && totalLessons > 0) {
            const lessonUniqueSlugs = lessons.map(l => `${moduleId}/${l.slug}`); // Format "moduleSlug/lessonSlug"

            const { data: progressData, error: progressError } = await supabase
                .from('user_progress')
                .select('item_slug') // Sélectionner seulement le slug
                .eq('user_id', userId)
                .eq('item_type', 'lesson')
                .eq('status', 'completed') // Ou vérifiez completed_at IS NOT NULL
                .in('item_slug', lessonUniqueSlugs); // Filtrer par les leçons de ce module

            if (progressError) {
                console.error("Error fetching user progress for module lessons:", progressError);
                // Continuer sans les données de progression en cas d'erreur
            } else if (progressData) {
                // Extraire uniquement le slug de la leçon de item_slug
                completedSlugs = new Set(progressData.map(p => p.item_slug.split('/')[1]));
            }
        }

        // 4. Calculer la progression et trouver la prochaine leçon
        const completedLessonsCount = completedSlugs.size;
        const completionPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

        let nextLessonSlug: string | null = null;
        const moduleLessonsWithStatus: ModuleLessonInfo[] = lessons.map(lesson => {
            const isCompleted = completedSlugs.has(lesson.slug);
            // Trouver la première leçon non complétée
            if (!isCompleted && nextLessonSlug === null) {
                nextLessonSlug = lesson.slug;
            }
            return {
                slug: lesson.slug,
                title: lesson.title ?? 'Leçon sans titre',
                order: lesson.order ?? 0,
                isCompleted: isCompleted,
            };
        });

        // 5. Construire l'objet de retour final
        const result: ModuleWithLessons = {
            slug: moduleData.slug,
            title: moduleData.title,
            description: moduleData.description ?? '',
            level: moduleData.level,
            lessons: moduleLessonsWithStatus,
            completionPercent: completionPercent,
            nextLessonSlug: nextLessonSlug,
            // TODO: Ajouter la logique pour déterminer si le module est verrouillé (isLocked)
            // basée sur les prérequis ou la complétion des modules précédents.
            isLocked: false, // Placeholder
        };

        return result;

    } catch (error) {
        console.error(`Error fetching module lessons [${moduleId}]:`, error);
        return null;
    }
}


// Les fonctions getPaginatedLessons et getModuleProgress peuvent être supprimées
// si getModuleLessons couvre les besoins, ou être adaptées si vous avez
// réellement besoin de pagination ou juste du % de progression séparément.
// Assurez-vous de corriger l'import Supabase et le filtrage par slug si vous les gardez.