-- Dodavanje SKU kolone u postojeću Supabase tabelu products
-- Kopiraj ovaj kod u Supabase SQL Editor i pokreni

-- 1. Dodavanje SKU kolone
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;

-- 2. Kreiranje indeksa za performanse
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 3. Ažuriranje postojećih proizvoda s test šiframa (ako postoje)
UPDATE products SET sku = 'BOSCH-WAU24T40BY' WHERE name LIKE '%Bosch WAU24T40BY%' AND sku IS NULL;
UPDATE products SET sku = 'MIELE-G7100SC' WHERE name LIKE '%Miele G 7100 SC%' AND sku IS NULL;

-- 4. Provjera da li je kolona dodana
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sku';

-- Gotovo! SKU kolona je dodana i može se koristiti u aplikaciji. 