import { Intent } from './types'

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['']/g, "'")

// False positives for "retour" intent
const RETOUR_FALSE_POSITIVES = [
  'me retourner', 'donner un retour', 'votre retour', 'aucun retour',
  'pas de retour', 'retour de votre part', 'en retour', 'avoir un retour',
  'attends un retour', 'attend un retour', 'retour de la part',
]

export function detectIntent(message: string): Intent {
  const m = normalize(message)

  // --- Salutation ---
  if (/^(bonjour|bonsoir|salut|hello|hi|hey|salam|wa?\s?aleykoum|coucou)\b/.test(m) && m.length < 40) {
    return 'salutation'
  }

  // --- Remerciement / politesse seule ---
  if (/^(merci|thanks|shukran|ok|d'accord|parfait|super|genial|magnifique)\b/.test(m) && m.length < 60) {
    return 'remerciement'
  }

  // --- Suivi commande ---
  if (/(ou est|ou en est|suivi|suivre|track|numero de suivi|statut|status|commande.*livr|colis|recevo?ir|expedition|expedie|shipped)/.test(m)) {
    return 'suivi_commande'
  }

  // --- Annulation ---
  if (/(annul|cancel)/.test(m)) {
    return 'annulation'
  }

  // --- Remboursement ---
  if (/(rembours|refund|money back|recuperer.*argent)/.test(m)) {
    return 'remboursement'
  }

  // --- Retour (avec filtre faux positifs) ---
  if (/(retour|renvoyer|renvoi|return)/.test(m)) {
    const isFalsePositive = RETOUR_FALSE_POSITIVES.some(fp => m.includes(fp))
    if (!isFalsePositive) return 'retour'
  }

  // --- Changement d'adresse ---
  if (/(changer.*adresse|modifier.*adresse|mauvaise adresse|erreur.*adresse|nouvelle adresse|change.*address)/.test(m)) {
    return 'changement_adresse'
  }

  // --- Frais de livraison / prix ---
  if (/(frais.*livr|frais de port|cout.*livr|prix.*livr|combien.*livr|tarif.*livr|shipping cost|livr.*gratuit|gratuit.*livr|livr.*offert|offert.*livr|livraison.*prix|livraison.*combien)/.test(m)) {
    return 'frais_livraison'
  }

  // --- Délais de livraison / Aïd ---
  if (/(aid|eid|ramadan|fete|avant.*livr|livr.*avant|temps.*livr|a temps)/.test(m)) {
    return 'livraison'
  }
  if (/(delai|combien de temps|quand.*livr|livr.*quand|shipping|delivery|expedition|jours.*livr)/.test(m)) {
    return 'livraison'
  }
  // Fallback "livraison" seul → frais (demande le pays)
  if (/(livraison)/.test(m)) {
    return 'frais_livraison'
  }

  // --- Taille ---
  if (/(taille|size|mesure|mannequin|1m[0-9]{2}|36|38|40|42|44|46|ample|ajuste|grande|petite|longueur)/.test(m)) {
    return 'taille'
  }

  // --- Info produit ---
  if (/(matiere|tissu|fabric|lin|viscose|crepe|polyester|coton|soie|composition|opacite)/.test(m)) {
    return 'info_produit'
  }
  if (/(gandoura|abaya|papillon|kaftan|caftan|bleu ciel|bordeaux|emeraude|khol|rubis|ivoire|barbie|fushia|sable|azur|marine|perle|majorelle|zaji|blush|cannelle|brume|nuit)/.test(m)) {
    return 'info_produit'
  }
  if (/(produit|article|modele|collection|catalogue|disponible|stock|couleur|color|prix|price|combien coute)/.test(m)) {
    return 'info_produit'
  }

  // --- Restock ---
  if (/(restock|rupture|quand.*disponible|quand.*stock|revenir|back in stock|reapprovision)/.test(m)) {
    return 'restock'
  }

  // --- Entretien ---
  if (/(lav|entretien|repasser|repassage|secher|sechage|sech.*linge|nettoyer|tache|stain|iron|wash|care|froisse)/.test(m)) {
    return 'entretien'
  }

  // --- Promo ---
  if (/(promo|code|reduction|discount|coupon|ramadan15|solde)/.test(m)) {
    return 'promo'
  }

  // --- Contact ---
  if (/(contact|email|telephone|appeler|joindre|adresse.*boutique|magasin|whatsapp)/.test(m)) {
    return 'contact'
  }

  // --- Fabrication / origine ---
  if (/(fabri[qc]|origine|maroc|fait.*main|artisan|handmade|sfifa|broder)/.test(m)) {
    return 'info_produit'
  }

  return 'question_generale'
}

export function detectOrderNumber(message: string): string | null {
  const match = message.match(/#?\s*(\d{3,6})\b/)
  return match ? match[1] : null
}

export function detectEmail(message: string): string | null {
  const match = message.match(/[\w.-]+@[\w.-]+\.\w{2,}/)
  return match ? match[0].toLowerCase() : null
}
