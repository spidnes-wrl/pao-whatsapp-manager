'use client'

import { useState } from 'react'
import { validatePhoneNumber } from '@/lib/validator'

type LogLevel = 'info' | 'success' | 'error' | 'warning'

interface LogEntry {
  message: string
  level: LogLevel
  timestamp: string
}

export default function AdminPanel() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([
    { message: 'Système initialisé. En attente de requête...', level: 'info', timestamp: new Date().toLocaleTimeString() }
  ])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string, level: LogLevel = 'info') => {
    setLogs(prev => [{
      message,
      level,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev])
  }

  const runAction = async (actionType: string, actionLabel: string) => {
    if (!phoneNumber.trim()) {
      addLog('Erreur : Veuillez entrer un numéro cible.', 'error')
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      addLog('Erreur : Numéro de téléphone invalide.', 'error')
      return
    }

    setLoading(true)
    addLog(`Cible [${phoneNumber}] : ${actionLabel}`, 'warning')

    try {
      const response = await fetch('/api/whatsapp-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          targetNumber: phoneNumber,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        addLog(`✓ SUCCESS : ${data.message}`, 'success')
      } else {
        addLog(`✗ ÉCHEC : ${data.error}`, 'error')
      }
    } catch (err) {
      addLog('✗ ERREUR RÉSEAU : Impossible de contacter le serveur.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Gestionnaire de Comptes WhatsApp</h2>
      <input
        type="text"
        placeholder="Numéro cible (ex: +33612345678)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={() => runAction('search', 'Recherche et analyse du compte...')}
        disabled={loading}
      >
        Rechercher le compte
      </button>
      <button
        className="btn-success"
        onClick={() => runAction('unban', 'Levée de la restriction (Débannissement) en cours...')}
        disabled={loading}
      >
        Débannir le compte
      </button>
      <button
        className="btn-secondary"
        onClick={() => runAction('ban_spam', 'Application d\'un blocage pour Spam...')}
        disabled={loading}
      >
        Bannir le compte (Spam)
      </button>
      <button
        className="btn-danger"
        onClick={() => runAction('delete', 'Suppression définitive du compte et des données en cours...')}
        disabled={loading}
      >
        Supprimer le compte
      </button>

      <div className="log-window">
        {logs.map((log, idx) => (
          <div key={idx} className={`log-entry log-${log.level}`}>
            <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}
