import { NextRequest, NextResponse } from 'next/server'
import { validatePhoneNumber, sanitizeInput } from '@/lib/validator'

// Simule l'intégration WhatsApp (à remplacer par ton API réelle)
async function executeWhatsAppAction(
  action: string,
  phoneNumber: string
): Promise<{ success: boolean; message: string }> {
  // Exemple d'intégration avec une API WhatsApp réelle
  // Remplace par ton endpoint réel (Twilio, Green API, etc.)
  
  const actions: { [key: string]: string } = {
    search: 'Compte trouvé et analysé',
    unban: 'Restriction levée avec succès',
    ban_spam: 'Compte bloqué pour Spam',
    delete: 'Compte supprimé définitivement',
  }

  // Simule un appel API
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
    // Vérifie que le token de session existe
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié.' },
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

    // Valide le numéro
    if (!validatePhoneNumber(targetNumber)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide.' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedNumber = sanitizeInput(targetNumber)
    const sanitizedAction = sanitizeInput(action)

    // Log l'action (à envoyer dans Supabase ou une DB)
    console.log(`[${new Date().toISOString()}] Action: ${sanitizedAction}, Cible: ${sanitizedNumber}`)

    // Exécute l'action WhatsApp
    const result = await executeWhatsAppAction(sanitizedAction, sanitizedNumber)

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
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
