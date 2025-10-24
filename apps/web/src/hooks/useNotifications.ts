'use client'

import { useState, useEffect } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('serviceWorker' in navigator && 'PushManager' in window)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported')
    }

    const permission = await Notification.requestPermission()
    setPermission(permission)
    return permission
  }

  const subscribe = async () => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    const registration = await navigator.serviceWorker.ready
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

    if (!publicKey) {
      throw new Error('VAPID public key not configured')
    }

    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })

    setSubscription(pushSubscription)

    // Save subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pushSubscription)
    })

    return pushSubscription
  }

  const sendTestNotification = async () => {
    if (!subscription) {
      throw new Error('No subscription available')
    }

    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        title: 'Test Notification',
        body: 'This is a test notification from Todo House!',
        tag: 'test'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send notification')
    }

    return response.json()
  }

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    subscribe,
    sendTestNotification
  }
}