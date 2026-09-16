import type { Market, Post } from "@/payload-types";

/** One string per content locale. French is the source; English follows. */
export type L = { fr: string; en: string };

export const products = [
  {
    name: "BDMarket",
    status: { fr: "En ligne · iOS & Android", en: "Live · iOS & Android" },
    title: { fr: "L’épicerie africaine, livrée", en: "African groceries, delivered" },
    body: {
      fr: "Une place de marché mobile pour les produits alimentaires africains : vendeurs sélectionnés, produits familiers, des prix justes, livraison planifiée au quartier.",
      en: "A mobile marketplace for African foods and household goods: curated vendors, familiar products, prices that make sense, delivery scheduled around the neighbourhood.",
    },
    bullets: [
      { text: { fr: "Intégration vendeurs et outils catalogue", en: "Vendor onboarding and catalogue tools" } },
      { text: { fr: "Paiement mobile money et carte", en: "Mobile money and card checkout" } },
      { text: { fr: "Commande depuis la diaspora pour la famille", en: "Diaspora ordering for family back home" } },
    ],
    cta: { fr: "Télécharger BDMarket", en: "Download BDMarket" },
    order: 1,
  },
  {
    name: "Noiz Logistics",
    status: { fr: "En ligne · suite opérateur", en: "Live · operator suite" },
    title: { fr: "La couche logistique en dessous", en: "The delivery layer underneath" },
    body: {
      fr: "Répartition, tournées, preuve de livraison et suivi de flotte — le système qui traite les commandes BDMarket, ouvert aux commerçants et transporteurs.",
      en: "Dispatch, routing, proof of delivery and fleet visibility — the same system that runs BDMarket orders, opened up to merchants and carriers who need it.",
    },
    bullets: [
      { text: { fr: "App livreur avec suivi hors-ligne", en: "Driver app with offline-first tracking" } },
      { text: { fr: "Console de répartition et planification", en: "Dispatch console and route planning" } },
      { text: { fr: "API marchand pour le transfert de commandes", en: "Merchant API for order handoff" } },
    ],
    cta: { fr: "Demander une démo", en: "Request a demo" },
    order: 2,
  },
];

/** `products` are product names, resolved to ids once those are created. */
export const markets: Array<{
  name: L;
  products: string[];
  status: Market["status"];
  order: number;
}> = [
  {
    name: { fr: "Paris · Île-de-France", en: "Paris · Île-de-France" },
    products: ["BDMarket", "Noiz Logistics"],
    status: "live",
    order: 1,
  },
  {
    name: { fr: "Lyon · Marseille", en: "Lyon · Marseille" },
    products: ["BDMarket"],
    status: "next",
    order: 2,
  },
  {
    name: { fr: "Bruxelles", en: "Brussels" },
    products: ["BDMarket"],
    status: "study",
    order: 3,
  },
  {
    name: { fr: "Afrique de l’Ouest", en: "West Africa" },
    products: ["Noiz Logistics"],
    status: "study",
    order: 4,
  },
];

export const posts: Array<{
  title: L;
  excerpt: L;
  category: Post["category"];
  publishedAt: string;
}> = [
  {
    title: {
      fr: "BDMarket lance la livraison planifiée au quartier",
      en: "BDMarket adds scheduled neighbourhood delivery",
    },
    excerpt: {
      fr: "Les commandes se regroupent par rue et créneau, réduisant le coût par livraison.",
      en: "Orders now group by street and time slot, cutting the cost per drop.",
    },
    category: "product",
    publishedAt: "2026-06-12",
  },
  {
    title: {
      fr: "Suivi hors-ligne dans l’app livreur",
      en: "Offline-first tracking in the driver app",
    },
    excerpt: {
      fr: "Les livraisons s’enregistrent puis se synchronisent — plus de zone blanche dans la preuve de livraison.",
      en: "Deliveries record and sync later — no dead zones in the proof-of-delivery chain.",
    },
    category: "logistics",
    publishedAt: "2026-04-28",
  },
  {
    title: {
      fr: "Deux frères, une vision : les débuts de Noiz",
      en: "Two brothers, one vision: how Noiz started",
    },
    excerpt: {
      fr: "D’une course d’épicerie familiale à une place de marché et sa flotte.",
      en: "From a family grocery run to a marketplace and the fleet behind it.",
    },
    category: "company",
    publishedAt: "2026-03-03",
  },
];

