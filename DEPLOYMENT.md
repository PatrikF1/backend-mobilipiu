# 🚀 Deployment Instrukcije - Mobili Più

## Hosting na Vercel (Preporučeno)

### 1. Priprema

1. **Registracija na Vercel:**
   - Idite na [vercel.com](https://vercel.com)
   - Registrirajte se sa GitHub računom

2. **Push kod na GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/mobili-piu.git
   git push -u origin main
   ```

### 2. Environment Varijable

U Vercel dashboard, dodajte ove environment varijable:

```bash
# Supabase konfiguracija
SUPABASE_URL=https://gsurwyuqztsxpxfevqti.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:Fabijanic099@db.gsurwyuqztsxpxfevqti.supabase.co:5432/postgres

# Gmail SMTP konfiguracija
GMAIL_USER=info.mobilipiu@gmail.com
GMAIL_APP_PASSWORD=wjzz nahw heap keap
GMAIL_FROM_NAME=Mail

# Production konfiguracija
NODE_ENV=production

# Frontend API URL (zameniti sa vašim Vercel domenom)
VITE_API_URL=https://your-app-name.vercel.app/api
```

### 3. Deployment Steps

1. **Povežite GitHub repo sa Vercel:**
   - U Vercel dashboard kliknite "New Project"
   - Izaberite svoj GitHub repo
   - Vercel će automatski detektovati konfiguraciju

2. **Konfiguracija build settings:**
   ```
   Build Command: npm run build
   Output Directory: frontend/dist
   Install Command: npm run install-deps
   ```

3. **Deploy:**
   - Kliknite "Deploy"
   - Čekajte da se deployment završi
   - Vaša aplikacija će biti dostupna na `https://your-app-name.vercel.app`

### 4. Automatski Re-deployment

- Svaki put kada push-ujete kod na GitHub, Vercel će automatski re-deploy aplikaciju
- Možete editovati kod lokalno i push-ovati izmene

### 5. Custom Domain (Opciono)

1. U Vercel dashboard, idite na Settings > Domains
2. Dodajte vaš custom domain (npr. mobilipiu.hr)
3. Konfigurišite DNS rekorde kod vašeg domain providera

## Alternativni Hosting Options

### Railway
- Odličan za Node.js aplikacije
- Besplatan plan dostupan
- [railway.app](https://railway.app)

### Render
- Besplatan za statičke sajtove
- Plaćen za backend servise
- [render.com](https://render.com)

### Netlify
- Najbolji za frontend-only aplikacije
- [netlify.com](https://netlify.com)

## Production Tips

1. **Monitoring:**
   - Koristite Vercel Analytics za monitoring performansi
   - Postavite error tracking (Sentry)

2. **Performance:**
   - Optimizujte slike pre upload-a
   - Koristite CDN za statički sadržaj

3. **Security:**
   - Redovno ažurirajte dependencies
   - Koristite HTTPS (automatski na Vercel)
   - Postavite rate limiting za API

4. **Backup:**
   - Redovno backup-ujte Supabase bazu
   - Koristite GitHub za version control

## Troubleshooting

### Ako deployment ne radi:

1. **Proverite build logove** u Vercel dashboard
2. **Proverite environment varijable** - da li su sve podešene
3. **Proverite API URL** - da li frontend koristi pravilnu URL
4. **Proverite browser konzolu** za JavaScript greške

### Česti problemi:

- **CORS greška:** Dodajte frontend domain u backend CORS konfiguraciju
- **Environment varijable nisu dostupne:** Proverite da li ste ih dodali u Vercel
- **404 greška za API:** Proverite da li vercel.json routes su ispravno konfigurisani 