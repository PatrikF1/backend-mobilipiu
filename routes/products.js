const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');

// Direktno koristimo Supabase - nema mock podataka

// GET svi proizvodi sa paginacijom i filterima
router.get('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Buildaj Supabase upit
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Filteri
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }
    
    if (req.query.brand) {
      query = query.eq('brand', req.query.brand);
    }
    
    if (req.query.inStock) {
      query = query.eq('in_stock', req.query.inStock === 'true');
    }
    
    if (req.query.featured) {
      query = query.eq('featured', req.query.featured === 'true');
    }
    
    // Pretraga
    if (req.query.search) {
      const searchTerm = req.query.search;
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
    }
    
    // Raspon cijena
    if (req.query.minPrice) {
      query = query.gte('price', parseFloat(req.query.minPrice));
    }
    
    if (req.query.maxPrice) {
      query = query.lte('price', parseFloat(req.query.maxPrice));
    }
    
    // Sortiranje i paginacija
    query = query.order('created_at', { ascending: false });
    query = query.range(skip, skip + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Konvertiraj Supabase rezultate u format kompatibilan s frontendom
    const products = data.map(row => ({
      _id: row.id.toString(),
      name: row.name,
      sku: row.sku || null,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      brand: row.brand,
      category: row.category,
      subcategory: row.subcategory,
      images: row.images,
      specifications: row.specifications,
      inStock: row.in_stock,
      featured: row.featured,
      tags: row.tags,
      warranty: row.warranty,
      createdAt: row.created_at
    }));
    
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalProducts: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('❌ Greška pri dohvaćanju proizvoda:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET jedan proizvod
router.get('/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Proizvod nije pronađen' });
      }
      throw error;
    }
    
    const product = {
      _id: data.id.toString(),
      name: data.name,
      sku: data.sku || null,
      description: data.description,
      price: parseFloat(data.price),
      originalPrice: data.original_price ? parseFloat(data.original_price) : null,
      brand: data.brand,
      category: data.category,
      subcategory: data.subcategory,
      images: data.images,
      specifications: data.specifications,
      inStock: data.in_stock,
      featured: data.featured,
      tags: data.tags,
      warranty: data.warranty,
      createdAt: data.created_at
    };
    
    res.json(product);
  } catch (error) {
    console.error('❌ Greška pri dohvaćanju proizvoda:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST novi proizvod
router.post('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }
    
    const {
      name, sku, description, price, originalPrice, brand, category, subcategory,
      images, specifications, inStock, featured, tags, warranty
    } = req.body;
    
    // Validiraj potrebna polja
    if (!name || !description || !price || !brand || !category) {
      return res.status(400).json({ 
        message: 'Nedostaju potrebna polja: name, description, price, brand, category' 
      });
    }
    
    const productData = {
      name, 
      sku: sku || null,
      description, 
      price, 
      original_price: originalPrice || null, 
      brand, 
      category, 
      subcategory,
      images: images || [],
      specifications: specifications || {},
      in_stock: inStock !== undefined ? inStock : true,
      featured: featured !== undefined ? featured : false,
      tags: tags || [],
      warranty: warranty || '2 godine'
    };
    
    console.log('📤 Šalje podatke u Supabase:', productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase greška:', error);
      throw error;
    }
    
    console.log('✅ Proizvod uspješno dodan:', data);
    
    const savedProduct = {
      _id: data.id.toString(),
      name: data.name,
      sku: data.sku || null,
      description: data.description,
      price: parseFloat(data.price),
      originalPrice: data.original_price ? parseFloat(data.original_price) : null,
      brand: data.brand,
      category: data.category,
      subcategory: data.subcategory,
      images: data.images,
      specifications: data.specifications,
      inStock: data.in_stock,
      featured: data.featured,
      tags: data.tags,
      warranty: data.warranty,
      createdAt: data.created_at
    };
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ Greška pri dodavanju proizvoda:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT ažuriranje proizvoda
router.put('/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }
    
    const {
      name, sku, description, price, originalPrice, brand, category, subcategory,
      images, specifications, inStock, featured, tags, warranty
    } = req.body;
    
    const updateData = {
      name, 
      sku: sku || null,
      description, 
      price, 
      original_price: originalPrice || null, 
      brand, 
      category, 
      subcategory,
      images: images || [],
      specifications: specifications || {},
      in_stock: inStock !== undefined ? inStock : true,
      featured: featured !== undefined ? featured : false,
      tags: tags || [],
      warranty: warranty || '2 godine',
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Proizvod nije pronađen' });
      }
      throw error;
    }
    
    const updatedProduct = {
      _id: data.id.toString(),
      name: data.name,
      sku: data.sku || null,
      description: data.description,
      price: parseFloat(data.price),
      originalPrice: data.original_price ? parseFloat(data.original_price) : null,
      brand: data.brand,
      category: data.category,
      subcategory: data.subcategory,
      images: data.images,
      specifications: data.specifications,
      inStock: data.in_stock,
      featured: data.featured,
      tags: data.tags,
      warranty: data.warranty,
      createdAt: data.created_at
    };
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Greška pri ažuriranju proizvoda:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE proizvod
router.delete('/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Proizvod nije pronađen' });
      }
      throw error;
    }
    
    res.json({ message: 'Proizvod uspješno obrisan' });
  } catch (error) {
    console.error('❌ Greška pri brisanju proizvoda:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST track product view
router.post('/:id/view', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }

    const { ip_address, user_agent, session_id, referrer } = req.body;
    
    const { data, error } = await supabase
      .from('product_views')
      .insert({
        product_id: parseInt(req.params.id),
        ip_address: ip_address || req.ip,
        user_agent: user_agent || req.get('User-Agent'),
        session_id: session_id,
        referrer: referrer
      });

    if (error) {
      console.error('Greška pri dodavanju pregleda:', error);
      return res.status(500).json({ message: 'Greška pri praćenju pregleda' });
    }

    res.json({ message: 'Pregled zabilježen uspješno' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product views statistics
router.get('/stats/views', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Supabase nije konfiguriran' });
    }

    // Ukupno pregleda
    const { count: totalViews, error: viewsError } = await supabase
      .from('product_views')
      .select('*', { count: 'exact', head: true });

    if (viewsError) {
      console.error('Greška pri dohvaćanju statistika pregleda:', viewsError);
      return res.json({ totalViews: 0, topProducts: [] });
    }

    // Top 10 najgledanijih proizvoda
    const { data: topProducts, error: topError } = await supabase
      .from('product_views')
      .select(`
        product_id,
        products!inner(id, name, brand),
        count:id.count()
      `)
      .group('product_id, products.id, products.name, products.brand')
      .order('count', { ascending: false })
      .limit(10);

    if (topError) {
      console.error('Greška pri dohvaćanju top proizvoda:', topError);
    }

    res.json({
      totalViews: totalViews || 0,
      topProducts: topProducts || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 