export const faqs = [
  {
    question: {
      fr: "Développez-vous des applications pour d’autres entreprises ?",
      en: "Do you build apps for other companies?",
    },
    answer: {
      fr: "Oui — de façon sélective, surtout dans le commerce et la logistique où nos propres produits nous donnent un avantage réel. Réservez un appel et nous vous dirons honnêtement si nous sommes la bonne équipe.",
      en: "Yes — selectively, and mostly in commerce and logistics where our own products give us an unfair advantage. Book a call and we will tell you honestly whether we are the right team.",
    },
    order: 1,
  },
  {
    question: {
      fr: "Les commerçants peuvent-ils utiliser la plateforme logistique seule ?",
      en: "Can merchants use the logistics platform on its own?",
    },
    answer: {
      fr: "Oui. La répartition, l’app livreur et la preuve de livraison fonctionnent indépendamment de BDMarket, avec une API pour transférer les commandes depuis votre boutique.",
      en: "Yes. Dispatch, driver app and proof of delivery work independently of BDMarket, with an API for handing orders over from your own storefront.",
    },
    order: 2,
  },
  {
    question: {
      fr: "Comment gérez-vous les paiements ?",
      en: "How do you handle payments?",
    },
    answer: {
      fr: "Mobile money d’abord, carte et paiement à la livraison là où le marché l’attend. Les moyens de paiement sont configurés par marché, pas codés en dur.",
      en: "Mobile money first, cards and cash on delivery where the market expects them. Payment methods are configured per market, not hard-coded.",
    },
    order: 3,
  },
  {
    question: { fr: "Levez-vous des fonds ?", en: "Are you raising?" },
    answer: {
      fr: "Nous échangeons avec les investisseurs qui connaissent le commerce africain. Utilisez le formulaire en indiquant votre rôle — nous enverrons le deck actuel.",
      en: "We talk to investors who know African commerce. Use the form and mark your role as investor — we will send the current deck.",
    },
    order: 4,
  },
];

