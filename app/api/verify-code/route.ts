import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// À générer une fois et stocker en variable d'env
// Exemple: node -e "console.log(require('crypto').createHash('sha256').update('003567427').digest('hex'))"
const SECURE_CODE_HASH = process.env.SECURE_ADMIN_CODE_HASH || ''

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
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

    const inputHash = hashCode(code.trim().replace(/[\s-]/g, ''))

    if (inputHash === SECURE_CODE_HASH) {
      const token = crypto.randomBytes(32).toString('hex')
      const response = NextResponse.json(
        { message: 'Authentification réussie.', token },
        { status: 200 }
      )

      // HttpOnly cookie (plus sécurisé)
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 heure
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Code invalide.' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
