'use client'

import { useState } from 'react'
import AdminPanel from '@/components/AdminPanel'
import AuthStep from '@/components/AuthStep'

type Step = 'identity' | 'code' | 'panel' | 'denied'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('identity')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleVerifyAgent = (answer: string) => {
    if (answer === 'oui') {
      setCurrentStep('code')
    } else {
      setCurrentStep('denied')
    }
  }

  const handleCodeVerified = () => {
    setIsAuthenticated(true)
    setCurrentStep('panel')
  }

  return (
    <div className="container">
      {currentStep === 'identity' && (
        <div className="step active">
          <h2>Protocole de Sécurité</h2>
          <p>Êtes-vous un agent autorisé de P.A.O ?</p>
          <button onClick={() => handleVerifyAgent('oui')}>OUI</button>
          <button className="btn-secondary" onClick={() => handleVerifyAgent('non')}>NON</button>
        </div>
      )}

      {currentStep === 'code' && (
        <AuthStep onSuccess={handleCodeVerified} />
      )}

      {currentStep === 'panel' && isAuthenticated && (
        <AdminPanel />
      )}

      {currentStep === 'denied' && (
        <div className="step active">
          <h2 style={{ color: '#d9534f' }}>Accès Refusé</h2>
          <p>Vous n'avez pas l'autorisation d'accéder à cet utilitaire.</p>
          <button className="btn-secondary" onClick={() => setCurrentStep('identity')}>Retour</button>
        </div>
      )}
    </div>
  )
}
