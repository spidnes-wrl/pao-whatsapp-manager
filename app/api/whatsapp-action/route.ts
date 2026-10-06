import { NextRequest, NextResponse } from 'next/server'
import { validatePhoneNumber, sanitizeInput } from '@/lib/validator'
import { verifySession, logAction } from '@/lib/db'

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || 'unknown'
}

// Simule l'exécution d'une action WhatsApp réelle
async function executeWhatsAppAction(
  action: string,
  phoneNumber: string
): Promise<{ success: boolean; message: string }> {
  // À remplacer par ton API réelle (Twilio, GreenAPI, etc.)
  
  const actions: { [key: string]: string } = {
    search: 'Compte trouvé et analysé',
    unban: 'Restriction levée avec succès',
    ban_spam: 'Compte bloqué pour Spam',
    delete: 'Compte supprimé définitivement',
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: actions[action] || 'Action complétée',
      })
    }, 2000)
  })
}

export async function POST(request: NextRequest) {
  try {
    // Vérifie l'authentification
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié.' },
        { status: 401 }
      )
    }

    // Valide la session dans Supabase
    const session = await verifySession(sessionToken)
    if (!session) {
      return NextResponse.json(
        { error: 'Session expirée ou invalide.' },
        { status: 401 }
      )
    }

    const { action, targetNumber } = await request.json()

    if (!action || !targetNumber) {
      return NextResponse.json(
        { error: 'Paramètres manquants.' },
        { status: 400 }
      )
    }

    // Valide le numéro de téléphone
    if (!validatePhoneNumber(targetNumber)) {
      await logAction(action, targetNumber, 'failed', 'Numéro invalide', getClientIp(request))
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide.' },
        { status: 400 }
      )
    }

    const sanitizedNumber = sanitizeInput(targetNumber)
    const sanitizedAction = sanitizeInput(action)

    // Enregistre l'action en attente
    await logAction(sanitizedAction, sanitizedNumber, 'pending', 'Exécution en cours...', getClientIp(request))

    // Exécute l'action WhatsApp
    const result = await executeWhatsAppAction(sanitizedAction, sanitizedNumber)

    // Enregistre le résultat
    await logAction(
      sanitizedAction,
      sanitizedNumber,
      result.success ? 'success' : 'failed',
      result.message,
      getClientIp(request)
    )

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Action error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
