import { test, expect, Page } from '@playwright/test';

test.describe('Parcours d\'apprentissage', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Aller à la page d'accueil et se connecter
    await page.goto('/');
    
    // Simuler la connexion (dans un environnement de test)
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Vérifier que nous sommes redirigés vers le tableau de bord
    await expect(page).toHaveURL('/student/dashboard');
  });

  test('Parcours complet d\'une leçon', async ({ page }: { page: Page }) => {
    // Accéder à la feuille de route d'apprentissage
    await page.click('a[href="/student/roadmap"]');
    await expect(page).toHaveURL('/student/roadmap');
    
    // Sélectionner le premier module
    await page.click('a[href^="/student/learn/"]');
    
    // Vérifier que nous sommes sur la page du module
    await expect(page.locator('h1')).toContainText('Module');
    
    // Cliquer sur la première leçon
    await page.click('a[href*="/lesson-"]');
    
    // Vérifier que nous sommes sur la page de la leçon
    await expect(page.locator('h1')).toContainText('Leçon');
    
    // Faire défiler la page pour simuler la lecture
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(1000); // Attendre un peu pour simuler la lecture
    
    // Interagir avec un exemple de code s'il existe
    const codeBlock = page.locator('.code-block button');
    if (await codeBlock.count() > 0) {
      await codeBlock.first().click(); // Cliquer sur le bouton "Copier" par exemple
    }
    
    // Compléter un quiz s'il existe
    const quizOption = page.locator('.interactive-quiz button:has-text("Vérifier")');
    if (await quizOption.count() > 0) {
      // Sélectionner une option
      await page.click('.interactive-quiz div[role="radio"]');
      await quizOption.click();
      
      // Passer à la question suivante s'il y en a une
      const nextButton = page.locator('button:has-text("Question suivante")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
      }
      
      // Terminer le quiz
      await page.click('button:has-text("Continuer")');
    }
    
    // Faire défiler jusqu'au bouton de complétion
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Marquer la leçon comme terminée
    await page.click('button:has-text("Marquer comme terminé")');
    
    // Vérifier que la célébration apparaît
    await expect(page.locator('text=Félicitations')).toBeVisible();
    
    // Continuer vers la leçon suivante
    await page.click('button:has-text("Continuer")');
    
    // Vérifier que nous sommes sur une nouvelle page de leçon
    await expect(page.url()).toContain('/lesson-');
  });

  test('Navigation entre les modules et les leçons', async ({ page }: { page: Page }) => {
    // Accéder à la feuille de route
    await page.goto('/student/roadmap');
    
    // Vérifier que les modules sont affichés
    await expect(page.locator('.module-card')).toHaveCount(1);
    
    // Accéder à un module
    await page.click('.module-card >> nth=0');
    
    // Vérifier que la liste des leçons est affichée
    await expect(page.locator('.lesson-item')).toHaveCount(1);
    
    // Tester la navigation avec la barre de progression
    const progressNav = page.locator('.module-progress a');
    if (await progressNav.count() > 0) {
      await progressNav.first().click();
      
      // Vérifier que nous sommes sur une page de leçon
      await expect(page.url()).toContain('/lesson-');
    }
    
    // Tester le retour au module
    await page.click('a:has-text("Retour au module")');
    await expect(page.url()).not.toContain('/lesson-');
  });

  test('Tableau de bord affiche correctement la progression', async ({ page }: { page: Page }) => {
    // Accéder au tableau de bord
    await page.goto('/student/dashboard');
    
    // Vérifier que les éléments clés sont présents
    await expect(page.locator('text=Progression globale')).toBeVisible();
    await expect(page.locator('text=Points')).toBeVisible();
    await expect(page.locator('text=Niveau')).toBeVisible();
    
    // Vérifier que les modules en cours sont affichés
    await expect(page.locator('text=Vos modules en cours')).toBeVisible();
    
    // Cliquer sur un module en cours
    const moduleCard = page.locator('a[href^="/student/learn/"]');
    if (await moduleCard.count() > 0) {
      await moduleCard.first().click();
      
      // Vérifier que nous sommes redirigés vers la page du module
      await expect(page.url()).toContain('/learn/');
    }
  });
});
