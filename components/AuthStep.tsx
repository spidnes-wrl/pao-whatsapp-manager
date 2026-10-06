'use client'

import { useState } from 'react'

interface AuthStepProps {
  onSuccess: () => void
}

export default function AuthStep({ onSuccess }: AuthStepProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (response.ok) {
        // Stocke le token en HttpOnly cookie (géré par le serveur)
        localStorage.setItem('session_token', data.token)
        onSuccess()
      } else {
        setError(data.error || 'Code invalide.')
      }
    } catch (err) {
      setError('Erreur serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="step active">
      <h2>Authentification Requise</h2>
      <p>Veuillez entrer le code d'accès pour continuer.</p>
      {error && <div className="error show">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Entrez le code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'VALIDER'}
        </button>
      </form>
    </div>
  )
}
