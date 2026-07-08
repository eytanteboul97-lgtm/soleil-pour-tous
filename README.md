# Soleil Pour Tous

Landing page de prospection pour l'installation de panneaux photovoltaïques
en France. Site marketing haute conversion : simulateur d'éligibilité,
formulaire de lead multi-étapes, tableau des aides disponibles, simulateur
d'économies, FAQ.

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

### Brancher un CRM / webhook / Airtable / Google Sheets en plus

`app/api/lead/route.ts` contient un second point d'extension, marqué
`TODO(intégration CRM optionnelle)`, pour envoyer le lead vers un autre
système en plus de l'email (HubSpot, Pipedrive, Airtable, Google Sheets via
Apps Script, un webhook Zapier/Make...).

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
