# 🚀 Vercel Deployment - Mobili Più

## Pregled

Ovaj projekat je konfigurisan za deploy frontend-a na Vercel kao statična stranica. Backend treba da se deploy-uje posebno na drugom servisu.

## Frontend Deploy na Vercel

### 1. Priprema za build

Projekat koristi custom `vercel-build` script koji:
- Instalira backend dependencies (za build proces)
- Instalira frontend dependencies  
- Build-uje frontend aplikaciju

### 2. Environment varijable

Frontend koristi `VITE_API_URL` environment varijablu za konekciju na backend API.

**Lokalno (development):**
```
VITE_API_URL=http://localhost:8000/api
```

**Production (Vercel):**
```
VITE_API_URL=https://your-backend-domain.com/api
```

### 3. Vercel konfiguracija

Postaviti environment varijable u Vercel dashboard:
1. Idite na Project Settings
2. Environment Variables
3. Dodajte: `VITE_API_URL` = `https://your-backend-url.com/api`

### 4. Deploy komande

**Za auto-deploy sa GitHub:**
- Push na main branch automatski triggera deploy

**Za manual deploy:**
```bash
npx vercel --prod
```

## Backend Deploy

Backend treba da se deploy-uje na servisu koji podržava Node.js aplikacije:

### Preporučeni servisi:
- **Railway** (besplatan tier)
- **Heroku** 
- **Render**
- **DigitalOcean App Platform**

### Environment varijable za backend:
```
SUPABASE_URL=https://gsurwyuqztsxpxfevqti.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ3eXVxenRzeHB4ZmV2cXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTU3MjAsImV4cCI6MjA2NjY5MTcyMH0.8FCKuhvUJ5tckgYnMqt6foj8lQwb1ScV2GpswbftF0w
GMAIL_USER=info.mobilipiu@gmail.com
GMAIL_APP_PASSWORD=wjzz nahw heap keap
GMAIL_FROM_NAME=Mail
NODE_ENV=production
PORT=8000
```

### Backend deploy script:
```bash
npm install
npm start
```

## Troubleshooting

### "vite: command not found" greška
Ova greška je riješena sa novim `vercel-build` scriptom koji eksplicitno instalira dependencies.

### CORS greške
Ako doživljavate CORS greške, dodajte frontend domain u backend CORS konfiguraciju.

### API konekcija ne radi
1. Provjerite da li je `VITE_API_URL` pravilno postavljena u Vercel
2. Provjerite da li backend vraća HTTPS odgovor
3. Provjerite Network tab u browser dev tools za greške

