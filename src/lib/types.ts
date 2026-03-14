export type Intent =
  | 'suivi_commande'
  | 'retard'
  | 'info_produit'
  | 'livraison'
  | 'frais_livraison'
  | 'retour'
  | 'remboursement'
  | 'annulation'
  | 'changement_adresse'
  | 'taille'
  | 'restock'
  | 'entretien'
  | 'promo'
  | 'contact'
  | 'salutation'
  | 'remerciement'
  | 'question_generale'

export type Lang = 'fr' | 'en' | 'ar'

export interface ChatRequest {
  message: string
  sessionId?: string
  lang?: Lang
  context?: ChatContext
}

export interface ChatContext {
  awaitingOrderNumber?: boolean
  awaitingEmail?: boolean
  awaitingCountry?: boolean
  awaitingModel?: boolean
  orderNumber?: string
  email?: string
  lastIntent?: Intent
}

export interface ChatResponse {
  reply: string
  suggestions?: string[]
  context?: ChatContext
  lang: Lang
}

export interface Product {
  name: string
  collection: 'abaya' | 'mixte' | 'papillon'
  price: number
  color: string
  fabric: string
  sizes: string
  mannequin: string
  inStock: boolean
  description: string
}

export interface ShopifyOrder {
  id: number
  name: string
  email: string
  financial_status: string
  fulfillment_status: string | null
  created_at: string
  line_items: { title: string; quantity: number; price: string }[]
  shipping_address?: { address1: string; city: string; country: string }
  fulfillments?: { tracking_number: string; tracking_url: string; status: string }[]
  note?: string
  tags?: string
}
