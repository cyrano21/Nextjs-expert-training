import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/services/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Récupérer les données de la requête
    const { question, context, lessonId } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'La question est requise' },
        { status: 400 }
      );
    }
    
    // Enregistrer la question dans la base de données pour analyse future
    await supabase.from('mentor_questions').insert({
      user_id: session.user.id,
      question,
      context,
      lesson_id: lessonId,
      created_at: new Date().toISOString()
    });
    
    // Simuler une réponse du mentor IA (dans un environnement réel, cela appellerait un service d'IA)
    const mentorResponse = {
      answer: `Voici ma réponse à votre question: "${question}". ${generateMentorResponse(question)}`,
      relatedResources: getRelatedResources(question),
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(mentorResponse);
  } catch (error) {
    console.error('Erreur dans l\'API mentor:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre question' },
      { status: 500 }
    );
  }
}

// Fonction de simulation pour générer une réponse
function generateMentorResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('next.js')) {
    return "Next.js est un framework React qui permet de créer des applications web complètes. Il offre des fonctionnalités comme le rendu côté serveur (SSR), la génération de sites statiques (SSG), et un système de routage basé sur le système de fichiers. C'est un excellent choix pour développer des applications web modernes et performantes.";
  } else if (lowerQuestion.includes('react')) {
    return "React est une bibliothèque JavaScript pour créer des interfaces utilisateur. Elle est basée sur le concept de composants réutilisables, ce qui facilite la création d'applications web complexes. React utilise un DOM virtuel pour optimiser les performances de rendu.";
  } else if (lowerQuestion.includes('api')) {
    return "Les API Routes dans Next.js vous permettent de créer des API RESTful directement dans votre application Next.js. Elles sont définies dans le dossier 'app/api' et sont isolées du code frontend, ce qui vous permet de créer des endpoints sécurisés pour vos applications.";
  } else {
    return "C'est une excellente question ! Pour approfondir ce sujet, je vous recommande de consulter la documentation officielle de Next.js ou de parcourir les modules correspondants dans votre parcours d'apprentissage.";
  }
}

// Fonction pour suggérer des ressources pertinentes
function getRelatedResources(question: string) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('next.js')) {
    return [
      {
        title: "Documentation officielle de Next.js",
        url: "https://nextjs.org/docs",
        type: "documentation"
      },
      {
        title: "Tutoriel Next.js",
        url: "https://nextjs.org/learn",
        type: "tutorial"
      }
    ];
  } else if (lowerQuestion.includes('react')) {
    return [
      {
        title: "Documentation React",
        url: "https://reactjs.org/docs/getting-started.html",
        type: "documentation"
      }
    ];
  } else {
    return [
      {
        title: "Centre de ressources Next.js",
        url: "https://nextjs.org/resources",
        type: "documentation"
      }
    ];
  }
}