export const landing = {
  hero: {
    kicker: {
      fr: "Éditeur de produits · Paris & la diaspora africaine",
      en: "Product company · Paris & the African diaspora",
    },
    title: {
      fr: "Nous construisons les apps qui <accent>font bouger</accent> le commerce africain.",
      en: "We build the apps that <accent>move</accent> African commerce.",
    },
    body: {
      fr: "Noiz Systems conçoit, lance et exploite ses propres produits — BDMarket pour l’épicerie africaine, et la plateforme logistique qui la livre. Deux frères, une vision, des solutions tech.",
      en: "Noiz Systems designs, ships and operates its own products — BDMarket for African groceries, and the logistics platform that delivers them. Two brothers, one vision, engineered software.",
    },
    primaryCta: { fr: "Réserver un appel", en: "Book a call" },
    secondaryCta: { fr: "Voir les produits", en: "See the products" },
    ticker: [
      { label: { fr: "BDMarket", en: "BDMarket" } },
      { label: { fr: "Noiz Logistics", en: "Noiz Logistics" } },
      { label: { fr: "Paris", en: "Paris" } },
      { label: { fr: "Île-de-France", en: "Île-de-France" } },
      { label: { fr: "Saint-Denis", en: "Saint-Denis" } },
      { label: { fr: "Montreuil", en: "Montreuil" } },
      { label: { fr: "Créteil", en: "Créteil" } },
      { label: { fr: "Mobile money", en: "Mobile money" } },
      { label: { fr: "Dernier kilomètre", en: "Last mile" } },
    ],
    stats: [
      { value: { fr: "02", en: "02" }, label: { fr: "Produits en ligne", en: "Products live" } },
      { value: { fr: "2 frères", en: "2 brothers" }, label: { fr: "Fondée par", en: "Founded by" } },
      { value: { fr: "100%", en: "100%" }, label: { fr: "Développé en interne", en: "Built in-house" } },
      { value: { fr: "Paris", en: "Paris" }, label: { fr: "Marché actif", en: "Live market" } },
    ],
  },
  sections: {
    products: {
      title: { fr: "Nos produits", en: "Our products" },
      lede: {
        fr: "Maîtrisés de bout en bout — de la boutique que le client ouvre à la tournée que le livreur effectue.",
        en: "Owned end to end — from the storefront a customer taps to the route a driver runs.",
      },
    },
    capabilities: {
      title: { fr: "Savoir-faire", en: "What we do" },
      lede: {
        fr: "L’équipe qui exploite nos produits construit aussi pour des partenaires sélectionnés.",
        en: "The same team that operates our products builds for selected partners.",
      },
      items: [
        {
          icon: "mobile" as const,
          title: { fr: "Produits mobiles", en: "Mobile products" },
          body: {
            fr: "Des apps grand public pensées pour la faible bande passante, le mobile money et l’Android d’entrée de gamme — les conditions réelles de nos marchés.",
            en: "Consumer apps built for low bandwidth, mobile money and mid-range Android — the conditions our markets actually run on.",
          },
        },
        {
          icon: "logistics" as const,
          title: { fr: "Systèmes logistiques", en: "Logistics systems" },
          body: {
            fr: "Répartition, suivi et dernier kilomètre, avec les parcours terrain qui gardent les livreurs en mouvement sans réseau stable.",
            en: "Dispatch, tracking and last-mile operations, including the field workflows that keep drivers moving without a stable signal.",
          },
        },
        {
          icon: "platform" as const,
          title: { fr: "Ingénierie plateforme", en: "Platform engineering" },
          body: {
            fr: "API, intégration des paiements et l’outillage opérationnel dont un produit a besoin le lendemain du lancement.",
            en: "APIs, payments integration and the operational tooling a product needs on day two — not just the launch screen.",
          },
        },
      ],
    },
    method: {
      title: { fr: "Notre méthode", en: "How we work" },
      steps: [
        {
          title: { fr: "Terrain", en: "Ground truth" },
          body: {
            fr: "Nous passons du temps sur le marché — vendeurs, livreurs, clients — avant de dessiner un écran.",
            en: "We spend time in the market — vendors, drivers, customers — before a screen is drawn.",
          },
        },
        {
          title: { fr: "Plan", en: "Blueprint" },
          body: {
            fr: "Parcours, modèle de données et réalité opérationnelle cartographiés avant le développement.",
            en: "Flows, data model and the operational reality mapped in one document before build.",
          },
        },
        {
          title: { fr: "Livrer en semaines", en: "Ship in weeks" },
          body: {
            fr: "Une version fonctionnelle toutes les deux semaines, entre de vraies mains, instrumentée.",
            en: "A working release every two weeks, in real hands, with the metrics that matter instrumented.",
          },
        },
        {
          title: { fr: "Exploiter", en: "Operate" },
          body: {
            fr: "Nous exploitons ce que nous construisons : support, astreinte et itération en conditions réelles.",
            en: "We run what we build: support, on-call, and iteration against live operations.",
          },
        },
      ],
    },
    markets: {
      title: { fr: "Marchés desservis", en: "Markets we serve" },
      body: {
        fr: "Une ville à la fois, bien faite. BDMarket est en ligne à Paris et en Île-de-France, au service de la diaspora africaine, avec les vendeurs et les produits qu’elle achète déjà.",
        en: "One city at a time, done properly. BDMarket is live in Paris and Île-de-France, serving the African diaspora with the vendors and products they already shop for.",
      },
      note: {
        fr: "Les prochains marchés sont à l’étude — à confirmer avant publication.",
        en: "Next markets are under review — confirm before publishing.",
      },
    },
    news: { title: { fr: "Actualités", en: "News" } },
    faq: { title: { fr: "Questions", en: "Questions" } },
  },
  contact: {
    title: {
      fr: "Réserver un <accent>appel</accent>",
      en: "Book a <accent>call</accent>",
    },
    body: {
      fr: "Dites-nous ce que vous déplacez et pour qui. L’un des fondateurs vous répond — généralement sous un jour ouvré.",
      en: "Tell us what you are moving and who you are moving it for. One of the founders replies — usually within a working day.",
    },
    email: "hello@noiz.systems",
  },
  footer: {
    tagline: {
      fr: "Deux frères, une vision, des solutions tech.",
      en: "Deux frères, une vision, des solutions tech.",
    },
  },
  seo: {
    title: {
      fr: "Noiz Systems — Nous construisons les apps qui font bouger le commerce africain",
      en: "Noiz Systems — We build the apps that move African commerce",
    },
    description: {
      fr: "Noiz Systems conçoit, lance et exploite ses propres produits — BDMarket pour l’épicerie africaine, et la plateforme logistique qui la livre.",
      en: "Noiz Systems designs, ships and operates its own products — BDMarket for African groceries, and the logistics platform that delivers them.",
    },
    ogDescription: {
      fr: "Éditeur de produits pour le commerce et la logistique de la diaspora africaine. Paris et au-delà.",
      en: "Product company building commerce and logistics software for the African diaspora. Paris & beyond.",
    },
  },
};
