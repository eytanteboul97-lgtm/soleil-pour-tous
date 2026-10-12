# Soleil Pour Tous

Plateforme de détection des aides à la rénovation énergétique et
d'adaptation du logement en France (CEE, MaPrimeRénov', MaPrimeAdapt',
solaire...) : simulateur de qualification multi-étapes, capture de leads
anticipée, tableau de bord admin, tracking Meta Pixel/Conversions API et
Google Analytics 4.

Ce projet vit dans son propre repo, entièrement indépendant du site sefa.is
(identité de marque, palette et composants distincts).

## Stack

Next.js 15 (App Router) + React 18 + TypeScript + Tailwind CSS, Framer
Motion pour les animations, Radix UI pour les primitives accessibles
(select, checkbox, accordion), React Hook Form + Zod pour la validation du
formulaire.

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Recevoir les leads par email (Resend)

Chaque soumission du formulaire déclenche un email de notification (via
[Resend](https://resend.com)) contenant toutes les informations du
prospect, avec le champ "Répondre à" déjà réglé sur son adresse — vous
pouvez lui répondre directement depuis votre boîte mail.

Pour l'activer :

1. Créer un compte gratuit sur [resend.com](https://resend.com) (aucune
   carte bancaire requise, 3000 emails/mois inclus).
2. Dans **API Keys**, cliquer sur **Create API Key** et copier la clé.
3. Définir les variables d'environnement (voir `.env.example`) :
   - `RESEND_API_KEY` — la clé créée à l'étape 2.
   - `LEAD_NOTIFICATION_EMAIL` — l'adresse qui doit recevoir les leads.
   - `LEAD_FROM_EMAIL` (optionnel) — une fois un nom de domaine vérifié
     dans Resend, l'adresse d'expédition personnalisée à utiliser à la
     place de `onboarding@resend.dev`.
4. Sur Netlify : **Site configuration → Environment variables**, ajouter
   ces mêmes variables, puis redéployer.

Sans ces variables, le site fonctionne normalement (le formulaire valide et
affiche l'écran de succès) mais aucun email n'est envoyé — un avertissement
est simplement écrit dans les logs serveur pour ne pas perdre le signal
silencieusement.

## Persistance des leads + tableau de bord (Supabase)

En plus de l'email, chaque lead peut être enregistré dans une base Supabase
et consulté dans un tableau de bord `/admin` (visiteurs, taux de
complétion, répartition par catégorie/département/qualification, leads
récents).

Pour l'activer :

1. Créer un compte gratuit sur [supabase.com](https://supabase.com) et un
   nouveau projet (gratuit jusqu'à 500 Mo, largement suffisant pour
   démarrer).
2. Dans **SQL Editor**, coller le contenu de `supabase/schema.sql` et
   l'exécuter (crée la table `leads` avec RLS activé).
3. Dans **Project Settings → API**, récupérer :
   - `SUPABASE_URL` — l'URL du projet.
   - `SUPABASE_SERVICE_ROLE_KEY` — la clé **service_role** (jamais la clé
     "anon" : service_role est nécessaire côté serveur et ne doit **jamais**
     être exposée au navigateur).
4. Définir un mot de passe pour le dashboard : `ADMIN_PASSWORD` (choisissez
   une valeur longue et unique, ce n'est pas votre mot de passe personnel).
5. Ajouter ces 3 variables sur Netlify (**Site configuration → Environment
   variables**), puis redéployer.

Le dashboard est accessible sur `/admin` (redirige vers `/admin/login` tant
qu'on n'est pas connecté). Sans ces variables, le site fonctionne
normalement — les leads continuent de partir par email, simplement sans
tableau de bord.

## Tracking (Meta Pixel, Conversions API, Google Analytics 4)

Le Meta Pixel est déjà actif (ID en dur dans `app/layout.tsx`). Deux
compléments optionnels :

- **Meta Conversions API** — renvoie l'événement "Lead" depuis le serveur en
  plus du pixel navigateur (plus fiable face aux bloqueurs de pub et à
  Safari ITP). Dans **Meta Events Manager → votre pixel → Paramètres →
  Conversions API**, générer un jeton d'accès, puis définir
  `META_CONVERSIONS_API_ACCESS_TOKEN` sur Netlify.
- **Google Analytics 4** — définir `NEXT_PUBLIC_GA4_ID` (format
  `G-XXXXXXXXXX`, trouvable dans **Admin → Flux de données** de votre
  propriété GA4) sur Netlify.

Sans ces variables, le site fonctionne normalement avec le seul Pixel Meta
navigateur.

## Déploiement (Netlify)

Le repo contient un `netlify.toml` à la racine (`npm run build` +
`@netlify/plugin-nextjs`). Sur Netlify : **Add new site → Import an existing
project** → sélectionner ce repo. Aucun champ "Base directory" ou "Publish
directory" à renseigner — laisser les réglages par défaut, tout est déjà à
la racine.

## Contenu légal

`app/mentions-legales` et `app/politique-confidentialite` contiennent des
gabarits RGPD/mentions légales avec des champs `[Raison sociale]`,
`[SIREN/SIRET]`, etc. à compléter avec les informations réelles de la
société avant mise en ligne définitive.
