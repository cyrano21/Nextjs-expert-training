// Créer ce fichier pour exporter tous les composants MDX nécessaires
import React from "react";

// InfoTip component
export function InfoTip({ children, type = "info", title = "" }) {
  const types = {
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      icon: "💡",
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      icon: "⚠️",
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      icon: "✅",
    },
    idea: {
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      icon: "💭",
    },
  };

  const style = types[type] || types.info;

  return (
    <div
      className={`p-4 my-4 rounded-md border ${style.borderColor} ${style.bgColor}`}
    >
      {title && (
        <div className={`font-bold mb-1 ${style.textColor}`}>
          {style.icon} {title}
        </div>
      )}
      <div className={style.textColor}>{children}</div>
    </div>
  );
}

// CodeBlock component
export function CodeBlock({
  children,
  language = "javascript",
  title = "",
  allowCopy = false,
}) {
  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-200">
      {title && (
        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-sm font-medium">
          {title}
        </div>
      )}
      <pre className={`p-4 bg-gray-50 overflow-x-auto`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
      {allowCopy && (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 text-right">
          <button className="text-xs text-gray-600 hover:text-gray-900">
            Copier
          </button>
        </div>
      )}
    </div>
  );
}

// Quiz component (simple version)
export function Quiz({
  questionId,
  question,
  options,
  correctAnswer,
  explanation,
}) {
  return (
    <div className="my-6 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-3">{question}</h3>
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${questionId}-option-${index}`}
              name={questionId}
              value={index}
              className="mr-2"
            />
            <label htmlFor={`${questionId}-option-${index}`}>{option}</label>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100 hidden">
        <p className="font-medium">Explication :</p>
        <p>{explanation}</p>
      </div>
    </div>
  );
}

// Simple components
export function ProjectStep({ title, id, children }) {
  return (
    <div className="my-4 border-l-4 border-blue-400 pl-4">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

export function TerminalOutput({ children, title = "Terminal" }) {
  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-300">
      <div className="bg-gray-800 text-white px-4 py-1 text-sm">{title}</div>
      <pre className="p-4 bg-black text-green-400 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

// Exporter d'autres composants au besoin...
export function AchievementUnlocked({ title, points, children }) {
  /* ... */
}
export function FileTree({ children }) {
  /* ... */
}
export function DraggableMatch({ items, targets, correctMatches, feedback }) {
  /* ... */
}
export function InteractiveCodeMatcher({ pairs, options, correctMapping }) {
  /* ... */
}
export function BrowserInteractionGuide({ steps }) {
  /* ... */
}
