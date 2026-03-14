import { Product } from './types'

// ============================================================
// PRODUITS — 21 gandouras, 3 gammes
// ============================================================
export const PRODUCTS: Product[] = [
  // --- GANDOURA ABAYA (70% Crêpe, 30% Polyester) ---
  { name: 'Abaya Gandoura Bleu Ciel', collection: 'abaya', price: 52.95, color: 'Bleu ciel', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m57', inStock: true, description: 'Abaya bleu ciel avec Sfifa artisanale brodée main. Coupe moderne, silhouette ample et aérienne.' },
  { name: 'Gandoura Abaya Azur', collection: 'abaya', price: 45.00, color: 'Blanc lumineux', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Abaya blanc lumineux avec Sfifa sans aakad. Fluide, légère, bonne opacité.' },
  { name: 'Gandoura Abaya Barbie', collection: 'abaya', price: 52.99, color: 'Fushia / Barbie', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m57', inStock: true, description: 'Abaya fushia avec Sfifa artisanale. Couleur vive et élégante.' },
  { name: 'Gandoura Abaya Bordeaux', collection: 'abaya', price: 52.95, color: 'Bordeaux', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Abaya bordeaux avec broderie traditionnelle marocaine.' },
  { name: 'Gandoura Abaya Émeraude', collection: 'abaya', price: 52.95, color: 'Émeraude (vert)', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m57', inStock: false, description: 'Abaya émeraude avec Sfifa artisanale, précision millimétrée.' },
  { name: 'Gandoura Abaya Khôl', collection: 'abaya', price: 45.00, color: 'Noir profond', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Abaya noir inspiré du khôl traditionnel. Élégance intemporelle.' },
  { name: 'Gandoura Abaya Majorelle', collection: 'abaya', price: 45.00, color: 'Bleu Majorelle', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m67', inStock: true, description: 'Abaya bleu profond lumineux avec broderie traditionnelle et contraste délicat.' },
  { name: 'Gandoura Abaya Marine', collection: 'abaya', price: 52.95, color: 'Blanc pur', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m57', inStock: false, description: 'Abaya blanc pur avec Sfifa artisanale. Élégance lumineuse.' },
  { name: 'Gandoura Abaya Perle', collection: 'abaya', price: 52.95, color: 'Blanc pur', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Abaya blanc pur avec Sfifa artisanale brodée main.' },
  { name: 'Gandoura Abaya Rubis', collection: 'abaya', price: 52.95, color: 'Bordeaux / Rubis', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m57', inStock: true, description: "Abaya bordeaux avec Sfifa artisanale. Chef-d'œuvre pour vos plus belles occasions." },
  { name: 'Gandoura Abaya Sable', collection: 'abaya', price: 52.95, color: 'Noir intense', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Abaya noire intense avec Sfifa artisanale.' },
  { name: 'Gandoura Abaya Zaji', collection: 'abaya', price: 52.95, color: 'Blanc pur', fabric: '70% Crêpe, 30% Polyester', sizes: 'Taille unique (36-44)', mannequin: '1m67', inStock: true, description: 'Abaya blanc pur avec Sfifa artisanale. Liberté de mouvement.' },

  // --- GANDOURA MIXTE (tissu léger) ---
  { name: 'Gandoura Mixte Blush', collection: 'mixte', price: 45.00, color: 'Rose poudré / Blush', fabric: 'Tissu léger haute qualité', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Gandoura mixte rose tendre avec Sfifa artisanale. Design minimaliste.' },
  { name: 'Gandoura Mixte Cannelle', collection: 'mixte', price: 45.00, color: 'Cannelle / Marron', fabric: 'Tissu léger haute qualité', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Gandoura mixte couleur cannelle avec Sfifa artisanale. Marron riche et intemporel.' },
  { name: 'Gandoura Mixte Émeraude', collection: 'mixte', price: 45.00, color: 'Émeraude', fabric: 'Tissu léger haute qualité', sizes: 'Taille unique (36-44)', mannequin: '1m64', inStock: false, description: 'Gandoura mixte émeraude avec broderie traditionnelle.' },

  // --- GANDOURA PAPILLON (50% Lin, 50% Viscose) ---
  { name: 'Gandoura Papillon Brume', collection: 'papillon', price: 55.00, color: 'Gris doux', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: false, description: 'Gandoura papillon gris intemporel. Sfifa brodée main, manches ultra-amples.' },
  { name: 'Gandoura Papillon Émeraude', collection: 'papillon', price: 55.00, color: 'Émeraude', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: true, description: 'Gandoura papillon émeraude. Broderie fine main sur buste et col.' },
  { name: 'Gandoura Papillon Ivoire', collection: 'papillon', price: 55.00, color: 'Ivoire', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: true, description: 'Gandoura papillon ivoire. Sfifa artisanale travaillée main au col, précision millimétrique.' },
  { name: 'Gandoura Papillon Khôl', collection: 'papillon', price: 55.00, color: 'Noir intense', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: true, description: 'Gandoura papillon noir. Sfifa brodée main au col, silhouette impériale.' },
  { name: 'Gandoura Papillon Nuit', collection: 'papillon', price: 55.00, color: 'Bleu nuit profond', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: true, description: 'Gandoura papillon bleu nuit magnétique. Sfifa brodée main.' },
  { name: 'Gandoura Papillon Rubis', collection: 'papillon', price: 55.00, color: 'Rubis / Bordeaux', fabric: '50% Lin, 50% Viscose', sizes: 'Taille unique (36-46)', mannequin: '1m64', inStock: true, description: 'Gandoura papillon rubis. Sfifa brodée main sur encolure en V.' },
]

// ============================================================
// LIVRAISON
// ============================================================
export const SHIPPING = {
  processing: '2 à 7 jours ouvrés de préparation',
  france: {
    free: 'Gratuite dès 65€ ou 2 articles',
    paid: '8,99€ si commande < 65€ et 1 seul article',
    colissimo: '~2 jours ouvrables',
    mondialRelay: '3-5 jours ouvrables (point relais)',
    chronopost: '1-3 jours ouvrables',
  },
  europe: {
    belgiqueLux: '15,99€ — 2 à 8 jours ouvrables',
    autresEU: '19,50€ — 2 à 8 jours ouvrables',
    countries: 'Belgique, Luxembourg, Espagne, Allemagne, Italie',
  },
  tracking: "Un email avec numéro de suivi est envoyé automatiquement à l'expédition.",
  trackingLink: 'https://chayrakaftan.com/apps/parcelpanel',
}

// ============================================================
// RETOURS & REMBOURSEMENT
// ============================================================
export const RETURNS = {
  period: '14 jours calendaires après réception',
  conditions: [
    'Article non porté et non lavé',
    "État d'origine avec étiquettes intactes",
    'Emballage original',
  ],
  process: [
    'Envoyer un email à chayrakaftan@gmail.com avec votre numéro de commande',
    "Recevoir l'adresse de retour",
    'Expédier à vos frais (suivi recommandé)',
  ],
  refundDelay: '5 à 10 jours ouvrés sur le moyen de paiement original',
  shippingCost: 'Frais de retour à la charge du client',
  exchange: 'Pas d\'échange direct : faire un retour puis passer une nouvelle commande',
  defect: 'Contacter sous 48h avec photos — retour pris en charge par ChayraKaftan',
  preorders: 'Même politique 14 jours (sauf sur-mesure)',
}

// ============================================================
// ENTRETIEN
// ============================================================
export const CARE = {
  washing: 'Lavage à 30°C maximum, cycle délicat, filet protecteur recommandé',
  handwash: 'Lessive douce sans agents blanchissants, eau froide',
  drying: 'Séchage à plat ou sur cintre large. Jamais de sèche-linge.',
  ironing: "Basse température, vapeur préférée, repasser à l'envers",
  storage: 'Cintres rembourrés ou en bois, housses coton respirantes (pas plastique)',
  embroidery: 'Ne pas frotter sur les broderies Sfifa',
  papillon: 'Le mélange Lin/Viscose se froisse beaucoup moins que le lin pur, repassage minimal',
}

// ============================================================
// MARQUE
// ============================================================
export const BRAND = {
  name: 'ChayraKaftan',
  email: 'chayrakaftan@gmail.com',
  website: 'https://chayrakaftan.com',
  madeIn: 'Maroc — 100% conçu et fabriqué au Maroc',
  sfifa: 'Sfifa artisanale brodée entièrement à la main par des artisans marocains',
  specialty: 'Mode féminine pudique : abayas, gandouras, kaftans',
  fabrics: 'Crêpe, soie, coton, lin — sélection de tissus nobles',
  ethics: 'Partenariat avec des fournisseurs éthiques',
  instagram: 'https://www.instagram.com/chayrakaftan/',
  tiktok: 'https://www.tiktok.com/@chayrakaftan',
  restock: 'Chaque mardi à 20h, quantités très limitées',
  promo: { code: 'RAMADAN15', discount: '-15%', note: 'Valable sur la collection Ramadan' },
}

// ============================================================
// COLLECTIONS
// ============================================================
export const COLLECTIONS = {
  abaya: { name: 'Gandoura Abaya', priceRange: '45€ - 52,95€', fabric: '70% Crêpe, 30% Polyester', sizeRange: '36-44', description: 'Coupe abaya moderne, silhouette ample et aérienne, excellent tombé et opacité' },
  mixte: { name: 'Gandoura Mixte', priceRange: '45€', fabric: 'Tissu léger haute qualité', sizeRange: '36-44', description: 'Style mixte/unisexe, design minimaliste avec broderie artisanale' },
  papillon: { name: 'Gandoura Papillon', priceRange: '55€', fabric: '50% Lin, 50% Viscose', sizeRange: '36-46', description: 'Manches ultra-amples ailes de papillon, repassage minimal' },
}

// ============================================================
// HELPERS
// ============================================================
export function findProduct(query: string): Product | undefined {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return PRODUCTS.find(p => {
    const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const color = p.color.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return name.includes(q) || q.includes(name.split(' ').slice(-1)[0]) || color.includes(q)
  })
}

export function findProductsByColor(color: string): Product[] {
  const c = color.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return PRODUCTS.filter(p => {
    const pColor = p.color.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const pName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return pColor.includes(c) || pName.includes(c)
  })
}

export function getInStockProducts(): Product[] {
  return PRODUCTS.filter(p => p.inStock)
}
