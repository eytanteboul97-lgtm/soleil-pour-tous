-- Soleil Pour Tous — schéma Supabase pour la persistance des leads.
--
-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (Project → SQL Editor → New query → coller ce fichier → Run).
--
-- Sécurité : RLS est activé sans aucune policy pour anon/authenticated —
-- seule la clé "service_role" (utilisée uniquement côté serveur, jamais
-- exposée au navigateur) peut lire ou écrire dans cette table. Aucun accès
-- client direct à Supabase n'est prévu dans ce projet.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- "early" = coordonnées laissées en cours de parcours (voir /api/lead-early),
  -- "complet" = parcours de qualification terminé (voir /api/lead).
  kind text not null check (kind in ('early', 'complet')),

  -- Calculée côté serveur à l'insertion — voir lib/lead-classification.ts.
  classification text not null default 'a_approfondir'
    check (classification in ('prioritaire', 'a_approfondir', 'non_qualifie')),

  type_travaux text[] not null default '{}',

  prenom text,
  email text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  -- Dérivé de code_postal (2 premiers chiffres) pour faciliter les
  -- regroupements par département dans le dashboard.
  departement text,

  statut_occupation text,
  type_logement text,
  nombre_personnes text,
  type_chauffage text,
  facture_mensuelle numeric,
  revenu_fiscal numeric,
  surface_toiture numeric,
  orientation_toit text,

  consentement boolean not null default false,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  gclid text,

  -- Copie intégrale du payload reçu, pour ne jamais perdre une information
  -- si le schéma évolue plus vite que les colonnes dédiées ci-dessus.
  raw jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_classification_idx on public.leads (classification);
create index if not exists leads_departement_idx on public.leads (departement);

alter table public.leads enable row level security;
-- Aucune policy créée intentionnellement : anon/authenticated n'ont aucun
-- accès ; seule la clé service_role (serveur uniquement) peut lire/écrire.
