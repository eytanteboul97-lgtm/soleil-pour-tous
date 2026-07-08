import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";

const QUESTIONS = [
  {
    question: "Suis-je vraiment éligible aux aides ?",
    answer:
      "Cela dépend de votre revenu fiscal de référence, du type de logement et des travaux envisagés. Votre conseiller virtuel vérifie votre profil en quelques minutes et vous donne une première estimation ; l'éligibilité définitive est confirmée lors de l'étude technique.",
  },
  {
    question: "L'étude est-elle vraiment gratuite ?",
    answer:
      "Oui. L'étude d'éligibilité et la simulation personnalisée sont entièrement gratuites, quel que soit le résultat, et ne vous engagent à rien.",
  },
  {
    question: "Dois-je m'engager en répondant au questionnaire ?",
    answer:
      "Non. Répondre aux questions du conseiller virtuel ne vous engage à rien. Vous restez entièrement libre de donner suite ou non à la proposition transmise ensuite par un conseiller.",
  },
  {
    question: "Combien puis-je économiser ?",
    answer:
      "Cela dépend de votre consommation actuelle, du type de travaux choisi et de votre logement. Le panneau qui s'affiche pendant votre échange avec le conseiller virtuel vous donne une estimation en temps réel à partir de vos réponses ; le montant exact est confirmé lors de l'étude technique.",
  },
  {
    question: "Les aides de l'État sont-elles toujours disponibles ?",
    answer:
      "Oui, plusieurs dispositifs restent actifs (MaPrimeRénov' pour la pompe à chaleur, l'isolation ou le chauffe-eau thermodynamique, TVA réduite pour le photovoltaïque), mais les conditions évoluent régulièrement. Consultez la section « Aides disponibles » ci-dessus — votre conseiller vérifie ce qui s'applique précisément à votre profil.",
  },
  {
    question: "Que se passe-t-il après l'envoi du formulaire ?",
    answer:
      "Un conseiller Soleil Pour Tous vous recontacte au moment que vous avez choisi, pour confirmer votre éligibilité et répondre à vos questions. Si vous le souhaitez, une étude technique à domicile peut ensuite être organisée — aucune signature n'est demandée à ce stade.",
  },
  {
    question: "Combien de temps dure une installation ?",
    answer:
      "Pour la plupart des projets (pompe à chaleur, panneaux solaires, chauffe-eau thermodynamique), l'installation se fait en une à deux journées par des professionnels qualifiés. Les travaux d'isolation ou de rénovation globale peuvent prendre plus de temps selon leur ampleur — le délai exact vous est communiqué après l'étude technique.",
  },
  {
    question: "Puis-je financer mon installation ?",
    answer:
      "Plusieurs solutions de financement peuvent compléter les aides disponibles selon les travaux. Votre conseiller peut en discuter avec vous lors de l'étude — Soleil Pour Tous ne vous impose aucune solution en particulier.",
  },
  {
    question: "Et si mon toit n'est pas adapté au photovoltaïque ?",
    answer:
      "Cela arrive : orientation, ombrage ou état de la toiture peuvent limiter le potentiel solaire. L'étude technique le confirme précisément, et d'autres solutions (pompe à chaleur, isolation) restent pertinentes même sans toiture adaptée.",
  },
  {
    question: "L'entretien d'une installation est-il coûteux ?",
    answer:
      "Les panneaux solaires et les pompes à chaleur modernes demandent très peu d'entretien — un contrôle périodique suffit généralement. Les modalités précises dépendent du matériel installé et vous sont détaillées lors de l'étude.",
  },
  {
    question: "Aurai-je encore de l'électricité en cas de coupure ?",
    answer:
      "Avec une installation photovoltaïque raccordée au réseau et sans batterie, non : par sécurité, l'onduleur interrompt la production pendant une coupure, comme l'exige la réglementation. Une solution avec batterie de stockage peut être étudiée si l'autonomie en cas de coupure compte pour vous.",
  },
  {
    question: "Puis-je revendre mon surplus d'électricité ?",
    answer:
      "Oui, sous conditions, via un contrat d'achat auprès d'un acheteur obligé. Les modalités précises dépendent de la puissance de votre installation et seront détaillées lors de votre étude personnalisée.",
  },
  {
    question: "La prime à l'autoconsommation existe-t-elle encore ?",
    answer:
      "Non, cette prime a été supprimée pour les nouveaux dossiers depuis juin 2026. Elle ne reste applicable que dans certains cas particuliers pour des dossiers déjà validés antérieurement.",
  },
];

// Reflète exactement les questions/réponses visibles ci-dessous — un
// FAQPage schema.org n'est légitime que s'il correspond au contenu réel
// affiché sur la page, condition ici toujours vraie par construction.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FAQ() {
  return (
    <section id="faq" className="anchor-offset bg-paper py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Questions fréquentes
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Vous vous posez des questions ?
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <Accordion type="single" collapsible className="space-y-4">
            {QUESTIONS.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
