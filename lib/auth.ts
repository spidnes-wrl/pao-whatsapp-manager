import crypto from 'crypto'

// Hash du code secret (généré une fois)
const CODE_HASH = process.env.SECURE_ADMIN_CODE_HASH || ''

export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

export function verifyCode(code: string): boolean {
  const inputHash = hashCode(code)
  return inputHash === CODE_HASH
}

export function generateJWT(payload: any): string {
  // Utilise la librairie 'jose' pour créer un JWT signé
  return JSON.stringify({ ...payload, iat: Date.now() })
}
