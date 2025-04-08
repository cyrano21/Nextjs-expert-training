"use client";

import React from 'react';
import { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

// Définition de types plus précis pour éviter les références circulaires
type MonacoEditorType = editor.IStandaloneCodeEditor;
type MonacoType = Monaco;

interface MonacoEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  width?: string;
  theme?: 'vs-dark' | 'light';
  options?: Record<string, unknown>;
  onMount?: (editor: MonacoEditorType, monaco: MonacoType) => void;
}

export const MonacoEditor = ({
  defaultLanguage = 'javascript',
  defaultValue = '',
  value,
  onChange,
  height = '400px',
  width = '100%',
  theme = 'vs-dark',
  options = {},
  onMount
}: MonacoEditorProps) => {
  const editorRef = useRef<MonacoEditorType | null>(null);
  const monacoRef = useRef<MonacoType | null>(null);

  useEffect(() => {
    // Configurer les options par défaut pour l'éditeur
    if (monacoRef.current) {
      monacoRef.current.editor.defineTheme('nextjs-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1a1b26',
        }
      });
    }
  }, []);

  // Nettoyer l'éditeur lors du démontage
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configurer l'éditeur après le montage
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      ...options
    });

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  // Gérer les changements de valeur
  const handleEditorChange: OnChange = (value) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height={height}
      width={width}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      value={value}
      theme={theme === 'vs-dark' ? 'nextjs-dark' : 'light'}
      options={options}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
    />
  );
}
