import type { Market, Post } from "@/payload-types";

/** One string per content locale. French is the source; English follows. */
export type L = { fr: string; en: string };

/** Brand files in `scripts/seed/assets/`, uploaded to Media by the seed. */
export const brandAssets = {
  bdmarketIcon: {
    file: "bdmarket-icon.svg",
    alt: { fr: "Icône BDMarket", en: "BDMarket icon" },
  },
  bdmarketWordmark: {
    file: "bdmarket-wordmark.svg",
    alt: { fr: "BDMarket", en: "BDMarket" },
  },
} as const;

export type BrandAsset = keyof typeof brandAssets;

export const products = [
  {
    name: "BDMarket",
    imageAsset: "bdmarketIcon" as BrandAsset,
    status: { fr: "En ligne · iOS & Android", en: "Live · iOS & Android" },
    title: {
      fr: "L’épicerie africaine et caribéenne, livrée chez vous",
      en: "African and Caribbean groceries, delivered to your door",
    },
    body: {
      fr: "Une application dédiée aux produits alimentaires des communautés africaines et caribéennes d’Île-de-France, avec des livraisons planifiées par secteurs.",
      en: "An app dedicated to the food products of Île-de-France’s African and Caribbean communities, with deliveries scheduled by area.",
    },
    bullets: [
      { text: { fr: "Catalogue et outils vendeurs", en: "Catalogue and vendor tools" } },
      {
        text: {
          fr: "Paiement dans l’app : virement instantané via Bridge ou carte bancaire",
          en: "In-app payment: instant bank transfer via Bridge or bank card",
        },
      },
      {
        text: {
          fr: "Commandes diaspora pour la famille au pays",
          en: "Diaspora orders for family back home",
        },
      },
    ],
    cta: { fr: "Télécharger BDMarket", en: "Download BDMarket" },
    // Google Play: the Android package from the BDMarket Expo config.
    // App Store: no public listing link known yet, so the official site for
    // now — replace it in the admin once the App Store URL is available.
    appStoreUrl: "https://bdmarket.fr/",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.noizsystems.bdmarket",
    order: 1,
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
    products: ["BDMarket"],
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
    products: ["BDMarket"],
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
      fr: "Comment obtenir de l'aide sur une commande BDMarket ?",
      en: "How do I get help with a BDMarket order?",
    },
    answer: {
      fr: "Ouvrez un ticket dans notre centre d'aide avec votre numéro de commande. Vous recevez une référence pour suivre son avancement.",
      en: "Open a ticket in our help center with your order number. You get a reference to follow its progress.",
    },
    order: 1,
  },
  {
    question: {
      fr: "Développez-vous des apps pour d'autres entreprises ?",
      en: "Do you build apps for other companies?",
    },
    answer: {
      fr: "Oui, de façon sélective, surtout dans le commerce et la logistique où nos propres produits nous donnent un vrai avantage.",
      en: "Yes, selectively, mostly in commerce and logistics, where our own products give us a real edge.",
    },
    order: 2,
  },
  {
    question: {
      fr: "Quels moyens de paiement acceptez-vous ?",
      en: "Which payment methods do you accept?",
    },
    answer: {
      fr: "Uniquement dans l’application BDMarket : virement bancaire instantané via notre partenaire Bridge, ou paiement par carte bancaire.",
      en: "Only in the BDMarket app: instant bank transfer via our partner Bridge, or payment by bank card.",
    },
    order: 3,
  },
  {
    question: { fr: "Levez-vous des fonds ?", en: "Are you raising funds?" },
    answer: {
      fr: "Nous échangeons avec des investisseurs qui connaissent le commerce africain. Écrivez-nous en précisant votre profil.",
      en: "We talk with investors who know African commerce. Write to us and tell us about your profile.",
    },
    order: 4,
  },
];

export const landing = {
  hero: {
    imageAsset: "bdmarketWordmark" as BrandAsset,
    kicker: {
      fr: "Bienvenue sur notre site web",
      en: "Welcome to our website",
    },
    title: {
      fr: "L’épicerie africaine<br-md> et caribéenne,<br> <accent>livrée chez vous.</accent>",
      en: "African<br-md> and Caribbean groceries,<br> <accent>delivered to your door.</accent>",
    },
    body: {
      fr: "Vos produits alimentaires africains et caribéens, réunis dans une seule application. Des livraisons planifiées par secteurs en Île-de-France, avec Noiz Systems.",
      en: "Your African and Caribbean food products, brought together in one app. Deliveries scheduled by area across Île-de-France, with Noiz Systems.",
    },
    primaryCta: { fr: "Découvrir BDMarket", en: "Discover BDMarket" },
    secondaryCta: { fr: "Centre d'aide", en: "Help center" },
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
      { value: { fr: "01", en: "01" }, label: { fr: "Produit en ligne", en: "Product live" } },
      { value: { fr: "100%", en: "100%" }, label: { fr: "Conçu en interne", en: "Built in-house" } },
      { value: { fr: "Île-de-France", en: "Île-de-France" }, label: { fr: "Marché actif", en: "Active market" } },
    ],
  },
  sections: {
    products: {
      title: { fr: "BDMarket", en: "BDMarket" },
      lede: {
        fr: "Maîtrisé de bout en bout, de l'écran que touche le client jusqu'au service après-vente.",
        en: "Owned end to end, from the screen the customer touches to after-sales service.",
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
      title: { fr: "Notre méthode", en: "Our method" },
      steps: [
        {
          title: { fr: "Écouter", en: "Listen" },
          body: {
            fr: "Nous échangeons avec vous pour comprendre vos besoins.",
            en: "We talk with you to understand your needs.",
          },
        },
        {
          title: { fr: "Simplifier", en: "Simplify" },
          body: {
            fr: "Nous rendons vos courses alimentaires plus simples.",
            en: "We make your grocery shopping simpler.",
          },
        },
        {
          title: { fr: "Accompagner", en: "Support" },
          body: {
            fr: "Nos équipes vous accompagnent, de la commande au suivi.",
            en: "Our teams support you, from order to follow-up.",
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
    title: { fr: "Nous contacter", en: "Contact us" },
    body: {
      fr: "Une question ou une demande ? Nos équipes sont à votre écoute.",
      en: "A question or a request? Our teams are here to listen.",
    },
    email: "support@noizsystems.tech",
  },
  footer: {
    tagline: {
      fr: "Deux frères, une vision, des solutions tech.",
      en: "Deux frères, une vision, des solutions tech.",
    },
  },
  seo: {
    title: { fr: "Noiz Systems — BDMarket", en: "Noiz Systems — BDMarket" },
    description: {
      fr: "Découvrez BDMarket, l’épicerie alimentaire des communautés africaines et caribéennes en Île-de-France, avec des livraisons planifiées par secteurs.",
      en: "Discover BDMarket, the grocery store of Île-de-France’s African and Caribbean communities, with deliveries scheduled by area.",
    },
    ogDescription: {
      fr: "BDMarket réunit vos produits alimentaires africains et caribéens en Île-de-France, avec des livraisons planifiées par secteurs.",
      en: "BDMarket brings together your African and Caribbean food products in Île-de-France, with deliveries scheduled by area.",
    },
  },
};
