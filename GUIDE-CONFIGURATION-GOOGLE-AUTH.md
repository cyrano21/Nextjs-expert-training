{"message":"No API key found in request","hint":"No `apikey` request header or url param was found."}# Guide de configuration de l'authentification Google avec Supabase

## Problème identifié

Vous rencontrez l'erreur suivante lors de la tentative de connexion avec Google :

```
https://xurpenqrhqwtdkmmkkyp.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fcallback
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

Cette erreur indique que le fournisseur d'authentification Google n'est pas activé dans votre projet Supabase.

## Solution : Configuration de l'authentification Google dans Supabase

### Étape 1 : Créer un projet OAuth dans Google Cloud Console

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Dans le menu de navigation, allez à "APIs & Services" > "Credentials"
4. Cliquez sur "+ CREATE CREDENTIALS" et sélectionnez "OAuth client ID"
5. Si c'est votre première fois, vous devrez configurer l'écran de consentement OAuth :
   - Sélectionnez le type d'utilisateur (Externe ou Interne)
   - Remplissez les informations requises (nom de l'application, email de contact, etc.)
   - Ajoutez les domaines autorisés (incluant votre domaine Supabase et localhost pour le développement)
   - Sauvegardez et continuez
6. Pour créer l'ID client OAuth :
   - Sélectionnez "Web application" comme type d'application
   - Donnez un nom à votre client OAuth
   - Ajoutez les URIs de redirection autorisés :
     ```
     https://xurpenqrhqwtdkmmkkyp.supabase.co/auth/v1/callback
     http://localhost:4000/api/auth/callback
     ```
   - Cliquez sur "Create"
7. Notez votre **Client ID** et votre **Client Secret** qui seront affichés

### Étape 2 : Configurer Google OAuth dans Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet (xurpenqrhqwtdkmmkkyp)
3. Dans le menu de navigation, allez à "Authentication" > "Providers"
4. Trouvez "Google" dans la liste des fournisseurs
5. Activez le toggle pour activer Google
6. Entrez votre **Client ID** et **Client Secret** obtenus à l'étape précédente
7. Dans la section "Redirect URL", vous verrez l'URL de redirection que vous devez ajouter dans la console Google Cloud
8. Cliquez sur "Save" pour enregistrer les modifications

### Étape 3 : Vérifier la configuration dans votre application

Votre code actuel dans `auth-context.tsx` semble correct :

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  
  if (error) {
    console.error('Erreur lors de la connexion avec Google:', error);
  }
};
```

Assurez-vous que l'URL de redirection correspond exactement à celle que vous avez configurée dans Google Cloud Console.

### Étape 4 : Tester l'authentification

1. Lancez votre application en mode développement
2. Essayez de vous connecter avec Google
3. Vous devriez être redirigé vers l'écran de connexion Google, puis revenir à votre application après authentification

## Dépannage

Si vous rencontrez toujours des problèmes après avoir suivi ces étapes :

1. Vérifiez les journaux côté client et côté serveur pour des erreurs spécifiques
2. Assurez-vous que les URIs de redirection sont exactement les mêmes dans Google Cloud Console et dans votre code
3. Vérifiez que l'API Google+ est activée dans votre projet Google Cloud
4. Assurez-vous que votre écran de consentement OAuth est correctement configuré
5. Vérifiez que votre application utilise bien les variables d'environnement correctes pour Supabase

## Ressources supplémentaires

- [Documentation Supabase sur l'authentification Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Documentation Google sur OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)