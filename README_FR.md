# P.A.O - Gestionnaire de Comptes WhatsApp

## Authentification Sécurisée

- **Code secret hashé** : Jamais stocké en clair
- **Session token** : Généré par serveur, stocké en cookie HttpOnly
- **Supabase** : Gère les sessions et les logs
- **Validation** : Tous les inputs sont vérifiés côté serveur
- **IP logging** : Chaque action enregistre l'IP exécutrice

## Architecture

```
Frontend (Next.js)
  ↓
API Routes (Vercel Serverless)
  ↓
Supabase (Sessions + Logs)
  ↓
WhatsApp Service (À intégrer)
```

## Installation & Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## Routes API

### `POST /api/verify-code`
Vérifie le code d'accès et crée une session.

**Body:**
```json
{ "code": "003 567 427" }
```

**Réponse:**
```json
{ "message": "Authentification réussie.", "token": "..." }
```

### `POST /api/whatsapp-action`
Exécute une action WhatsApp.

**Headers:**
- `Cookie: session_token=...`

**Body:**
```json
{
  "action": "search|unban|ban_spam|delete",
  "targetNumber": "+33612345678"
}
```

### `GET /api/logs`
Retourne les 50 derniers logs.

**Headers:**
- `Cookie: session_token=...`

## Sécurité

- ✅ Authentification requise
- ✅ Validation des inputs
- ✅ Logs centralisés
- ✅ Session token timeout
- ✅ HttpOnly cookies
- ✅ HTTPS obligatoire en prod
- ✅ IP tracking

## À intégrer

1. **API WhatsApp réelle** → Remplacer `executeWhatsAppAction()` dans `/api/whatsapp-action`
2. **Authentification avancée** → Ajouter 2FA si nécessaire
3. **Rate limiting** → Ajouter un système de quotas
4. **Notifications** → Alertes sur actions sensibles
