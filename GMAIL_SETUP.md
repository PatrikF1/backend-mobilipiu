# 📧 Gmail Nodemailer Setup - Instrukcije

## 🚀 Što je implementirano

Vaša web stranica sada ima potpuno funkcionalni email sustav koji koristi **Nodemailer** s Gmail SMTP-om. Kada kupac pošalje poruku s kontakt forme, automatski će stići na `info.mobilipiu@gmail.com`.

## ⚙️ Što trebate učiniti (VAŽNO!)

### 1. Kreiranje Gmail App Password

Za sigurnost, Gmail zahtijeva **App Password** umjesto običnog passworda za vanjske aplikacije.

**Korak po korak:**

1. **Idite na Gmail račun** `info.mobilipiu@gmail.com`
2. **Kliknite na svoj profil** (gore desno) → **"Manage your Google Account"**
3. **Idite na "Security"** (Sigurnost)
4. **Omogućite "2-Step Verification"** (ako već nije)
5. **Pronađite "App passwords"** (App lozinke)
6. **Kliknite "Generate"** i odaberite:
   - App: "Mail"
   - Device: "Other" → napišite "Mobili Piu Website"
7. **Generirajte password** - dobit ćete 16-znamenkasti kod (npr: `abcd efgh ijkl mnop`)

### 2. Dodavanje App Password u .env datoteku

Otvorite `backend/.env` datoteku i dodajte:

```env
# Gmail SMTP konfiguracija za Nodemailer
GMAIL_USER=info.mobilipiu@gmail.com
GMAIL_APP_PASSWORD=vaš_16_znamenkasti_kod_ovdje
GMAIL_FROM_NAME=Mobili više
```

**Primjer:**
```env
GMAIL_USER=info.mobilipiu@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
GMAIL_FROM_NAME=Mobili više
```

## ✅ Testiranje

1. **Pokrenite aplikaciju:**
   ```bash
   npm run dev
   ```

2. **Provjerite u konzoli da piše:**
   ```
   ✅ Email server je spreman za slanje poruka
   ```

3. **Testirajte kontakt formu** na stranici

## 📧 Kako funkcionira

### Za kupca:
- Ispuni kontakt formu na stranici
- Klikne "Pošaljite poruku"
- Vidi potvrdu da je poruka poslana

### Za vas:
- **Automatski primite email** na `info.mobilipiu@gmail.com`
- Email sadrži sve podatke (ime, email, telefon, poruku)
- Možete direktno odgovoriti na taj email

### Email template uključuje:
- **Ime i kontakt podatke** pošaljatelja
- **Originalnu poruku**
- **Datum i vrijeme** slanja
- **Lijepi dizajn** u brown/gold temama
- **Mogućnost direktnog odgovora**

## 🔧 Rješavanje problema

### "Email konfiguracija greška"
- Provjerite App Password je li točno unesen
- Provjerite je li 2FA omogućen na Gmail računu

### "EAUTH authentication failed"
- App Password je pogrešan
- Koristite li pravi Gmail račun?

### Email se ne šalje
- Provjerite internet konekciju
- Gmail možda privremeno blokira SMTP (rijetko se dogode)

## 📱 Dodatne mogućnosti

Sustav također sprema sve poruke u **Supabase bazu**, tako da imate backup svih upita i možete kreirati admin sučelje za pregled poruka.

## ⚠️ VAŽNE NAPOMENE

1. **Ne dijelite App Password** s nikim
2. **App Password je samo za ovu aplikaciju**
3. **Ako se kompromitira, možete ga obrisati i generirati novi**
4. **Čuvajte .env datoteku privatno** (već je u .gitignore)

---

## 🎉 Gotovo!

Nakon postavljanja App Password-a, vaša web stranica će automatski slati sve kontakt forme direktno na vaš Gmail! 

Za bilo kakva pitanja ili probleme, javite se! �� +385 91 568 7580 