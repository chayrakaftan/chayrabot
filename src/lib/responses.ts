import { Intent, Lang, ChatContext } from './types'
import { PRODUCTS, SHIPPING, RETURNS, CARE, BRAND, COLLECTIONS, findProduct, findProductsByColor, getInStockProducts } from './knowledge-base'
import { t, getSuggestions } from './i18n'

interface ResponseResult {
  reply: string
  suggestions?: string[]
  context?: Partial<ChatContext>
}

export function generateResponse(intent: Intent, message: string, lang: Lang, context?: ChatContext): ResponseResult {
  const suggestions = getSuggestions(lang)

  switch (intent) {

    // ==================== SALUTATION ====================
    case 'salutation':
      return { reply: t('greeting', lang), suggestions }

    // ==================== REMERCIEMENT ====================
    case 'remerciement':
      return { reply: t('thanks', lang), suggestions }

    // ==================== SUIVI COMMANDE ====================
    case 'suivi_commande':
      return {
        reply: t('askOrderNumber', lang),
        context: { awaitingOrderNumber: true },
        suggestions: ['#1234', 'Autre question'],
      }

    // ==================== LIVRAISON ====================
    case 'livraison': {
      const m = message.toLowerCase()
      if (/(aid|eid|ramadan|fete|a temps)/.test(m)) {
        return {
          reply: lang === 'en'
            ? '🕌 We do our best to deliver before Eid! Orders placed before March 13 are prioritized. Standard processing: 2-7 business days + shipping time.\n\nFor France: Colissimo ~2 days, Chronopost 1-3 days.'
            : "🕌 Nous faisons tout notre possible pour livrer avant l'Aïd ! Les commandes passées avant le 13 mars sont prioritaires.\n\n**Délai** : 2-7 jours de préparation + livraison.\n**France** : Colissimo ~2j, Chronopost 1-3j.",
          suggestions,
        }
      }
      return {
        reply: lang === 'en'
          ? `📦 **Shipping info:**\n- Processing: 2-7 business days\n- France: Free from €65 or 2+ items, otherwise €8.99\n- Belgium/Luxembourg: €15.99\n- Other EU: €19.50\n\n**Carriers:** Colissimo (~2 days), Mondial Relay (3-5 days), Chronopost (1-3 days)`
          : `📦 **Informations livraison :**\n- Préparation : ${SHIPPING.processing}\n- France : ${SHIPPING.france.free}, sinon ${SHIPPING.france.paid}\n- Belgique/Luxembourg : ${SHIPPING.europe.belgiqueLux}\n- Autres pays EU : ${SHIPPING.europe.autresEU}\n\n**Transporteurs :** Colissimo (~2j), Mondial Relay (3-5j), Chronopost (1-3j)`,
        suggestions,
      }
    }

    // ==================== RETOUR ====================
    case 'retour':
      return {
        reply: lang === 'en'
          ? `↩️ **Return policy:**\n- ${RETURNS.period}\n- Item must be unworn, unwashed, with original tags and packaging\n- Return shipping is at your expense (tracking recommended)\n- Refund: ${RETURNS.refundDelay}\n\n**Process:** Email chayrakaftan@gmail.com with your order number.`
          : `↩️ **Politique de retour :**\n- Délai : ${RETURNS.period}\n- Article non porté, non lavé, étiquettes intactes, emballage original\n- Frais de retour à votre charge (suivi recommandé)\n- Remboursement : ${RETURNS.refundDelay}\n\n**Procédure :** Envoyez un email à **chayrakaftan@gmail.com** avec votre numéro de commande.`,
        suggestions,
      }

    // ==================== REMBOURSEMENT ====================
    case 'remboursement':
      return {
        reply: lang === 'en'
          ? `💰 **Refund info:**\n- Processed within ${RETURNS.refundDelay} after we receive your return\n- Refunded to your original payment method\n- No direct exchange — return then place a new order\n\nFor defective items: contact within 48h with photos, return shipping covered by us.`
          : `💰 **Remboursement :**\n- Traité sous ${RETURNS.refundDelay} après réception du retour\n- Sur votre moyen de paiement original\n- Pas d'échange direct : retour + nouvelle commande\n\n**Article défectueux ?** Contactez-nous sous 48h avec photos — retour à notre charge.`,
        suggestions,
      }

    // ==================== ANNULATION ====================
    case 'annulation':
      return {
        reply: lang === 'en'
          ? "❌ To cancel an order, please email us ASAP at **chayrakaftan@gmail.com** with your order number. If the order hasn't been shipped yet, we'll cancel it and refund you."
          : "❌ Pour annuler une commande, envoyez-nous un email rapidement à **chayrakaftan@gmail.com** avec votre numéro de commande. Si elle n'est pas encore expédiée, nous l'annulerons et vous rembourserons.",
        suggestions,
      }

    // ==================== CHANGEMENT ADRESSE ====================
    case 'changement_adresse':
      return {
        reply: t('escalate', lang),
        suggestions,
      }

    // ==================== TAILLE ====================
    case 'taille': {
      const product = findProductFromMessage(message)
      if (product) {
        return {
          reply: `📏 **${product.name}** :\n- Taille : ${product.sizes}\n- Mannequin : ${product.mannequin}\n- Coupe : ample et aérienne, convient à la plupart des morphologies\n\nLa coupe est généreuse, si vous hésitez elle conviendra très bien !`,
          suggestions,
        }
      }
      return {
        reply: lang === 'en'
          ? '📏 **Size guide:**\n- Gandoura Abaya: One size fits 36-44 (mannequins: 1m57 to 1m67)\n- Gandoura Mixte: One size fits 36-44\n- Gandoura Papillon: One size fits 36-46 (more generous cut)\n\nAll cuts are loose and airy. Which model interests you?'
          : '📏 **Guide des tailles :**\n- **Gandoura Abaya** : Taille unique 36-44 (mannequins de 1m57 à 1m67)\n- **Gandoura Mixte** : Taille unique 36-44\n- **Gandoura Papillon** : Taille unique 36-46 (coupe plus généreuse)\n\nToutes les coupes sont amples et aériennes. Quel modèle vous intéresse ?',
        suggestions: ['Gandoura Abaya', 'Gandoura Papillon', 'Gandoura Mixte', 'Autre question'],
      }
    }

    // ==================== INFO PRODUIT ====================
    case 'info_produit': {
      const product = findProductFromMessage(message)
      if (product) {
        const stockLabel = product.inStock ? '✅ En stock' : '❌ Rupture de stock'
        return {
          reply: `✨ **${product.name}**\n\n- 💰 Prix : **${product.price}€**\n- 🎨 Couleur : ${product.color}\n- 🧵 Matière : ${product.fabric}\n- 📏 Taille : ${product.sizes}\n- 👗 Mannequin : ${product.mannequin}\n- ${stockLabel}\n\n🇲🇦 ${BRAND.sfifa}\n\n${product.description}`,
          suggestions,
        }
      }

      const m = message.toLowerCase()
      if (/(papillon)/.test(m)) {
        const c = COLLECTIONS.papillon
        const inStock = PRODUCTS.filter(p => p.collection === 'papillon' && p.inStock).map(p => p.name.split(' ').pop()).join(', ')
        return {
          reply: `🦋 **${c.name}** — ${c.priceRange}\n\n- Matière : ${c.fabric}\n- Tailles : ${c.sizeRange}\n- ${c.description}\n\n**Disponibles :** ${inStock || 'Aucun en ce moment'}\n\n🔄 Restock chaque mardi à 20h !`,
          suggestions,
        }
      }
      if (/(mixte)/.test(m)) {
        const c = COLLECTIONS.mixte
        return {
          reply: `👫 **${c.name}** — ${c.priceRange}\n\n- Matière : ${c.fabric}\n- Tailles : ${c.sizeRange}\n- ${c.description}\n\n🔄 Restock chaque mardi à 20h !`,
          suggestions,
        }
      }
      if (/(abaya)/.test(m) || /(collection|produit|article|catalogue)/.test(m)) {
        const c = COLLECTIONS.abaya
        const inStock = PRODUCTS.filter(p => p.collection === 'abaya' && p.inStock).map(p => p.name.split(' ').pop()).join(', ')
        return {
          reply: `👗 **${c.name}** — ${c.priceRange}\n\n- Matière : ${c.fabric}\n- Tailles : ${c.sizeRange}\n- ${c.description}\n\n**Disponibles :** ${inStock || 'Aucun en ce moment'}\n\n🔄 Restock chaque mardi à 20h !`,
          suggestions,
        }
      }

      if (/(fabri[qc]|origine|maroc|fait.*main|artisan|sfifa|broder)/.test(m)) {
        return {
          reply: `🇲🇦 **Fabrication :**\n\nToutes nos gandouras sont **100% conçues et fabriquées au Maroc**.\n\nLa **Sfifa** (broderie traditionnelle) est réalisée **entièrement à la main** par des artisans marocains avec une précision millimétrée.\n\n**Matières :**\n- Gandoura Abaya : 70% Crêpe, 30% Polyester (fluide, opaque)\n- Gandoura Papillon : 50% Lin, 50% Viscose (léger, peu froissable)\n- Gandoura Mixte : Tissu léger haute qualité`,
          suggestions,
        }
      }

      if (/(disponible|stock|en vente)/.test(m)) {
        const inStock = getInStockProducts()
        const list = inStock.map(p => `- ${p.name} — ${p.price}€`).join('\n')
        return {
          reply: `📦 **Produits disponibles actuellement :**\n\n${list}\n\n🔄 Restock chaque mardi à 20h, quantités très limitées !\n\nSuivez-nous sur Instagram et TikTok pour être informée en priorité.`,
          suggestions,
        }
      }

      return {
        reply: `✨ **Nos collections :**\n\n👗 **Gandoura Abaya** (45-52,95€) — Crêpe/Polyester, taille 36-44\n🦋 **Gandoura Papillon** (55€) — Lin/Viscose, taille 36-46\n👫 **Gandoura Mixte** (45€) — Taille 36-44\n\nToutes avec Sfifa artisanale brodée main au Maroc 🇲🇦\n\nQuel modèle vous intéresse ?`,
        suggestions: ['Gandoura Abaya', 'Gandoura Papillon', 'Produits en stock', 'Autre question'],
      }
    }

    // ==================== RESTOCK ====================
    case 'restock':
      return {
        reply: lang === 'en'
          ? `🔄 Restocks happen **every Tuesday at 8pm** (Paris time) in very limited quantities!\n\nFollow us to be notified first:\n- [Instagram](${BRAND.instagram})\n- [TikTok](${BRAND.tiktok})`
          : `🔄 Les réassorts ont lieu **chaque mardi à 20h** en quantités très limitées !\n\nSuivez-nous pour être informée en priorité :\n- [Instagram (ChayraKaftan)](${BRAND.instagram})\n- [TikTok (ChayraKaftan)](${BRAND.tiktok})`,
        suggestions,
      }

    // ==================== ENTRETIEN ====================
    case 'entretien':
      return {
        reply: `🧼 **Conseils d'entretien :**\n\n- ${CARE.washing}\n- ${CARE.drying}\n- ${CARE.ironing}\n- ${CARE.embroidery}\n- ${CARE.storage}\n\n🦋 **Gandoura Papillon** (Lin/Viscose) : ${CARE.papillon}`,
        suggestions,
      }

    // ==================== PROMO ====================
    case 'promo':
      return {
        reply: `🎁 **Code promo actif :**\n\n**${BRAND.promo.code}** — ${BRAND.promo.discount} sur la collection Ramadan !\n\nÀ saisir lors du paiement sur chayrakaftan.com`,
        suggestions,
      }

    // ==================== CONTACT ====================
    case 'contact':
      return {
        reply: `📧 **Nous contacter :**\n\n- Email : **${BRAND.email}**\n- Instagram : [ChayraKaftan](${BRAND.instagram})\n- TikTok : [ChayraKaftan](${BRAND.tiktok})\n\nNous répondons généralement sous 24h !`,
        suggestions,
      }

    // ==================== FALLBACK ====================
    default:
      return {
        reply: lang === 'en'
          ? "I'm not sure I understand your question. Here's what I can help with:\n\n📦 Order tracking\n📏 Size guide\n🧵 Product info & materials\n🚚 Delivery times\n↩️ Returns & refunds\n\nOr contact us at **chayrakaftan@gmail.com**"
          : "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux faire :\n\n📦 Suivi de commande\n📏 Guide des tailles\n🧵 Infos produits et matières\n🚚 Délais de livraison\n↩️ Retours et remboursements\n\nOu contactez-nous à **chayrakaftan@gmail.com**",
        suggestions,
      }
  }
}

// ==================== HELPERS ====================
function findProductFromMessage(message: string): ReturnType<typeof findProduct> {
  const m = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const colors = ['bleu ciel', 'azur', 'barbie', 'fushia', 'bordeaux', 'emeraude', 'khol', 'majorelle', 'marine', 'perle', 'rubis', 'sable', 'zaji', 'blush', 'cannelle', 'brume', 'ivoire', 'nuit']
  for (const color of colors) {
    if (m.includes(color)) {
      const found = findProduct(color)
      if (found) return found
    }
  }

  return findProduct(m) || undefined
}
