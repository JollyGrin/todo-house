import webpush from 'web-push'

export function generateVapidKeys() {
  return webpush.generateVAPIDKeys()
}

export function setupWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const email = process.env.VAPID_EMAIL || 'mailto:admin@todohouse.app'

  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys not configured')
  }

  webpush.setVapidDetails(email, publicKey, privateKey)
  return webpush
}