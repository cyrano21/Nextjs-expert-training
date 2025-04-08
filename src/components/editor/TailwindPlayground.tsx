import React, { useState, useEffect } from 'react';
import { MonacoEditor } from './MonacoEditor';

interface TailwindPlaygroundProps {
  defaultHtml?: string;
  defaultCss?: string;
  height?: string;
  showPreview?: boolean;
}

export function TailwindPlayground({
  defaultHtml = '<div class="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">\n  <div class="flex-shrink-0">\n    <div class="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">T</div>\n  </div>\n  <div>\n    <div class="text-xl font-medium text-black">Tailwind CSS</div>\n    <p class="text-gray-500">Playground interactif</p>\n  </div>\n</div>',
  defaultCss = '',
  height = '400px',
  showPreview = true
}: TailwindPlaygroundProps) {
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Combiner HTML et CSS pour la prévisualisation
    const combinedOutput = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${css}</style>
        </head>
        <body class="bg-gray-100 dark:bg-gray-900">
          ${html}
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  }, [html, css]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">HTML</h3>
            <div className="text-xs text-muted-foreground">
              Utilisez les classes Tailwind CSS
            </div>
          </div>
          <MonacoEditor
            defaultLanguage="html"
            value={html}
            onChange={(value) => setHtml(value || '')}
            height={height}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">CSS personnalisé (optionnel)</h3>
            <div className="text-xs text-muted-foreground">
              Styles additionnels
            </div>
          </div>
          <MonacoEditor
            defaultLanguage="css"
            value={css}
            onChange={(value) => setCss(value || '')}
            height={height}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      </div>
      
      {showPreview && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Prévisualisation</h3>
          <div className="rounded-md border bg-white dark:bg-gray-950 h-[400px] overflow-auto">
            <iframe
              title="Tailwind Preview"
              srcDoc={output}
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
}
