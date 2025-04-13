import React from 'react';

export default function TailwindTest() {
  return (
    <div className="m-4 p-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      <h2 className="mt-2 text-center text-2xl font-bold text-gray-800">Tailwind fonctionne!</h2>
      <p className="mt-2 text-center text-gray-600">Si ce composant est stylisé correctement, Tailwind CSS est bien configuré.</p>
    </div>
  );
}