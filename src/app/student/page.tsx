/* stylelint-disable */
import React from "react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth/authUtils";

export const metadata = {
  title: "Espace Étudiant | Expert Academy",
  description: "Gérez vos cours et votre apprentissage",
};

export default async function StudentHomePage() {
  // Option 1: If you don't need the session variable, simply call the function without destructuring.
  await getAuthSession("student");

  // Option 2: If you plan to use the session for authentication checks, then you could write something like:
  // const { session } = await getAuthSession("student");
  // if (!session) {
  //   return <p>Vous devez être connecté pour accéder à cet espace.</p>;
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Espace Étudiant</h1>
      <p className="mb-4">
        Bienvenue dans l&apos;espace étudiant de Expert Academy!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/student/courses" className="block">
          <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-xl font-semibold mb-4">Cours</h2>
            <p>Parcourez et gérez vos cours d&apos;apprentissage</p>
          </div>
        </Link>

        <Link href="/student/dashboard" className="block">
          <div className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
            <p>Suivez votre progression et vos réalisations</p>
          </div>
        </Link>

        <Link href="/student/profile" className="block">
          <div className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-xl font-semibold mb-4">Profil</h2>
            <p>Consultez et modifiez vos informations personnelles</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
/* stylelint-enable */
