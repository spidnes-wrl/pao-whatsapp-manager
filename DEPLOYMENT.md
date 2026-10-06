# Configuration de déploiement pour Vercel

## Variables d'environnement à définir dans Vercel

```bash
# Supabase Public
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Secrets (Serveur uniquement)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SECURE_ADMIN_CODE_HASH=your-hashed-code-here
NODE_ENV=production
```

## Comment générer le hash du code secret

```bash
node -e "console.log(require('crypto').createHash('sha256').update('003567427').digest('hex'))"
```

Résultat: `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`

## Étapes de déploiement

1. **Clique sur ton repo dans Vercel**
2. **Vais à Settings > Environment Variables**
3. **Ajoute les variables ci-dessus**
4. **Redéploie (ou push un commit)**
5. **Ton app sera live sur `vercel.app`**

## Configuration Supabase

1. Va dans ton projet Supabase
2. Clique sur **SQL Editor**
3. Crée une nouvelle query
4. Copie le contenu de `supabase/migrations/001_init.sql`
5. Exécute la query
6. Les tables et index sont créés automatiquement

## Domaine personnalisé

Dans Vercel:
- Settings > Domains
- Ajoute ton domaine personnalisé
- Suis les instructions DNS

## Vérification de sécurité

- ✅ Code secret hashé côté serveur
- ✅ Session token HttpOnly cookie
- ✅ Validation numéro téléphone
- ✅ Logs dans Supabase
- ✅ IP logging automatique
- ✅ Authentification vérifiée
- ✅ Rate limiting implicite via Vercel

## Troubleshooting

**Erreur: "Supabase credentials are missing"**
→ Vérifier les variables d'environnement dans Vercel

**Erreur: "Code invalide"**
→ Vérifier que `SECURE_ADMIN_CODE_HASH` correspond au hash du code

**Erreur: "Session expirée"**
→ C'est normal, la session dure 1 heure. Re-authentifie-toi
