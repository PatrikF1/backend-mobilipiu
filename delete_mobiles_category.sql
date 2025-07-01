-- Brisanje "Mobiles" kategorije i povezanih podataka

-- Prvo briši proizvode koji koriste "Mobiles" kategoriju
DELETE FROM products WHERE category = 'Mobiles';

-- Briši "Mobiles" kategoriju iz categories tabele
DELETE FROM categories WHERE name = 'Mobiles';

-- Provjeri rezultat
SELECT 'Kategorije nakon brisanja:' as info;
SELECT id, name FROM categories ORDER BY id;

SELECT 'Proizvodi nakon brisanja:' as info;
SELECT id, name, category FROM products ORDER BY id; 