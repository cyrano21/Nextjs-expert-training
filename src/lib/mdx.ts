// src/lib/mdx.ts
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { CompiledMdxResult } from '@/types/course.types';

export async function getCompiledMdx(
    moduleId: string,
    lessonId: string
): Promise<CompiledMdxResult | null> {
  const filePath = path.join(process.cwd(), 'src', 'content', 'courses', moduleId, `${lessonId}.mdx`);
  try {
    const source = await fs.readFile(filePath, 'utf8');
    const { content, data: frontmatter } = matter(source);

    // Compiler le contenu MDX en string
    try {
      const compiledSource = await compile(content, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
      });
      
      // Retourner l'objet conforme à CompiledMdxResult
      return {
        source: String(compiledSource), // Convertir en string pour le transport
        rawSource: content, // Conserver également le contenu brut
        frontmatter: frontmatter || {},
        scope: {},
      };
    } catch (compileError) {
      console.error(`Erreur lors de la compilation MDX:`, compileError);
      // En cas d'erreur de compilation, retourner le contenu source brut
      return {
        source: '', // Source compilée vide
        rawSource: content, // Contenu brut
        frontmatter: frontmatter || {},
        scope: {},
        error: compileError instanceof Error ? compileError.message : 'Erreur inconnue de compilation MDX'
      };
    }

  } catch (error) {
    console.error(`Erreur lecture fichier MDX (${moduleId}/${lessonId}):`, error);
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        console.warn(`MDX file not found: ${filePath}`);
    }
    return null;
  }
}