-- Supabase SQL za kreiranje tabela - Mobili Più
-- Kopirajte ovaj kod u Supabase SQL Editor i pokrenite

-- VAŽNO: Za dodavanje SKU kolone u postojeću bazu, pokrenite ove komande:
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;
-- CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 1. Kreiranje tabele za proizvode
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) NOT NULL,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]',
  warranty VARCHAR(50) DEFAULT '2 godine',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Kreiranje tabele za brendove
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  logo VARCHAR(255),
  website VARCHAR(255),
  specialties JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Kreiranje tabele za kategorije
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  subcategories JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Kreiranje tabele za kontakt poruke
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Kreiranje tabele za praćenje pregleda proizvoda
CREATE TABLE IF NOT EXISTS product_views (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  referrer TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Kreiranje indeksa za performanse
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);

-- 7. Omogućavanje Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- 8. Kreiranje policy za čitanje (svi mogu čitati)
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON brands FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);

-- 9. Kreiranje policy za pisanje (anonimni korisnici mogu dodavati proizvode preko API-ja)
CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON products FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for product views" ON product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for product views" ON product_views FOR SELECT USING (true);

-- 10. Dodavanje početnih brendova
INSERT INTO brands (name, description, logo, website, specialties) VALUES
('Bosch', 'Vodeći njemački proizvođač kućanskih aparata poznat po inovacijama i kvaliteti.', '/images/brands/bosch-logo.png', 'https://www.bosch-home.com', '["Bijela tehnika", "Mali kućanski aparati", "Ugradbeni aparati"]'),
('Miele', 'Premium njemački brand za kućanske aparate visoke kvalitete s dugotrajnim performansama.', '/images/brands/miele-logo.png', 'https://www.miele.com', '["Bijela tehnika", "Mali kućanski aparati", "Pranje i sušenje"]'),
('Electrolux', 'Švedski brand s dugom tradicijom u proizvodnji inovativnih kućanskih aparata.', '/images/brands/electrolux-logo.png', 'https://www.electrolux.com', '["Bijela tehnika", "Mali kućanski aparati", "Profesionalni aparati"]'),
('Beko', 'Turski brand koji kombinira modernu tehnologiju s pristupačnim cijenama.', '/images/brands/beko-logo.png', 'https://www.beko.com', '["Bijela tehnika", "Mali kućanski aparati", "Hlađenje"]'),
('AEG', 'Njemački brand poznat po pouzdanim i inovativnim kućanskim aparatima.', '/images/brands/aeg-logo.png', 'https://www.aeg.com', '["Bijela tehnika", "Mali kućanski aparati", "Ugradbeni aparati"]'),
('Gorenje', 'Slovenski brand koji spaja tradiciju s modernom tehnologijom i dizajnom.', '/images/brands/gorenje-logo.png', 'https://www.gorenje.com', '["Bijela tehnika", "Mali kućanski aparati", "Retro dizajn"]'),
('Tesla', 'Srpski brand poznat po kvalitetnim i pouzdanim kućanskim aparatima.', '/images/brands/tesla-logo.png', 'https://www.tesla.rs', '["Bijela tehnika", "Mali kućanski aparati", "Klima uređaji"]'),
('Grundig', 'Njemački brand s tradicijom u proizvodnji elektronike i kućanskih aparata.', '/images/brands/grundig-logo.png', 'https://www.grundig.com', '["Bijela tehnika", "Mali kućanski aparati", "Audio/Video"]'),
('Philips', 'Nizozemski multinacionalni brand poznat po inovacijama u zdravlju i wellnessu.', '/images/brands/philips-logo.png', 'https://www.philips.com', '["Mali kućanski aparati", "Osobna njega", "Zdravlje"]'),
('Samsung', 'Južnokorejski tehnološki gigant poznat po inovativnim kućanskim aparatima.', '/images/brands/samsung-logo.png', 'https://www.samsung.com', '["Bijela tehnika", "Pametni aparati", "Tehnologija"]')
ON CONFLICT (name) DO NOTHING;

-- 11. Dodavanje kategorija
INSERT INTO categories (name, subcategories) VALUES
('Bijela tehnika', '["Hladnjaci", "Perilice rublja", "Sušilice rublja", "Perilice posuđa", "Štednjaci", "Pećnice", "Ploče za kuhanje", "Nape", "Mikrovalne pećnice", "Zamrzivači"]'),
('Mali kućanski aparati', '["Kava aparati", "Espresso aparati", "Toster", "Blender", "Mikser", "Friteza", "Grill", "Robot za kuhinju", "Aparat za smoothie", "Aparat za vafle"]'),
('Namještaj', '["Kuhinjski namještaj", "Blagovaonički namještaj", "Dnevni boravak", "Spavaće sobe", "Radni stolovi", "Ormarići", "Police", "Stolice"]'),
('3D dizajn', '["Dizajn kuhinje", "Dizajn dnevnog boravka", "Dizajn spavaće sobe", "Kompletan dizajn prostora", "Konzultacije", "Vizualizacija"]')
ON CONFLICT (name) DO NOTHING;

-- 12. Dodavanje početnih proizvoda
INSERT INTO products (name, description, price, original_price, brand, category, subcategory, images, specifications, in_stock, featured, tags, warranty) VALUES
('Bosch WAU24T40BY Perilica rublja', 'Energetski efikasna perilica rublja s EcoSilence Drive motorom i AntiVibration dizajnom. Kapacitet 8 kg, 1200 okretaja u minuti.', 599.99, 749.99, 'Bosch', 'Bijela tehnika', 'Perilice rublja', '[{"url": "https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Bosch+Perilica", "alt": "Bosch WAU24T40BY Perilica rublja"}]', '{"Kapacitet": "8 kg", "Brzina okretanja": "1200 rpm", "Energetska klasa": "A+++", "Dimenzije": "84.8 x 59.8 x 55 cm", "Buka pranja": "47 dB", "Buka centrifuge": "74 dB"}', true, true, '["eko-prijateljski", "tih", "energetski-efikasan"]', '2 godine'),
('Miele G 7100 SC Perilica posuđa', 'Premium perilica posuđa s AutoDos funkcijom i Perfect GlassCare tehnologijom. 14 kompleta posuđa.', 1299.99, 1499.99, 'Miele', 'Bijela tehnika', 'Perilice posuđa', '[{"url": "https://via.placeholder.com/400x400/44403c/ffffff?text=Miele+Perilica", "alt": "Miele G 7100 SC Perilica posuđa"}]', '{"Kapacitet": "14 kompleta", "Energetska klasa": "A+++", "Potrošnja vode": "9.9 L", "Buka": "44 dB", "Dimenzije": "80.5 x 59.8 x 57 cm"}', true, true, '["premium", "auto-doziranje", "tiha"]', '5 godine');

-- 13. Ažuriranje postojećih proizvoda s test šiframa
UPDATE products SET sku = 'BOSCH-WAU24T40BY' WHERE name = 'Bosch WAU24T40BY Perilica rublja';
UPDATE products SET sku = 'MIELE-G7100SC' WHERE name = 'Miele G 7100 SC Perilica posuđa';

-- 14. Dodavanje SKU kolone ako ne postoji (za postojeće baze)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;

-- 15. Kreiranje indeksa za SKU ako ne postoji
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 16. Provjera da li je kolona dodana
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sku';

-- Gotovo! Sada možete testirati aplikaciju. 