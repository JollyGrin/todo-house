'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { useState } from 'react'

export default function Home() {
  const { 
    permission, 
    subscription, 
    isSupported, 
    requestPermission, 
    subscribe, 
    sendTestNotification 
  } = useNotifications()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true)
      setMessage('')
      
      const perm = await requestPermission()
      if (perm === 'granted') {
        await subscribe()
        setMessage('✅ Notifications enabled successfully!')
      } else {
        setMessage('❌ Notification permission denied')
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendTest = async () => {
    try {
      setIsLoading(true)
      setMessage('')
      
      await sendTestNotification()
      setMessage('🚀 Test notification sent!')
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">TH</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo House</h1>
            <p className="text-gray-600">PWA Notification Test</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h2 className="font-semibold text-gray-900 mb-3">System Status</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Browser Support:</span>
                  <span className={isSupported ? "text-green-600" : "text-red-600"}>
                    {isSupported ? "✅ Supported" : "❌ Not Supported"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Permission:</span>
                  <span className={`${
                    permission === 'granted' ? 'text-green-600' : 
                    permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {permission === 'granted' ? '✅ Granted' : 
                     permission === 'denied' ? '❌ Denied' : '⏳ Default'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscription:</span>
                  <span className={subscription ? "text-green-600" : "text-gray-500"}>
                    {subscription ? "✅ Active" : "❌ Not Active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {permission !== 'granted' || !subscription ? (
                <button
                  onClick={handleEnableNotifications}
                  disabled={!isSupported || isLoading}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                >
                  {isLoading ? 'Enabling...' : 'Enable Notifications'}
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Test Notification'}
                </button>
              )}
            </div>

            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">{message}</p>
              </div>
            )}

            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>This is a PWA test app for notifications.</p>
              <p>Install this app to your home screen for the best experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}