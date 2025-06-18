import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Créer le middleware d'internationalisation avec une gestion explicite des routes
const intlMiddleware = createMiddleware({
  // Liste des locales supportées
  locales: ['fr', 'en'],
  // Locale par défaut
  defaultLocale: 'fr',
  // Ne pas utiliser la détection automatique pour éviter les conflits
  localeDetection: false
});

// Exporter un middleware personnalisé qui enveloppe le middleware d'internationalisation
export default function middleware(request: NextRequest) {
  // Vérifier que la route existe avant d'appliquer le middleware d'internationalisation
  const pathname = request.nextUrl.pathname;
  
  // Gérer explicitement le cas où l'URL racine est demandée
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/fr'; // Rediriger vers la locale par défaut
    return NextResponse.redirect(url);
  }
  
  // Pour toutes les autres routes, utiliser le middleware d'internationalisation
  return intlMiddleware(request);
};

// Configuration du matcher pour décider quelles routes traiter
export const config = {
  // Exclure les routes API, _next, et les fichiers avec extension
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
