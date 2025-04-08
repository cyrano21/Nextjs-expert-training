import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous pour commencer votre parcours vers l&apos;expertise Next.js
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="first-name"
              >
                Prénom
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="first-name"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="last-name"
              >
                Nom
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="last-name"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="m@example.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 caractères avec au moins une lettre majuscule, une lettre minuscule et un chiffre
            </p>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="confirm-password"
            >
              Confirmer le mot de passe
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="confirm-password"
              type="password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              id="terms"
              type="checkbox"
            />
            <label
              className="text-sm text-muted-foreground"
              htmlFor="terms"
            >
              J&apos;accepte les{" "}
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href="#"
              >
                conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link
                className="text-primary underline-offset-4 hover:underline"
                href="#"
              >
                politique de confidentialité
              </Link>
            </label>
          </div>
          <Button className="w-full" type="submit">
            S&apos;inscrire
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SocialLoginButton provider="github" />
            <SocialLoginButton provider="google" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Vous avez déjà un compte?{" "}
            </span>
            <Link
              className="text-primary underline-offset-4 hover:underline"
              href="/auth/login"
            >
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
