# P.A.O - Gestionnaire de Comptes WhatsApp

## Déploiement Vercel + Supabase

### Prérequis
- Compte Supabase
- Compte Vercel
- Node.js 18+

### Installation locale
```bash
git clone https://github.com/spidnes-wrl/pao-whatsapp-manager.git
cd pao-whatsapp-manager
npm install
npm run dev
```

### Variables d'environnement
Copie `.env.example` en `.env.local` et remplis tes clés Supabase.

### Déploiement Vercel
```bash
npm install -g vercel
vercel
```

Ajoute les variables d'environnement dans les paramètres Vercel.

## Architecture Sécurité
- ✅ Authentification JWT via Supabase
- ✅ Code secret hashé côté serveur
- ✅ Rate limiting sur API
- ✅ Logs de toutes les actions
- ✅ Chiffrement des données sensibles
