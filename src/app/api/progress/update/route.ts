import { createServerSupabaseClient } from "@/services/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Database } from "@/types/database.types";

// Schéma de validation pour la mise à jour de la progression
const ProgressUpdateSchema = z.object({
  userId: z.string(),
  lessonId: z.string(),
  status: z.enum(["not_started", "in_progress", "completed", "failed"]),
  progressData: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();

  try {
    // Récupérer les données de la requête
    const body = await request.json();

    // Valider les données
    const validationResult = ProgressUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { userId, lessonId, status, progressData } = validationResult.data;

    // Vérifier si un enregistrement de progression existe déjà
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("item_slug", lessonId)
      .eq("item_type", "lesson")
      .single();

    // Préparer les données de mise à jour
    const updateData: Database["public"]["Tables"]["user_progress"]["Insert"] =
      {
        user_id: userId,
        item_slug: lessonId,
        item_type: "lesson",
        status,
        progress_data: progressData ? JSON.stringify(progressData) : null,
        updated_at: new Date().toISOString(),
        started_at: existingProgress?.started_at || new Date().toISOString(),
        completed_at: status === "completed" ? new Date().toISOString() : null,
        id: existingProgress?.id,
      };

    // Upsert (insérer ou mettre à jour) la progression
    const { error } = await supabase.from("user_progress").upsert(updateData, {
      onConflict: "user_id,item_slug,item_type",
    });

    if (error) {
      console.error("Error updating progress:", error);
      return NextResponse.json(
        { error: "Failed to update progress" },
        { status: 500 }
      );
    }

    // Mettre à jour les statistiques globales de progression
    await updateUserProgressStats(supabase, userId);

    return NextResponse.json(
      { message: "Progress updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

import { Json } from "@/types/database.types";

// Fonction pour convertir une valeur en nombre
function safeParseNumber(value: Json): number {
  if (value === null) {
    return 0;
  }

  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "object") {
    return 0; // Return 0 for objects and arrays
  }

  return 0;
}

// Fonction pour mettre à jour les statistiques globales de progression de l'utilisateur
async function updateUserProgressStats(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  userId: string
) {
  try {
    // Récupérer toutes les progressions de l'utilisateur
    const { data: allProgress, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user progress:", error);
      return;
    }

    // Calculer les statistiques
    const stats = {
      total_lessons_completed: allProgress.filter(
        (p: Database["public"]["Tables"]["user_progress"]["Row"]) =>
          p.item_type === "lesson" && p.status === "completed"
      ).length,
      total_modules_completed: allProgress.filter(
        (p: Database["public"]["Tables"]["user_progress"]["Row"]) =>
          p.item_type === "module" && p.status === "completed"
      ).length,
      total_points: allProgress.reduce(
        (
          sum: number,
          p: Database["public"]["Tables"]["user_progress"]["Row"]
        ) => {
          try {
            const progressData = p.progress_data
              ? JSON.parse(p.progress_data as string)
              : {};
            const points = progressData.points;

            return sum + safeParseNumber(points);
          } catch {
            return sum;
          }
        },
        0
      ),
    };

    // Mettre à jour le profil utilisateur avec les statistiques
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        points: stats.total_points,
        current_streak: stats.total_lessons_completed,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("Error updating profile:", profileUpdateError);
    }
  } catch (error) {
    console.error("Error updating user progress stats:", error);
  }
}
