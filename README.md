# Soleil Pour Tous

Landing page de prospection pour l'installation de panneaux photovoltaïques
en France. Site marketing haute conversion : simulateur d'éligibilité,
formulaire de lead multi-étapes, tableau des aides disponibles, simulateur
d'économies, FAQ.

Ce projet est indépendant du site sefa.is présent à la racine de ce repo —
identité de marque, palette et composants distincts.

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

## Brancher un CRM / webhook / Airtable / Google Sheets / email

Le formulaire de lead poste déjà vers `app/api/lead/route.ts`, qui valide les
données côté serveur avec le même schéma Zod que le frontend
(`lib/lead-schema.ts`). L'intégration réelle est à ajouter dans ce fichier,
à l'endroit marqué par le commentaire `TODO(intégration backend)` — il
suffit d'y ajouter l'appel vers le CRM, le webhook ou le service choisi.

## Déploiement (Netlify)

Ce dossier contient son propre `netlify.toml`. Si ce site est déployé comme
un site Netlify séparé du site sefa.is racine, configurer le champ **Base
directory** du site Netlify sur `soleil-pour-tous` pour que ce fichier de
config et ce `package.json` soient pris en compte.

## Contenu légal

`app/mentions-legales` et `app/politique-confidentialite` contiennent des
gabarits RGPD/mentions légales avec des champs `[Raison sociale]`,
`[SIREN/SIRET]`, etc. à compléter avec les informations réelles de la
société avant mise en ligne définitive.