## Korisni linkovi

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Supabase Documentation](https://supabase.com/docs)

## Status

- ✅ Frontend build process konfiguriran
- ✅ Vercel.json konfiguriran za SPA
- ✅ Environment varijable dokumentovane
- ⏳ Backend deploy (needs separate deployment)
- ⏳ VITE_API_URL environment varijabla (postaviti u Vercel)

## Environment Varijable za Vercel

U Vercel Dashboard -> Settings -> Environment Variables dodajte sljedeće:

### Backend Environment Varijable:

```bash
# Supabase konfiguracija
SUPABASE_URL=https://gsurwyuqztsxpxfevqti.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ3eXVxenRzeHB4ZmV2cXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTU3MjAsImV4cCI6MjA2NjY5MTcyMH0.8FCKuhvUJ5tckgYnMqt6foj8lQwb1ScV2GpswbftF0w
DATABASE_URL=postgresql://postgres:Fabijanic099@db.gsurwyuqztsxpxfevqti.supabase.co:5432/postgres

# Gmail SMTP konfiguracija
GMAIL_USER=info.mobilipiu@gmail.com
GMAIL_APP_PASSWORD=wjzz nahw heap keap
GMAIL_FROM_NAME=Mail

# Production konfiguracija
NODE_ENV=production
```

### Frontend Environment Varijable:

```bash
# API URL (zameniti sa stvarnim Vercel domenom)
VITE_API_URL=https://your-app-name.vercel.app/api
```

## ⚠️ VAŽNO: Alternativni Pristup

Za jednostavniji deployment, preporučujem **odvojeni deployment**:
- Frontend (Vue.js) na Vercel  
- Backend (Express.js) na Railway, Render ili Heroku

## 📋 Koraci za Full-Stack Deployment na Vercel:

### 1. Push kod na GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Mobili Più website"
git remote add origin https://github.com/your-username/mobili-piu.git
git push -u origin main
```

### 2. Vercel Deployment - AŽURIRANE INSTRUKCIJE:

**Opcija A: Full-Stack (koristi vercel.json):**
1. Idite na [vercel.com](https://vercel.com)
2. Registrirajte se sa GitHub računom
3. Kliknite "New Project" ili "Import Project"
4. Odaberite svoj GitHub repository: `PatrikF1/MobiliPiu`
5. **Framework Preset**: Other
6. **Root Directory**: `./` (root)
7. **Build Command**: `npm run vercel-build` 
8. **Output Directory**: `frontend/dist`
9. **Install Command**: `npm install`

**Opcija B: Samo Frontend (ako A ne radi):**
1. Kopirajte `vercel-simple.json` u `frontend/vercel.json`
2. Upload samo `frontend` folder kao novi repo na GitHub
3. U Vercel odaberite frontend repo
4. Vercel će automatski detektovati Vite projekt

### 3. Environment Varijable:
1. U Project Settings -> Environment Variables
2. Dodajte sve varijable navedene gore
3. Postavite ih za sve environments (Production, Preview, Development)

### 4. Custom Domain (opcionalno):
1. Idite na Project Settings -> Domains
2. Dodajte svoj domain (npr. mobilipiu.hr)
3. Konfigurirajte DNS prema Vercel instrukcijama

## 🔧 Troubleshooting:

### Uobičajeni problemi:

1. **API pozivi ne rade**:
   - Provjerite da je `VITE_API_URL` postavljena
   - Zamenite sa stvarnim Vercel domenom

2. **Email ne radi**:
   - Provjerite Gmail App Password
   - Provjerite da su environment varijable postavljene

3. **Build fails - "vite: command not found"**:
   - ✅ RIJEŠENO: Koristite nova build komanda `npm run vercel-build`
   - Ili koristite Opciju B (samo frontend)
   - Provjerite da li vercel.json ima ispravnu konfiguraciju

4. **Build fails - općenito**:
   - Provjerite da li frontend ima build script
   - Provjerite logs u Vercel dashboard

### Build Command za Vercel:
Vercel automatski detektira build konfiguraciju iz `vercel.json`.

### Lokalni Testing:
```bash
# Install Vercel CLI
npm i -g vercel

# Test locally
vercel dev
```

## 📱 Finalna Provera:

Kad je deployment gotov:
- ✅ Početna stranica se učitava
- ✅ Proizvodi se učitavaju iz Supabase
- ✅ Contact forma šalje email
- ✅ Admin panel radi
- ✅ Favicon se prikazuje

## 🌐 Live URL:
Nakon deployment-a, aplikacija će biti dostupna na:
`https://your-app-name.vercel.app` 

---

## 🚀 JEDNOSTAVNO REŠENJE - Samo Frontend

Za brži početak, možete deploy-ovati samo frontend sa mock podacima:

### 1. Priprema:
```bash
# U frontend direktorijumu
cd frontend
npm run build
```

### 2. Vercel Deployment:
1. Upload-ujte samo `frontend` folder na GitHub
2. Vercel će automatski detektovati Vue.js
3. Aplikacija će raditi sa mock podacima

### 3. Dodavanje Backend-a Kasnije:
Kada budete spremni za produkciju:
- Deploy backend na Railway/Render  
- Ažurirajte `VITE_API_URL` u Vercel env varijablama