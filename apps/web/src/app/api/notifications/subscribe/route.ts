import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // In a real app, save this subscription to your database
    console.log('New push subscription:', subscription)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription saved successfully' 
    })
  } catch (error) {
    console.error('Error saving subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save subscription' },
      { status: 500 }
    )
  }
}