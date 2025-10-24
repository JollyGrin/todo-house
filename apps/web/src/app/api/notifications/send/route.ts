import { NextRequest, NextResponse } from 'next/server'
import { setupWebPush } from '@/lib/vapid'

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body, tag } = await request.json()
    
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No subscription provided' },
        { status: 400 }
      )
    }

    const webpush = setupWebPush()
    
    const payload = JSON.stringify({
      title: title || 'Todo House Notification',
      body: body || 'You have a new notification!',
      tag: tag || 'todo-house'
    })

    await webpush.sendNotification(subscription, payload)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully' 
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}