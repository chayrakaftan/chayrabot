import { NextRequest, NextResponse } from 'next/server'
import { ChatRequest, ChatResponse, ChatContext, Lang } from '@/lib/types'
import { detectIntent, detectOrderNumber, detectEmail } from '@/lib/intents'
import { generateResponse } from '@/lib/responses'
import { detectLanguage, t, getSuggestions } from '@/lib/i18n'
import { getOrderByNumber, verifyEmail, formatOrderStatus } from '@/lib/shopify'

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
