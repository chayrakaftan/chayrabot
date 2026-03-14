import { NextRequest, NextResponse } from 'next/server'
import { ChatRequest, ChatResponse, ChatContext, Lang } from '@/lib/types'
import { detectIntent, detectOrderNumber, detectEmail } from '@/lib/intents'
import { generateResponse } from '@/lib/responses'
import { detectLanguage, t, getSuggestions } from '@/lib/i18n'
import { getOrderByNumber, verifyEmail, formatOrderStatus } from '@/lib/shopify'
import { PRODUCTS } from '@/lib/knowledge-base'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const { message, context } = body
    if (!message || typeof message !== 'string') {
      return json({ reply: 'Message requis.', lang: 'fr' as Lang })
    }

    const lang: Lang = body.lang || detectLanguage(message)
    const msg = message.trim()

    // ============================================================
    // FLOW: Awaiting country for shipping cost
    // ============================================================
    if (context?.awaitingCountry) {
      const m = msg.toLowerCase()
      const suggestions = getSuggestions(lang)
      // "Autre question" → exit country flow
      if (/autre\s*(question|chose)/.test(m)) {
        return json({ reply: t('greeting', lang), suggestions, lang })
      }
      if (/(france|français|francais|métropole|metropole)/.test(m)) {
        return json({ reply: '📦 France : livraison **offerte dès 2 articles** ! Sinon 8,99€.', suggestions, lang })
      }
      if (/(belgique|luxembourg|belge|lux)/.test(m)) {
        return json({ reply: '📦 Belgique/Luxembourg : **15,99€**', suggestions, lang })
      }
      if (/(espagne|italie|allemagne|portugal|pays-bas|europe|eu|autre\s*pays)/.test(m)) {
        return json({ reply: '📦 Autres pays EU : **19,50€**', suggestions, lang })
      }
      // Not a country → try normal intent
      const intent = detectIntent(msg)
      if (intent !== 'question_generale') {
        const resp = generateResponse(intent, msg, lang)
        return json({ ...resp, lang })
      }
      // Still not understood → re-ask
      return json({
        reply: '📦 Dans quel pays êtes-vous ? (France, Belgique, autre pays EU)',
        suggestions: ['France', 'Belgique', 'Autre pays EU', 'Autre question'],
        context: { awaitingCountry: true },
        lang,
      })
    }

    // ============================================================
    // FLOW: Awaiting model for mannequin size
    // ============================================================
    if (context?.awaitingModel) {
      const m = msg.toLowerCase()
      const suggestions = getSuggestions(lang)
      if (/autre\s*(question|chose)/.test(m)) {
        return json({ reply: t('greeting', lang), suggestions, lang })
      }
      type CollectionKey = 'abaya' | 'papillon' | 'mixte'
      const collections: { key: CollectionKey; regex: RegExp; label: string }[] = [
        { key: 'abaya', regex: /(abaya)/, label: 'Gandoura Abaya' },
        { key: 'papillon', regex: /(papillon)/, label: 'Gandoura Papillon' },
        { key: 'mixte', regex: /(mixte)/, label: 'Gandoura Mixte' },
      ]
      for (const col of collections) {
        if (col.regex.test(m)) {
          const products = PRODUCTS.filter(p => p.collection === col.key)
          const colorSuggestions = products.map(p => p.name.split(' ').pop() || '').filter(Boolean)
          colorSuggestions.push('Autre question')
          return json({
            reply: lang === 'en'
              ? `📏 Which color of **${col.label}**?`
              : `📏 Quelle couleur de **${col.label}** ?`,
            suggestions: colorSuggestions,
            context: { awaitingColor: true, selectedCollection: col.key },
            lang,
          })
        }
      }
      const intent = detectIntent(msg)
      if (intent !== 'question_generale') {
        const resp = generateResponse(intent, msg, lang)
        return json({ ...resp, lang })
      }
      return json({
        reply: lang === 'en'
          ? '📏 Which model? Abaya, Papillon or Mixte?'
          : '📏 Quel modèle ? Abaya, Papillon ou Mixte ?',
        suggestions: ['Gandoura Abaya', 'Gandoura Papillon', 'Gandoura Mixte', 'Autre question'],
        context: { awaitingModel: true },
        lang,
      })
    }

    // ============================================================
    // FLOW: Awaiting color for mannequin size
    // ============================================================
    if (context?.awaitingColor && context.selectedCollection) {
      const m = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const suggestions = getSuggestions(lang)
      if (/autre\s*(question|chose)/.test(m)) {
        return json({ reply: t('greeting', lang), suggestions, lang })
      }
      const products = PRODUCTS.filter(p => p.collection === context.selectedCollection)
      const found = products.find(p => {
        const colorName = (p.name.split(' ').pop() || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return m.includes(colorName) || colorName.includes(m)
      })
      if (found) {
        return json({
          reply: lang === 'en'
            ? `📏 The mannequin size for **${found.name}** is **${found.mannequin}**.`
            : `📏 La taille du mannequin sur **${found.name}** est de **${found.mannequin}**.`,
          suggestions,
          lang,
        })
      }
      const intent = detectIntent(msg)
      if (intent !== 'question_generale') {
        const resp = generateResponse(intent, msg, lang)
        return json({ ...resp, lang })
      }
      const colorSuggestions = products.map(p => p.name.split(' ').pop() || '').filter(Boolean)
      colorSuggestions.push('Autre question')
      return json({
        reply: lang === 'en'
          ? '📏 Which color?'
          : '📏 Quelle couleur ?',
        suggestions: colorSuggestions,
        context: { awaitingColor: true, selectedCollection: context.selectedCollection },
        lang,
      })
    }

    // ============================================================
    // FLOW: Awaiting order number
    // ============================================================
    if (context?.awaitingOrderNumber) {
      const orderNum = detectOrderNumber(msg)
      if (orderNum) {
        return json({
          reply: t('askEmail', lang),
          context: { awaitingEmail: true, orderNumber: orderNum },
          lang,
        })
      }
      // Maybe they typed something else — detect intent normally
      // but remind them
      const intent = detectIntent(msg)
      if (intent !== 'suivi_commande') {
        const resp = generateResponse(intent, msg, lang)
        return json({ ...resp, lang })
      }
      return json({
        reply: t('askOrderNumber', lang),
        context: { awaitingOrderNumber: true },
        lang,
      })
    }

    // ============================================================
    // FLOW: Awaiting email for order verification
    // ============================================================
    if (context?.awaitingEmail && context.orderNumber) {
      const email = detectEmail(msg)
      if (email) {
        // Lookup order
        const order = await getOrderByNumber(context.orderNumber)
        if (!order) {
          return json({
            reply: t('orderNotFound', lang),
            suggestions: getSuggestions(lang),
            lang,
          })
        }
        if (!verifyEmail(order, email)) {
          return json({
            reply: t('emailMismatch', lang),
            context: { awaitingEmail: true, orderNumber: context.orderNumber },
            lang,
          })
        }
        // Format order status
        const status = formatOrderStatus(order)
        const orderName = order.name.replace('#', '')
        let reply = t(status.statusKey, lang, {
          order: orderName,
          tracking: status.tracking || '',
          trackingUrl: status.trackingUrl || 'https://chayrakaftan.com/apps/parcelpanel',
        })
        reply += `\n\n**Articles :** ${status.items}`
        reply += `\n**Statut :** ${status.status}`

        return json({
          reply,
          suggestions: getSuggestions(lang),
          lang,
        })
      }
      // Not a valid email — ask again
      return json({
        reply: t('askEmail', lang),
        context: { awaitingEmail: true, orderNumber: context.orderNumber },
        lang,
      })
    }

    // ============================================================
    // NORMAL FLOW: detect intent → generate response
    // ============================================================
    const intent = detectIntent(msg)

    // If message contains both order number and email directly
    if (intent === 'suivi_commande') {
      const orderNum = detectOrderNumber(msg)
      const email = detectEmail(msg)
      if (orderNum && email) {
        const order = await getOrderByNumber(orderNum)
        if (!order) {
          return json({
            reply: t('orderNotFound', lang),
            suggestions: getSuggestions(lang),
            lang,
          })
        }
        if (!verifyEmail(order, email)) {
          return json({
            reply: t('emailMismatch', lang),
            suggestions: getSuggestions(lang),
            lang,
          })
        }
        const status = formatOrderStatus(order)
        const orderName = order.name.replace('#', '')
        let reply = t(status.statusKey, lang, {
          order: orderName,
          tracking: status.tracking || '',
          trackingUrl: status.trackingUrl || 'https://chayrakaftan.com/apps/parcelpanel',
        })
        reply += `\n\n**Articles :** ${status.items}`
        reply += `\n**Statut :** ${status.status}`
        return json({ reply, suggestions: getSuggestions(lang), lang })
      }
      // Has order number but no email
      if (orderNum) {
        return json({
          reply: t('askEmail', lang),
          context: { awaitingEmail: true, orderNumber: orderNum },
          lang,
        })
      }
    }

    const resp = generateResponse(intent, msg, lang)
    return json({ ...resp, lang })

  } catch (err) {
    console.error('Chat API error:', err)
    return json({ reply: 'Une erreur est survenue. Réessayez ou contactez chayrakaftan@gmail.com.', lang: 'fr' as Lang }, 500)
  }
}

function json(data: Partial<ChatResponse> & { lang: Lang }, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}
