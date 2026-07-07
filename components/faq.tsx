import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";

const QUESTIONS = [
  {
    question: "Est-ce que les panneaux photovoltaïques sont encore rentables ?",
    answer:
      "Oui, sous conditions : orientation et surface de toiture, consommation du foyer et niveau d'ensoleillement de la région influencent directement la rentabilité. Une étude personnalisée permet de le confirmer avant tout engagement.",
  },
  {
    question: "Quelles aides existent aujourd'hui ?",
    answer:
      "Plusieurs dispositifs peuvent s'appliquer selon votre profil : TVA réduite, obligation d'achat du surplus, exonération d'impôt sur le revenu sous conditions, et parfois des aides locales. Consultez la section « Aides disponibles » ci-dessus — elles sont toujours soumises à conditions et évoluent régulièrement.",
  },
  {
    question: "Est-ce que la prime à l'autoconsommation existe encore ?",
    answer:
      "Non, cette prime a été supprimée pour les nouveaux dossiers depuis juin 2026. Elle ne reste applicable que dans certains cas particuliers pour des dossiers déjà validés antérieurement.",
  },
  {
    question: "Puis-je revendre mon surplus d'électricité ?",
    answer:
      "Oui, sous conditions, via un contrat d'achat auprès d'un acheteur obligé. Les modalités précises dépendent de la puissance de votre installation et seront détaillées lors de votre étude personnalisée.",
  },
  {
    question: "Combien coûte une installation ?",
    answer:
      "Le coût dépend de la puissance installée, du type de toiture et des équipements choisis. Le simulateur ci-dessus donne une première estimation indicative ; le montant exact est communiqué après étude technique gratuite.",
  },
  {
    question: "Est-ce que l'étude est gratuite ?",
    answer:
      "Oui, l'étude d'éligibilité et la simulation personnalisée proposées par Soleil Pour Tous sont entièrement gratuites et sans engagement.",
  },
  {
    question: "Suis-je obligé de signer après la simulation ?",
    answer:
      "Non, absolument aucun engagement n'est requis. Vous restez libre de donner suite ou non à l'estimation transmise par votre conseiller.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="anchor-offset bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-600">
            Questions fréquentes
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Vous vous posez des questions ?
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
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
