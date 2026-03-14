import { Lang } from './types'

type Strings = Record<string, string>

const FR: Strings = {
  welcome: 'Bonjour ! 👋 Comment puis-je vous aider ?',
  askOrderNumber: 'Pour suivre votre commande, merci de me communiquer votre **numéro de commande** (ex: #1234).',
  askEmail: 'Merci ! Pour vérifier, quel est l\'**email** utilisé lors de votre achat ?',
  orderNotFound: 'Je n\'ai pas trouvé de commande avec ces informations. Vérifiez le numéro et l\'email, ou contactez-nous à chayrakaftan@gmail.com.',
  emailMismatch: 'L\'email ne correspond pas à cette commande. Veuillez vérifier et réessayer.',
  orderPaid: '✅ Votre commande **#{order}** est confirmée et en cours de préparation.',
  orderShipped: '📦 Votre commande **#{order}** a été expédiée !\nNuméro de suivi : **{tracking}**\n🔗 [Suivre mon colis]({trackingUrl})',
  orderDelivered: '✅ Votre commande **#{order}** a été livrée !',
  orderRefunded: '💰 Votre commande **#{order}** a été remboursée.',
  orderProcessing: '⏳ Votre commande **#{order}** est en cours de traitement. Expédition sous 2 à 7 jours ouvrés.',
  escalate: 'Pour cette demande, je vous invite à contacter notre équipe par email : **chayrakaftan@gmail.com** en précisant votre numéro de commande.',
  thanks: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. 😊',
  greeting: 'Bonjour ! 👋 Comment puis-je vous aider aujourd\'hui ?',
}

const EN: Strings = {
  welcome: 'Hello! 👋 How can I help you?',
  askOrderNumber: 'To track your order, please provide your **order number** (e.g., #1234).',
  askEmail: 'Thank you! To verify, what **email** did you use when ordering?',
  orderNotFound: 'I couldn\'t find an order with this information. Please check and try again, or contact us at chayrakaftan@gmail.com.',
  emailMismatch: 'The email doesn\'t match this order. Please verify and try again.',
  orderPaid: '✅ Your order **#{order}** is confirmed and being prepared.',
  orderShipped: '📦 Your order **#{order}** has been shipped!\nTracking: **{tracking}**\n🔗 [Track my parcel]({trackingUrl})',
  orderDelivered: '✅ Your order **#{order}** has been delivered!',
  orderRefunded: '💰 Your order **#{order}** has been refunded.',
  orderProcessing: '⏳ Your order **#{order}** is being processed. Shipping within 2-7 business days.',
  escalate: 'For this request, please contact our team at: **chayrakaftan@gmail.com** with your order number.',
  thanks: 'You\'re welcome! Don\'t hesitate if you have more questions. 😊',
  greeting: 'Hello! 👋 How can I help you today?',
}

const AR: Strings = {
  welcome: '!مرحبا 👋 كيف يمكنني مساعدتك؟',
  askOrderNumber: 'لتتبع طلبك، يرجى إعطائي **رقم الطلب** (مثال: #1234)',
  askEmail: 'شكراً! للتحقق، ما هو **البريد الإلكتروني** المستخدم عند الشراء؟',
  orderNotFound: 'لم أجد طلبًا بهذه المعلومات. يرجى التحقق أو التواصل معنا على chayrakaftan@gmail.com',
  emailMismatch: 'البريد الإلكتروني لا يتطابق مع هذا الطلب.',
  orderPaid: '✅ طلبك **#{order}** مؤكد وقيد التحضير.',
  orderShipped: '📦 تم شحن طلبك **#{order}**!\nرقم التتبع: **{tracking}**',
  orderDelivered: '✅ تم تسليم طلبك **#{order}**!',
  orderRefunded: '💰 تم استرداد مبلغ طلبك **#{order}**.',
  orderProcessing: '⏳ طلبك **#{order}** قيد المعالجة. الشحن خلال 2-7 أيام عمل.',
  escalate: 'لهذا الطلب، يرجى التواصل معنا على: **chayrakaftan@gmail.com**',
  thanks: '!على الرحب والسعة 😊',
  greeting: '!مرحبا 👋 كيف يمكنني مساعدتك اليوم؟',
}

const STRINGS: Record<Lang, Strings> = { fr: FR, en: EN, ar: AR }

export function t(key: string, lang: Lang, vars?: Record<string, string>): string {
  let str = STRINGS[lang]?.[key] || STRINGS.fr[key] || key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }
  }
  return str
}

export function detectLanguage(message: string): Lang {
  const m = message.toLowerCase()
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(message) || /salam|inshallah|mashallah|alhamdulillah/.test(m)) return 'ar'
  // English detection
  if (/\b(hello|hi|hey|please|thank|where|when|how|what|order|delivery|return|refund|size|my|is|the)\b/.test(m)) return 'en'
  // Default French
  return 'fr'
}

export function getSuggestions(lang: Lang): string[] {
  if (lang === 'en') return ['Where is my order?', 'Shipping cost', 'Delivery times', 'How to return?', 'Size guide', 'Contact us']
  if (lang === 'ar') return ['أين طلبي؟', 'تكلفة الشحن', 'مواعيد التوصيل', 'كيفية الإرجاع', 'دليل المقاسات', 'اتصل بنا']
  return ['Où est ma commande ?', 'Frais de livraison', 'Délais de livraison', 'Retour', 'Tailles', 'Nous contacter']
}
