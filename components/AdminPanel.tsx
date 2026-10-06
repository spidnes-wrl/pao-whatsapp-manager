'use client'

import { useState, useEffect } from 'react'
import { validatePhoneNumber } from '@/lib/validator'

type LogLevel = 'info' | 'success' | 'error' | 'warning'

interface LogEntry {
  id?: string
  action_type: string
  target_number: string
  status: 'pending' | 'success' | 'failed'
  result_message: string
  created_at?: string
  level?: LogLevel
  timestamp?: string
}

export default function AdminPanel() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      action_type: 'system',
      target_number: '-',
      status: 'success',
      result_message: 'Système initialisé. En attente de requête...',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
    },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs')
      if (response.ok) {
        const data = await response.json()
        setLogs((prev) => [...data.logs, ...prev.slice(0, 50)])
      }
    } catch (err) {
      console.error('Error fetching logs:', err)
    }
  }

  const addLog = (entry: Omit<LogEntry, 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      timestamp: new Date().toLocaleTimeString(),
      level: entry.status === 'success' ? 'success' : entry.status === 'failed' ? 'error' : 'warning',
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const runAction = async (actionType: string, actionLabel: string) => {
    if (!phoneNumber.trim()) {
      addLog({
        action_type: actionType,
        target_number: phoneNumber || 'N/A',
        status: 'failed',
        result_message: 'Erreur : Veuillez entrer un numéro cible.',
      })
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      addLog({
        action_type: actionType,
        target_number: phoneNumber,
        status: 'failed',
        result_message: 'Erreur : Numéro de téléphone invalide.',
      })
      return
    }

    setLoading(true)
    addLog({
      action_type: actionType,
      target_number: phoneNumber,
      status: 'pending',
      result_message: actionLabel,
    })

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
        addLog({
          action_type: actionType,
          target_number: phoneNumber,
          status: 'success',
          result_message: `✓ SUCCESS : ${data.message}`,
        })
      } else {
        addLog({
          action_type: actionType,
          target_number: phoneNumber,
          status: 'failed',
          result_message: `✗ ÉCHEC : ${data.error}`,
        })
      }
    } catch (err) {
      addLog({
        action_type: actionType,
        target_number: phoneNumber,
        status: 'failed',
        result_message: '✗ ERREUR RÉSEAU : Impossible de contacter le serveur.',
      })
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
        onClick={() => runAction('ban_spam', "Application d'un blocage pour Spam...")}
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
          <div key={idx} className={`log-entry log-${log.level || log.status}`}>
            <span style={{ color: '#888' }}>[{log.timestamp || new Date().toLocaleTimeString()}]</span> {log.result_message}
          </div>
        ))}
      </div>
    </div>
  )
}
