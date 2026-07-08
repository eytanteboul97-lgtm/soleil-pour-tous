"use client";

import { useEffect } from "react";

// Chargé à la demande (uniquement quand le champ adresse reçoit le focus, et
// seulement si une clé est configurée) pour ne jamais peser sur le chargement
// initial de la page. Sans clé, ou en cas d'échec réseau, le champ reste une
// simple saisie manuelle — aucune dépendance bloquante.
type AddressResult = {
  adresse: string;
  codePostal: string;
  ville: string;
};

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: Record<string, unknown>
          ) => {
            getPlace: () => {
              address_components?: { long_name: string; types: string[] }[];
            };
            addListener: (event: string, handler: () => void) => void;
          };
        };
        event: { clearInstanceListeners: (instance: unknown) => void };
      };
    };
  }
}

let loadPromise: Promise<void> | null = null;

function loadGooglePlaces(apiKey: string): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("google-places-load-failed"));
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

function extractAddress(
  components: { long_name: string; types: string[] }[]
): AddressResult {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";
  const streetNumber = get("street_number");
  const route = get("route");
  const city = get("locality") || get("postal_town");
  return {
    adresse: [streetNumber, route].filter(Boolean).join(" "),
    codePostal: get("postal_code"),
    ville: city,
  };
}

export function useAddressAutocomplete(
  active: boolean,
  inputId: string,
  onResolved: (result: AddressResult) => void
) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!active || !apiKey) return;

    let cancelled = false;
    let instance: InstanceType<
      NonNullable<Window["google"]>["maps"]["places"]["Autocomplete"]
    > | null = null;

    loadGooglePlaces(apiKey)
      .then(() => {
        if (cancelled) return;
        const input = document.getElementById(inputId);
        if (!(input instanceof HTMLInputElement) || !window.google) return;

        instance = new window.google.maps.places.Autocomplete(input, {
          types: ["address"],
          componentRestrictions: { country: "fr" },
          fields: ["address_components"],
        });
        instance.addListener("place_changed", () => {
          const place = instance!.getPlace();
          if (!place.address_components) return;
          onResolved(extractAddress(place.address_components));
        });
      })
      .catch(() => {
        // Pas de clé valide ou API injoignable : on reste en saisie manuelle.
      });

    return () => {
      cancelled = true;
      if (instance) window.google?.maps.event.clearInstanceListeners(instance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inputId]);
}
