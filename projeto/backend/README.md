# Backend — Notificações + Gmail

Servidor mínimo em Node.js/Express que:
1. Recebe `POST /notificacoes` do frontend
2. Insere no banco (exemplo com array em memória)
3. Se `enviarEmail: true`, dispara um e-mail via **Gmail API** com deep link

## 1. Criar projeto no Google Cloud

1. Acesse https://console.cloud.google.com
2. Crie um projeto (ex: `cetep-notificacoes`)
3. **APIs & Services → Library** → ative **Gmail API**
4. **APIs & Services → OAuth consent screen**:
   - Tipo: **Internal** (se for Workspace) ou **External**
   - Scopes: `https://www.googleapis.com/auth/gmail.send`
5. **Credentials → Create Credentials → OAuth client ID**:
   - Tipo: **Web application**
   - Authorized redirect URI: `https://developers.google.com/oauthplayground`

## 2. Gerar o refresh token

1. Abra https://developers.google.com/oauthplayground
2. Engrenagem (canto superior direito) → marque **Use your own OAuth credentials**
3. Cole `Client ID` e `Client Secret`
4. No painel esquerdo, selecione **Gmail API v1 → https://mail.google.com/**
5. Clique em **Authorize APIs** → faça login com a conta institucional
6. Clique em **Exchange authorization code for tokens** → copie o **Refresh token**

## 3. Configurar `.env`

Copie `.env.example` para `.env` e preencha:

```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REFRESH_TOKEN=xxx
GMAIL_SENDER=nao-responda@cetep-araci.br
PORT=3001
```

## 4. Rodar

```bash
cd backend-reference
npm install
npm run dev
```

## 5. Integrar com o frontend

No `.env` do Vite:
```
VITE_API_URL=http://localhost:3001
```