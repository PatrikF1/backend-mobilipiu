-- Tabela za praćenje pregleda proizvoda
CREATE TABLE IF NOT EXISTS product_views (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    referrer VARCHAR(500)
);

-- Index za brže pretraživanje
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_session ON product_views(session_id);

-- RLS policies za product_views
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert product views" ON product_views
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select product views" ON product_views
FOR SELECT TO anon, authenticated
USING (true); 