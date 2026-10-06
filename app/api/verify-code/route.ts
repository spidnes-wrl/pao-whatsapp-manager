import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSession } from '@/lib/db'

const SECURE_CODE_HASH = process.env.SECURE_ADMIN_CODE_HASH || ''

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Code manquant.' },
        { status: 400 }
      )
    }

    // Nettoie le code (espaces, tirets)
    const cleanCode = code.trim().replace(/[\s-]/g, '')
    const inputHash = hashCode(cleanCode)

    // Vérification du code
    if (inputHash !== SECURE_CODE_HASH) {
      return NextResponse.json(
        { error: 'Code invalide.' },
        { status: 401 }
      )
    }

    // Génère un token de session
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const clientIp = getClientIp(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Enregistre la session dans Supabase
    await createSession(sessionToken, clientIp, userAgent)

    const response = NextResponse.json(
      { message: 'Authentification réussie.', token: sessionToken },
      { status: 200 }
    )

    // HttpOnly cookie sécurisé
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 heure
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
