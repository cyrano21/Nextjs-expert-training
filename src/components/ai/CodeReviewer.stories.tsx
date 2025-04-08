import type { Meta, StoryObj } from '@storybook/react';
import { CodeReviewer } from './CodeReviewer';

const meta: Meta<typeof CodeReviewer> = {
  title: 'AI/CodeReviewer',
  component: CodeReviewer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'Le code à analyser',
    },
    suggestions: {
      control: 'object',
      description: 'Les suggestions d\'amélioration du code',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeReviewer>;

export const WithInfoSuggestions: Story = {
  args: {
    code: `import React from 'react';

function Welcome() {
  return <h1>Bonjour</h1>;
}

export default Welcome;`,
    suggestions: [
      {
        line: 3,
        originalCode: 'function Welcome() {',
        suggestedCode: 'function Welcome({ name }) {',
        explanation: 'Vous pourriez ajouter un paramètre pour rendre ce composant plus réutilisable.',
        severity: 'info',
      },
      {
        line: 4,
        originalCode: '  return <h1>Bonjour</h1>;',
        suggestedCode: '  return <h1>Bonjour {name}</h1>;',
        explanation: 'Utilisez le paramètre name pour personnaliser le message.',
        severity: 'info',
      },
    ],
  },
};

export const WithWarnings: Story = {
  args: {
    code: `import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data);
      });
  }, []);
  
  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default DataFetcher;`,
    suggestions: [
      {
        line: 9,
        originalCode: '        console.log(data);',
        suggestedCode: '        // Données reçues de l\'API',
        explanation: 'Évitez de laisser des console.log dans votre code de production.',
        severity: 'warning',
      },
      {
        line: 6,
        originalCode: '    fetch(\'https://api.example.com/data\')',
        suggestedCode: '    try {\n      fetch(\'https://api.example.com/data\')',
        explanation: 'Ajoutez un bloc try/catch pour gérer les erreurs potentielles lors de la récupération des données.',
        severity: 'warning',
      },
    ],
  },
};

export const WithErrors: Story = {
  args: {
    code: `import React from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}

export default Counter;`,
    suggestions: [
      {
        line: 1,
        originalCode: 'import React from \'react\';',
        suggestedCode: 'import React, { useState } from \'react\';',
        explanation: 'Vous utilisez useState mais vous ne l\'avez pas importé.',
        severity: 'error',
      },
      {
        line: 8,
        originalCode: '      <button onClick={() => setCount(count + 1)}>',
        suggestedCode: '      <button onClick={() => setCount((prevCount) => prevCount + 1)}>',
        explanation: 'Utilisez la forme fonctionnelle de setCount pour éviter les problèmes de fermeture (closure).',
        severity: 'warning',
      },
    ],
  },
};
