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
  bdmarketAppLogo: {
    file: "bdmarket-app-logo.png",
    alt: { fr: "Logo de l’application BDMarket", en: "BDMarket app logo" },
  },
  founderPortrait: {
    file: "kenny-matuka.png",
    alt: {
      fr: "Portrait de Kenny Matuka, fondateur de NOIZ SYSTEMS",
      en: "Portrait of Kenny Matuka, founder of NOIZ SYSTEMS",
    },
  },
} as const;

export type BrandAsset = keyof typeof brandAssets;

export const products = [
  {
    name: "BDMarket",
    imageAsset: "bdmarketAppLogo" as BrandAsset,
    wordmarkAsset: "bdmarketWordmark" as BrandAsset,
    status: { fr: "Disponible sur iOS et Android", en: "Available on iOS and Android" },
    title: {
      fr: "Le marché africain et caribéen à portée de main",
      en: "Your African and Caribbean market at your fingertips",
    },
    body: {
      fr: "Commandez vos produits préférés, nous vous les livrons. En Île-de-France, les livraisons sont planifiées par secteur.",
      en: "Order your favourite products and we deliver them to you. In Île-de-France, deliveries are scheduled by area.",
    },
    bullets: [
      {
        text: {
          fr: "Un large catalogue de produits alimentaires pour répondre à vos besoins",
          en: "A wide range of food products to suit your needs",
        },
      },
      {
        text: {
          fr: "Paiement dans l’application, uniquement par virement bancaire instantané via notre partenaire Bridge",
          en: "Pay in the app exclusively by instant bank transfer through our partner Bridge",
        },
      },
      {
        text: {
          fr: "Gagnez du temps : faites vos courses sans vous déplacer",
          en: "Save time: shop for groceries without leaving home",
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
      fr: "À qui s’adressent vos solutions ?",
      en: "Who are your solutions for?",
    },
    answer: {
      fr: "Nos systèmes et applications s’adressent aux communautés africaines en Afrique et à la diaspora en Occident, ainsi qu’à toute personne intéressée par les services que nous développons. Chaque solution répond à des besoins concrets pour faciliter le quotidien.",
      en: "Our systems and applications serve African communities in Africa and the diaspora in the West, as well as anyone interested in the services we develop. Each solution addresses practical needs to make everyday life easier.",
    },
    order: 1,
  },
  {
    question: {
      fr: "Quel est le lien entre NOIZ SYSTEMS et BDMarket ?",
      en: "How are NOIZ SYSTEMS and BDMarket connected?",
    },
    answer: {
      fr: "BDMarket est une application conçue et développée par NOIZ SYSTEMS. Elle traduit notre mission dans un usage concret : faire ses courses plus facilement.",
      en: "BDMarket is an application designed and developed by NOIZ SYSTEMS. It brings our mission to life through a practical use: making grocery shopping easier.",
    },
    order: 2,
  },
  {
    question: {
      fr: "Comment obtenir de l’aide pour une commande BDMarket ?",
      en: "How can I get help with a BDMarket order?",
    },
    answer: {
      fr: "Ouvrez un ticket dans notre centre d’aide en indiquant votre numéro de commande. La référence reçue vous permettra de suivre votre demande.",
      en: "Open a ticket in our help centre and include your order number. Use the reference you receive to track your request.",
    },
    order: 3,
  },
  {
    question: {
      fr: "Développez-vous des applications pour d’autres entreprises ?",
      en: "Do you develop applications for other businesses?",
    },
    answer: {
      fr: "Oui, nous accompagnons déjà des sociétés dans différents domaines en développant des systèmes et des applications adaptés à leurs besoins.",
      en: "Yes, we already support companies across different industries by developing systems and applications tailored to their needs.",
    },
    order: 4,
  },
  {
    question: {
      fr: "Quel moyen de paiement acceptez-vous ?",
      en: "Which payment method do you accept?",
    },
    answer: {
      fr: "Le paiement s’effectue dans l’application BDMarket, exclusivement par virement bancaire instantané via notre partenaire Bridge.",
      en: "Payments are made in the BDMarket app exclusively by instant bank transfer through our partner Bridge.",
    },
    order: 5,
  },
  {
    question: {
      fr: "Levez-vous des fonds ?",
      en: "Are you raising funds?",
    },
    answer: {
      fr: "Nous échangeons avec des investisseurs qui connaissent les besoins et les priorités du continent africain et de ses communautés à travers le monde. Pour toute question, contactez-nous par e-mail à support@noizsystems.tech.",
      en: "We are in discussions with investors who understand the needs and priorities of Africa and its communities around the world. For any questions, email us at support@noizsystems.tech.",
    },
    order: 6,
  },
];

export const landing = {
  hero: {
    kicker: {
      fr: "La technologie au service de nos communautés",
      en: "Technology serving our communities",
    },
    title: { fr: "NOIZ SYSTEMS", en: "NOIZ SYSTEMS" },
    tagline: {
      fr: "Automatiser. Simplifier.<br><accent>Améliorer le quotidien.</accent>",
      en: "Automate. Simplify.<br><accent>Improve everyday life.</accent>",
    },
    body: {
      fr: "Nous développons des systèmes et des applications pour les communautés africaines sur le continent et la diaspora en Occident.",
      en: "We develop systems and applications for African communities across the continent and the diaspora in the West.",
    },
    primaryCta: { fr: "Découvrir la société", en: "Discover our company" },
    secondaryCta: { fr: "Nos produits", en: "Our products" },
  },
  sections: {
    company: {
      title: { fr: "En Afrique.<br>Et au-delà.", en: "In Africa.<br>And beyond." },
      lead: {
        fr: "NOIZ SYSTEMS est une société technologique ancrée dans les réalités de celles et ceux qu’elle accompagne.",
        en: "NOIZ SYSTEMS is a technology company rooted in the everyday realities of the people it serves.",
      },
      paragraphs: [
        {
          text: {
            fr: "Sur le continent africain comme en Occident, les habitudes et les attentes varient. Nous partons de ces réalités pour concevoir des outils qui répondent à des besoins concrets.",
            en: "Across Africa and in the West, habits and expectations differ. These realities guide us in designing tools that meet practical needs.",
          },
        },
        {
          text: {
            fr: "Faire les courses, par exemple, peut prendre du temps et nécessiter plusieurs déplacements. C’est pour alléger ces contraintes que nous avons créé BDMarket.",
            en: "Grocery shopping, for example, can be time-consuming and involve several trips. We created BDMarket to make it easier.",
          },
        },
      ],
      founder: {
        portraitAsset: "founderPortrait" as BrandAsset,
        name: "Kenny Matuka",
        role: { fr: "Fondateur et dirigeant", en: "Founder and company director" },
        kicker: { fr: "À l’origine de NOIZ SYSTEMS", en: "The founder of NOIZ SYSTEMS" },
        cta: { fr: "Échanger avec nous", en: "Get in touch" },
      },
    },
    vision: {
      title: { fr: "Ce qui nous guide", en: "What drives us" },
      lede: {
        fr: "Trois objectifs pour transformer les usages du quotidien.",
        en: "Three goals to transform everyday experiences.",
      },
      items: [
        {
          title: { fr: "Automatiser", en: "Automate" },
          body: {
            fr: "Réduire les tâches répétitives pour libérer du temps.",
            en: "Reduce repetitive tasks to free up time.",
          },
        },
        {
          title: { fr: "Simplifier", en: "Simplify" },
          body: {
            fr: "Faciliter les démarches et rendre les services plus accessibles.",
            en: "Make processes easier and services more accessible.",
          },
        },
        {
          title: { fr: "Améliorer", en: "Improve" },
          body: {
            fr: "Proposer des outils utiles, adaptés aux habitudes de celles et ceux qui les utilisent.",
            en: "Provide useful tools that fit the habits of the people using them.",
          },
        },
      ],
    },
    products: {
      title: { fr: "Notre vision prend vie", en: "Our vision comes to life" },
      lede: {
        fr: "BDMarket : une autre façon de faire ses courses.",
        en: "BDMarket: a new way to shop for groceries.",
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
      title: { fr: "Du besoin au produit", en: "From need to product" },
      steps: [
        {
          title: { fr: "Écouter", en: "Listen" },
          body: {
            fr: "Comprendre les habitudes et les difficultés rencontrées pour identifier les priorités.",
            en: "Understand habits and challenges to identify priorities.",
          },
        },
        {
          title: { fr: "Concevoir", en: "Design" },
          body: {
            fr: "Imaginer des solutions adaptées, puis les développer en interne.",
            en: "Design tailored solutions, then develop them in-house.",
          },
        },
        {
          title: { fr: "Accompagner", en: "Support" },
          body: {
            fr: "Assurer le suivi et faire évoluer nos produits grâce aux retours des utilisateurs.",
            en: "Provide ongoing support and improve our products through user feedback.",
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
    help: {
      kicker: { fr: "Centre d’aide", en: "Help centre" },
      title: { fr: "Un souci avec une commande ?", en: "Need help with an order?" },
      body: {
        fr: "Adressez votre demande à nos équipes et suivez son avancement.",
        en: "Send your request to our team and track its progress.",
      },
      cta: { fr: "Ouvrir un ticket", en: "Open a ticket" },
    },
    faq: { title: { fr: "Questions fréquentes", en: "Frequently asked questions" } },
  },
  contact: {
    title: { fr: "Échangeons", en: "Let’s talk" },
    body: {
      fr: "Une question sur NOIZ SYSTEMS, nos produits ou une collaboration ? Nos équipes sont à votre écoute.",
      en: "Have a question about NOIZ SYSTEMS, our products or a partnership? Our team is here to listen.",
    },
    email: "support@noizsystems.tech",
  },
  footer: {
    cta: {
      kicker: { fr: "NOIZ SYSTEMS", en: "NOIZ SYSTEMS" },
      title: {
        fr: "Des idées utiles.<br><accent>Des produits concrets.</accent>",
        en: "Useful ideas.<br><accent>Real products.</accent>",
      },
      button: { fr: "Parlons de vos besoins", en: "Let’s discuss your needs" },
    },
    address: "47 RUE VIVIENNE\n75002 PARIS",
    supportLink: { fr: "Une question ? Parlons-en", en: "Have a question? Let’s talk" },
    rights: {
      fr: "© 2026 Noiz Systems. Tous droits réservés.",
      en: "© 2026 Noiz Systems. All rights reserved.",
    },
    legal: {
      fr: "NOIZ SYSTEMS, SASU, société par actions simplifiée unipersonnelle · SIREN 981 198 807 · SIRET du siège 981 198 807 00019",
      en: "NOIZ SYSTEMS, SASU (French single-shareholder simplified joint-stock company) · SIREN 981 198 807 · Registered office SIRET 981 198 807 00019",
    },
    tagline: {
      fr: "Deux frères, une vision, des solutions tech.",
      en: "Deux frères, une vision, des solutions tech.",
    },
  },
  seo: {
    title: {
      fr: "NOIZ SYSTEMS — La société, notre vision et nos produits",
      en: "NOIZ SYSTEMS — Our company, vision and products",
    },
    description: {
      fr: "NOIZ SYSTEMS développe des systèmes et des applications pour les communautés africaines en Afrique et la diaspora en Occident : automatiser, simplifier et améliorer le quotidien, notamment avec BDMarket.",
      en: "NOIZ SYSTEMS develops systems and applications for African communities and the diaspora: automating, simplifying and improving everyday life, including grocery shopping with BDMarket.",
    },
    ogDescription: {
      fr: "La technologie au service des communautés africaines et de la diaspora : NOIZ SYSTEMS automatise, simplifie et améliore le quotidien. BDMarket concrétise cette mission pour les courses alimentaires.",
      en: "Technology serving African communities and the diaspora. Discover NOIZ SYSTEMS, our goals and BDMarket, our African and Caribbean grocery marketplace.",
    },
  },
};

/** The help centre's editorial copy (`/support`). */
export const supportPage = {
  hero: {
    kicker: { fr: "Centre d’aide · BDMarket", en: "Help centre · BDMarket" },
    title: {
      fr: "Vous aider.<br><accent>Tout simplement.</accent>",
      en: "Helping you.<br><accent>Simply.</accent>",
    },
    intro: {
      fr: "Une commande, une livraison ou une question ?<br-md> Nous sommes là pour vous.",
      en: "An order, a delivery or a question?<br-md> We’re here for you.",
    },
    productTagline: {
      fr: "Le marché africain et caribéen à portée de main.",
      en: "Your African and Caribbean market at your fingertips.",
    },
  },
  aside: {
    title: {
      fr: "Votre commande à portée de main",
      en: "Your order at your fingertips",
    },
    body: {
      fr: "Indiquez votre numéro de commande pour un traitement plus rapide.",
      en: "Add your order number for faster handling.",
    },
  },
  seo: {
    title: {
      fr: "Centre d’aide BDMarket — Noiz Systems",
      en: "BDMarket Help Centre — Noiz Systems",
    },
    description: {
      fr: "Contactez l’assistance pour une commande BDMarket ou toute autre demande d’aide, puis suivez son avancement.",
      en: "Contact support about a BDMarket order or any other request, then track its progress.",
    },
    ogDescription: {
      fr: "Créez et suivez vos tickets de support BDMarket.",
      en: "Create and track your BDMarket support tickets.",
    },
  },
};
