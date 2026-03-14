import { ShopifyOrder } from './types'

const SHOP_URL = 'https://chayrakaftan-2.myshopify.com'
const API_VERSION = '2026-01'

function getToken(): string {
  const token = process.env.SHOPIFY_ACCESS_TOKEN
  if (!token) throw new Error('SHOPIFY_ACCESS_TOKEN not set')
  return token
}

export async function getOrderByNumber(orderNumber: string): Promise<ShopifyOrder | null> {
  const num = orderNumber.replace('#', '').trim()
  const url = `${SHOP_URL}/admin/api/${API_VERSION}/orders.json?name=%23${num}&status=any&fields=id,name,email,financial_status,fulfillment_status,created_at,line_items,shipping_address,fulfillments,note,tags`

  try {
    const res = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': getToken(),
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return null
    const data = await res.json()
    const orders = data.orders || []
    return orders.length > 0 ? orders[0] : null
  } catch {
    return null
  }
}

export function verifyEmail(order: ShopifyOrder, email: string): boolean {
  return order.email?.toLowerCase() === email.toLowerCase()
}

export function formatOrderStatus(order: ShopifyOrder): {
  status: string
  tracking?: string
  trackingUrl?: string
  items: string
  statusKey: string
} {
  const items = (order.line_items || [])
    .map(li => `${li.title} x${li.quantity}`)
    .join(', ')

  const fulfillment = order.fulfillments?.[0]
  const tracking = fulfillment?.tracking_number || undefined
  const trackingUrl = fulfillment?.tracking_url || 'https://chayrakaftan.com/apps/parcelpanel'

  // Determine status key
  let statusKey = 'orderProcessing'
  if (order.financial_status === 'refunded') {
    statusKey = 'orderRefunded'
  } else if (order.fulfillment_status === 'fulfilled') {
    if (fulfillment?.status === 'delivered' || order.tags?.includes('delivered')) {
      statusKey = 'orderDelivered'
    } else {
      statusKey = 'orderShipped'
    }
  } else if (order.financial_status === 'paid') {
    statusKey = order.fulfillment_status ? 'orderShipped' : 'orderPaid'
  }

  const statusMap: Record<string, string> = {
    paid: 'Payée',
    pending: 'En attente de paiement',
    refunded: 'Remboursée',
    partially_refunded: 'Partiellement remboursée',
    voided: 'Annulée',
  }
  const fulfillmentMap: Record<string, string> = {
    fulfilled: 'Expédiée',
    partial: 'Partiellement expédiée',
    unfulfilled: 'En préparation',
  }

  const financialLabel = statusMap[order.financial_status] || order.financial_status
  const fulfillmentLabel = fulfillmentMap[order.fulfillment_status || 'unfulfilled'] || 'En préparation'

  return {
    status: `${financialLabel} — ${fulfillmentLabel}`,
    tracking,
    trackingUrl,
    items,
    statusKey,
  }
}
