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

    // ==================== DÉLAIS LIVRAISON ====================
    case 'livraison': {
      const m = message.toLowerCase()
      if (/(aid|eid|ramadan|fete|a temps)/.test(m)) {
        return {
          reply: lang === 'en'
            ? '🕌 Orders before Eid are prioritized!\n\n**Colissimo** : delivered in 2-3 days.\n_(Processing 24h + Colissimo 1-2 days)_\n\n**Mondial Relay** : delivered in 3-5 days.\n_(Processing 24h + Mondial Relay 2-4 days)_'
            : '🕌 Commandes avant l\'Aïd prioritaires !\n\n**Colissimo** : livré en 2-3 jours.\n_(Traitement 24h + Colissimo 1-2 jours)_\n\n**Mondial Relay** : livré en 3-5 jours.\n_(Traitement 24h + Mondial Relay 2-4 jours)_',
          suggestions,
        }
      }
      return {
        reply: lang === 'en'
          ? '⏱️ **Colissimo** : delivered in 2-3 days.\n_(Processing 24h + Colissimo 1-2 days)_\n\n**Mondial Relay** : delivered in 3-5 days.\n_(Processing 24h + Mondial Relay 2-4 days)_'
          : '⏱️ **Colissimo** : livré en 2-3 jours.\n_(Traitement 24h + Colissimo 1-2 jours)_\n\n**Mondial Relay** : livré en 3-5 jours.\n_(Traitement 24h + Mondial Relay 2-4 jours)_',
        suggestions,
      }
    }

    // ==================== FRAIS LIVRAISON ====================
    case 'frais_livraison': {
      const m = message.toLowerCase()
      if (/(belgique|luxembourg|belge|lux)/.test(m)) {
        return { reply: '📦 Belgique/Luxembourg : **15,99€**', suggestions }
      }
      if (/(espagne|italie|allemagne|portugal|pays-bas|europe|eu\b)/.test(m)) {
        return { reply: '📦 Autres pays EU : **19,50€**', suggestions }
      }
      if (/(france|français|francais|métropole|metropole)/.test(m)) {
        return { reply: '📦 France : livraison **offerte dès 2 articles** ! Sinon 8,99€.', suggestions }
      }
      return {
        reply: lang === 'en'
          ? '📦 Which country are you in? I\'ll give you the exact cost!'
          : '📦 Dans quel pays êtes-vous ? Je vous donne les frais exacts !',
        suggestions: ['France', 'Belgique', 'Autre pays EU', 'Autre question'],
        context: { awaitingCountry: true },
      }
    }

    // ==================== RETOUR ====================
    case 'retour':
      return {
        reply: lang === 'en'
          ? '↩️ **Returns:** within 14 days, unworn, tags on.\nReturn shipping at your cost.\n\n→ Email **chayrakaftan@gmail.com** with your order #.'
          : '↩️ **Retours :** sous 14 jours, non porté, étiquettes.\nFrais de retour à votre charge.\n\n→ Écrivez à **chayrakaftan@gmail.com** avec votre n° de commande.',
        suggestions,
      }

    // ==================== REMBOURSEMENT ====================
    case 'remboursement':
      return {
        reply: lang === 'en'
          ? '💰 Refund within 5-10 days after we receive the return, on your original payment method.\n\nDefective item? Contact us within 48h with photos.'
          : '💰 Remboursement sous 5-10j après réception du retour, sur votre moyen de paiement.\n\nArticle défectueux ? Contactez-nous sous 48h avec photos.',
        suggestions,
      }

    // ==================== ANNULATION ====================
    case 'annulation':
      return {
        reply: lang === 'en'
          ? '❌ Email us ASAP at **chayrakaftan@gmail.com** with your order #. If not yet shipped, we\'ll cancel and refund.'
          : '❌ Envoyez-nous un email vite à **chayrakaftan@gmail.com** avec votre n° de commande. Si pas encore expédiée, on annule et rembourse.',
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
          reply: `📏 **${product.name}** : ${product.sizes}\nMannequin : ${product.mannequin}\nCoupe ample, convient à la plupart des morphologies 👌`,
          suggestions,
        }
      }
      return {
        reply: lang === 'en'
          ? '📏 Which model would you like to know the mannequin size for?'
          : '📏 Pour quel modèle souhaitez-vous connaître la taille du mannequin ?',
        suggestions: ['Gandoura Abaya', 'Gandoura Papillon', 'Gandoura Mixte', 'Autre question'],
        context: { awaitingModel: true },
      }
    }

    // ==================== INFO PRODUIT ====================
    case 'info_produit': {
      const product = findProductFromMessage(message)
      if (product) {
        const stock = product.inStock ? '✅ En stock' : '❌ Rupture'
        return {
          reply: `✨ **${product.name}** — ${product.price}€\n${product.fabric} | ${product.sizes}\nMannequin : ${product.mannequin}\n${stock}`,
          suggestions,
        }
      }

      const m = message.toLowerCase()
      if (/(papillon)/.test(m)) {
        const c = COLLECTIONS.papillon
        const inStock = PRODUCTS.filter(p => p.collection === 'papillon' && p.inStock).map(p => p.name.split(' ').pop()).join(', ')
        return {
          reply: `🦋 **${c.name}** — ${c.priceRange}\n${c.fabric} | ${c.sizeRange}\n\nDisponibles : ${inStock || 'Aucun actuellement'}\n🔄 Restock mardi 20h !`,
          suggestions,
        }
      }
      if (/(mixte)/.test(m)) {
        const c = COLLECTIONS.mixte
        return {
          reply: `👫 **${c.name}** — ${c.priceRange}\n${c.fabric} | ${c.sizeRange}\n🔄 Restock mardi 20h !`,
          suggestions,
        }
      }
      if (/(abaya)/.test(m) || /(collection|produit|article|catalogue)/.test(m)) {
        const c = COLLECTIONS.abaya
        const inStock = PRODUCTS.filter(p => p.collection === 'abaya' && p.inStock).map(p => p.name.split(' ').pop()).join(', ')
        return {
          reply: `👗 **${c.name}** — ${c.priceRange}\n${c.fabric} | ${c.sizeRange}\n\nDisponibles : ${inStock || 'Aucun actuellement'}\n🔄 Restock mardi 20h !`,
          suggestions,
        }
      }

      if (/(fabri[qc]|origine|maroc|fait.*main|artisan|sfifa|broder)/.test(m)) {
        return {
          reply: `🇲🇦 Fabriqué au Maroc, Sfifa brodée main par des artisans.\n\n• Abaya : 70% Crêpe, 30% Polyester\n• Papillon : 50% Lin, 50% Viscose\n• Mixte : tissu léger haute qualité`,
          suggestions,
        }
      }

      if (/(disponible|stock|en vente)/.test(m)) {
        const inStock = getInStockProducts()
        const list = inStock.map(p => `• ${p.name} — ${p.price}€`).join('\n')
        return {
          reply: `📦 **En stock :**\n${list}\n\n🔄 Restock mardi 20h, quantités limitées !`,
          suggestions,
        }
      }

      return {
        reply: `✨ **Nos collections :**\n• Gandoura Abaya (45-52,95€)\n• Gandoura Papillon (55€)\n• Gandoura Mixte (45€)\n\nQuel modèle vous intéresse ?`,
        suggestions: ['Gandoura Abaya', 'Gandoura Papillon', 'Produits en stock', 'Autre question'],
      }
    }

    // ==================== RESTOCK ====================
    case 'restock':
      return {
        reply: lang === 'en'
          ? `🔄 Restocks **every Tuesday at 8pm** (Paris time), limited quantities!\nFollow us on Insta & TikTok: @ChayraKaftan`
          : `🔄 Réassort **chaque mardi à 20h**, quantités limitées !\nSuivez-nous : @ChayraKaftan sur Insta & TikTok`,
        suggestions,
      }

    // ==================== ENTRETIEN ====================
    case 'entretien':
      return {
        reply: `🧼 **Entretien :**\n• Lavage 30° cycle délicat\n• Séchage à plat, pas de sèche-linge\n• Repassage doux envers, éviter la broderie\n• Ranger sur cintre`,
        suggestions,
      }

    // ==================== PROMO ====================
    case 'promo':
      return {
        reply: `🎁 Code promo : **${BRAND.promo.code}** → ${BRAND.promo.discount} !\nÀ saisir au paiement sur chayrakaftan.com`,
        suggestions,
      }

    // ==================== CONTACT ====================
    case 'contact':
      return {
        reply: `📧 **chayrakaftan@gmail.com**\nInsta & TikTok : @ChayraKaftan\n\nRéponse sous 24h !`,
        suggestions,
      }

    // ==================== FALLBACK ====================
    default:
      return {
        reply: lang === 'en'
          ? 'Sorry, I didn\'t understand your request. 😅\nCan I help you with something else?'
          : 'Désolé, je n\'ai pas compris votre demande. 😅\nPuis-je vous aider avec autre chose ?',
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
