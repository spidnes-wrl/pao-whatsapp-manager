import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/db'
import { getAllLogs } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Vérifie l'authentification
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié.' },
        { status: 401 }
      )
    }

    const session = await verifySession(sessionToken)
    if (!session) {
      return NextResponse.json(
        { error: 'Session expirée.' },
        { status: 401 }
      )
    }

    const logs = await getAllLogs(50)
    return NextResponse.json({ logs }, { status: 200 })
  } catch (error) {
    console.error('Logs error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
