# Mobili più - Web aplikacija

Moderna web aplikacija za trgovinu "Mobili più" u Umagu koja se bavi prodajom bijele tehnike, malih kućanskih aparata, namještaja i 3D dizajnom prostora.

## 📋 Pregled

**Mobili più** je kompletna web aplikacija izgrađena sa:
- **Frontend**: Vue.js 3 + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB
- **Funkcionalnosti**: Katalog proizvoda, kontakt forma, informacije o brendovima, responzivni dizajn

### Vlasnica
Sandra Fabijanić  
📍 trg.obrt, Umag

### Brendovi
- Bosch
- Miele  
- Electrolux
- AEG
- Alples
- Astra Cucine

## 🚀 Instalacija i pokretanje

### Preduslovi
- Node.js (v16 ili noviji)
- npm ili yarn
- MongoDB Atlas nalog (ili lokalna MongoDB instalacija)

### 1. Kloniranje repozitorijuma
```bash
git clone <repository-url>
cd MobiliPiu
```

### 2. Instaliranje dependencija

#### Root nivo (za concurrently)
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Konfiguracija environmena

#### Backend konfiguracija
Kreiranje `.env` fajla u `backend/` direktorijumu:
```bash
cd backend
cp .env.example .env
```

Uređivanje `.env` fajla:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobilipiu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

**Napomena**: Zameniti `username`, `password` i `cluster` sa vašim MongoDB Atlas podacima.

#### Frontend konfiguracija (opciono)
Kreiranje `.env` fajla u `frontend/` direktorijumu:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Pokretanje aplikacije

#### Opcija 1: Pokretanje oba servera odjednom (preporučeno)
```bash
npm run dev
```

#### Opcija 2: Pokretanje pojedinačno

**Backend server:**
```bash
cd backend
npm run dev
```

**Frontend development server:**
```bash
cd frontend
npm run dev
```

### 5. Pristup aplikaciji
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API dokumentacija**: http://localhost:5000/api

## 📁 Struktura projekta

```
MobiliPiu/
├── backend/
│   ├── models/          # Mongoose modeli
│   │   ├── routes/          # Express rute
│   │   ├── package.json
│   │   ├── server.js        # Glavni backend fajl
│   │   └── .env.example
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/  # Vue komponente
│   │   │   ├── services/    # API servisi
│   │   │   ├── App.vue      # Glavna Vue aplikacija
│   │   │   ├── main.js      # Entry point
│   │   │   └── style.css    # Tailwind stilovi
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   ├── package.json         # Root package.json
│   └── README.md
```

## 🛠️ API Endpoints

### Proizvodi
- `GET /api/products` - Lista svih proizvoda (sa paginacijom i filterima)
- `GET /api/products/:id` - Detalji proizvoda
- `POST /api/products` - Kreiranje novog proizvoda
- `PUT /api/products/:id` - Ažuriranje proizvoda
- `DELETE /api/products/:id` - Brisanje proizvoda

### Kategorije
- `GET /api/categories` - Lista kategorija
- `GET /api/categories/:category` - Potkategorije

### Brendovi
- `GET /api/brands` - Lista brendova
- `GET /api/brands/:brandName` - Detalji brenda

### Kontakt
- `GET /api/contact/info` - Informacije o trgovini
- `POST /api/contact/message` - Slanje kontakt poruke

## 🎨 Funkcionalnosti

### Frontend
- **Responzivni dizajn** sa Tailwind CSS
- **Navegacija** sa Vue Router
- **Katalog proizvoda** sa filterima i pretragom
- **Paginacija** proizvoda
- **Detalji proizvoda** sa specifikacijama
- **Kontakt forma** sa validacijom
- **Informacije o brendovima**
- **O nama stranica**

### Backend
- **RESTful API** sa Express.js
- **MongoDB** integracija sa Mongoose
- **CORS** konfiguracija
- **Rate limiting** za bezbednost
- **Error handling** middleware
- **Validacija** podataka

## 🔧 Development

### Dodavanje novih proizvoda
Koristite POST endpoint `/api/products` sa sledećom strukturom:

```json
{
  "name": "Naziv proizvoda",
  "description": "Opis proizvoda",
  "price": 999.99,
  "originalPrice": 1299.99,
  "brand": "Bosch",
  "category": "Bijela tehnika",
  "subcategory": "Frižideri",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Alt tekst"
    }
  ],
  "specifications": {
    "Kapacitet": "300L",
    "Energetska klasa": "A+++"
  },
  "inStock": true,
  "featured": false,
  "tags": ["eco-friendly", "tiha"],
  "warranty": "3 godine"
}
```

### Dodavanje novih brendova
Editujte `backend/routes/brands.js` fajl da dodate nove brendove.

## 📦 Build za produkciju

### Frontend build
```bash
cd frontend
npm run build
```

### Pokretanje u produkciji
```bash
cd backend
npm start
```

## 🤝 Kontakt

Za pitanja ili podršku:
- **Email**: info.mobilipiu@gmail.com
- **Telefon**: +385 91 568 7580
- **Adresa**: trg.obrt, Umag
- **Vlasnica**: Sandra Fabijanić

## 📄 Licenca

Ovaj projekat je vlasništvo trgovine "Mobili più" i namijenjen je isključivo za poslovne potrebe trgovine.

---

*Izgrađeno sa ❤️ za Mobili più* 