require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8000;

console.log('1. Express app kreiran');

// Supabase konfiguracija
let supabase = null;
try {
  console.log('🔍 Provjera Supabase varijabli...');
  console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 30)}...` : 'NIJE POSTAVLJEN');
  console.log('🔍 SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? `${process.env.SUPABASE_ANON_KEY.substring(0, 30)}...` : 'NIJE POSTAVLJEN');
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    console.log('🔍 Kreiram Supabase klijent...');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Test osnovnih tabela
    console.log('🔍 Testiram konekciju s jednostavnim pozivom...');
    setTimeout(async () => {
      try {
        const { data, error } = await supabase.from('products').select('count').limit(1);
        if (error) {
          console.log('⚠️  Test konekcije neuspješan:', error.message);
          console.log('⚠️  Možda tabela "products" ne postoji ili nema dozvole?');
        } else {
          console.log('✅ Test konekcije uspješan!');
        }
      } catch (testError) {
        console.log('⚠️  Test konekcije greška:', testError.message);
      }
    }, 1000);
    
    console.log('2. Supabase klijent uspješno kreiran');
  } else {
    console.log('2. Supabase varijable nisu postavljene - koristim mock podatke');
  }
} catch (error) {
  console.log('2. Greška pri kreiranju Supabase klijenta:', error.message);
  console.log('   Koristim mock podatke');
}

// Nodemailer konfiguracija za Gmail
let emailTransporter = null;
try {
  console.log('🔍 Konfiguracija email transporter-a...');
  console.log('🔍 GMAIL_USER env var:', !!process.env.GMAIL_USER);
  console.log('🔍 GMAIL_APP_PASSWORD env var:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('🔍 GMAIL_USER value:', process.env.GMAIL_USER);
  console.log('🔍 GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD?.length);
  
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    
    console.log('✅ Email transporter kreiran uspješno');
    console.log('📧 Gmail user:', process.env.GMAIL_USER);
    
    // Test konekcije
    emailTransporter.verify((error, success) => {
      if (error) {
        console.log('❌ Email konekcija neuspješna:', error.message);
        console.log('❌ Email greška kod:', error.code);
        console.log('❌ Email greška odgovor:', error.response);
        emailTransporter = null; // Postaviti na null ako ne radi
      } else {
        console.log('✅ Email server spreman za slanje poruka');
      }
    });
    
  } else {
    console.log('⚠️  Gmail konfiguracija nije kompletna - email neće biti poslan');
    console.log('⚠️  GMAIL_USER missing:', !process.env.GMAIL_USER);
    console.log('⚠️  GMAIL_APP_PASSWORD missing:', !process.env.GMAIL_APP_PASSWORD);
  }
} catch (error) {
  console.log('❌ Greška pri konfiguraciji email-a:', error.message);
}

// CORS middleware - dozvoli sve Vercel i lokalne domene
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002', 
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://www.mobilipiu.hr',
  'https://mobilipiu.hr'
];

app.use(cors({
  origin: function (origin, callback) {
    // Uvek dozvoli zahteve bez origin (mobilne aplikacije, Postman)
    if (!origin) return callback(null, true);
    
    // Dozvoli sve lokalne hostove
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Dozvoli sve Vercel domene (.vercel.app)
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Dozvoli sve Netlify domene (.netlify.app)
    if (origin && origin.includes('.netlify.app')) {
      return callback(null, true);
    }
    
    // Dozvoli sve GitHub Pages (.github.io)
    if (origin && origin.includes('.github.io')) {
      return callback(null, true);
    }
    
    // Dozvoli mobilipiu.hr domene
    if (origin && (origin.includes('mobilipiu.hr') || origin.includes('www.mobilipiu.hr'))) {
      return callback(null, true);
    }
    
    // Fallback - odbaci nepoznate domene
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

console.log('3. CORS middleware dodan');

// JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
console.log('4. JSON middleware dodan');

// API Routes

// Main route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mobili più API - Dobrodošli!',
    owner: 'Sandra Fabijanić',
    location: 'Pozioi 2, Umag',
    status: 'Running',
    database: supabase ? 'Supabase povezan' : 'Mock podaci',
    availableRoutes: [
      'GET /api/test',
      'GET /api/debug/supabase',
      'GET /api/products?brand=&category=&search=&page=&limit=', 
      'GET /api/products/:id',
      'GET /api/filter-options',
      'GET /api/categories',
      'GET /api/brands',
      'GET /api/contact',
      'POST /api/contact'
    ]
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test uspješan!',
    timestamp: new Date().toISOString(),
    database: supabase ? 'Supabase aktivan' : 'Mock podaci'
  });
});

// Debug route za Supabase
app.get('/api/debug/supabase', async (req, res) => {
  if (!supabase) {
    return res.json({
      status: 'Supabase nije konfiguriran',
      env_url: !!process.env.SUPABASE_URL,
      env_key: !!process.env.SUPABASE_ANON_KEY
    });
  }

  try {
    console.log('🔍 DEBUG: Testiram Supabase direktno...');
    
    // Test različitih tabela
    const tests = ['products', 'categories', 'brands'];
    const results = {};
    
    for (const table of tests) {
      try {
        console.log(`🔍 Testiram tabelu: ${table}`);
        const response = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(5);
        
        console.log(`🔍 RAW response za ${table}:`, JSON.stringify(response, null, 2));
        
        const { data, error, count, status, statusText } = response;
        
        results[table] = {
          success: !error,
          error: error ? {
            message: error.message || 'Nema poruke',
            code: error.code || 'Nema koda',
            details: error.details || 'Nema detalja',
            hint: error.hint || 'Nema hint',
            raw: JSON.stringify(error)
          } : null,
          count: count,
          status: status,
          statusText: statusText,
          hasData: data && data.length > 0,
          dataCount: data ? data.length : 0,
          sampleData: data ? data.slice(0, 2) : null,
          rawResponse: {
            hasData: !!data,
            hasError: !!error,
            hasCount: count !== undefined
          }
        };
        
        console.log(`🔍 ${table} strukturirani rezultat:`, JSON.stringify(results[table], null, 2));
      } catch (e) {
        console.log(`🔍 Exception za ${table}:`, e);
        results[table] = {
          success: false,
          error: e.message,
          exception: true,
          stack: e.stack
        };
      }
    }
    
    // Dodatni test - pokušaj lista tabela ili informacija o schemi
    let schemaInfo = null;
    try {
      console.log('🔍 Pokušavam dobiti informacije o schemi...');
      const schemaTest = await supabase.rpc('version');
      console.log('🔍 Schema test rezultat:', schemaTest);
      schemaInfo = schemaTest;
    } catch (schemaError) {
      console.log('🔍 Schema test greška:', schemaError);
      schemaInfo = { error: schemaError.message };
    }
    
    res.json({
      status: 'Supabase test završen',
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 50) + '...',
      anon_key_length: process.env.SUPABASE_ANON_KEY?.length,
      tests: results,
      schemaInfo: schemaInfo
    });
    
  } catch (error) {
    console.log('🔍 Općenita greška u debug rutu:', error);
    res.json({
      status: 'Greška pri testiranju',
      error: error.message,
      stack: error.stack
    });
  }
});

// Simple Supabase test route
app.get('/api/debug/simple', async (req, res) => {
  if (!supabase) {
    return res.json({ error: 'Supabase nije konfiguriran' });
  }

  try {
    console.log('🔍 SIMPLE TEST: Pokušavam osnovni Supabase poziv...');
    
    // Najjednostavniji mogući test
    const response = await supabase.from('products').select('count');
    
    console.log('🔍 SIMPLE TEST rezultat:', response);
    
    res.json({
      test: 'simple supabase test',
      url: process.env.SUPABASE_URL,
      response: response,
      hasError: !!response.error,
      hasData: !!response.data,
      errorDetails: response.error || null
    });
    
  } catch (error) {
    console.log('🔍 SIMPLE TEST exception:', error);
    res.json({
      test: 'simple supabase test',
      error: error.message,
      stack: error.stack
    });
  }
});

// Products API with filtering
app.get('/api/products', async (req, res) => {
  try {
    // Izvuci filter parametre iz query string-a
    const { 
      brand, 
      category, 
      subcategory,
      minPrice, 
      maxPrice, 
      inStock, 
      featured,
      search,
      page = 1, 
      limit = 50,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    if (supabase) {
      console.log('🔍 Dohvaćam proizvode iz Supabase s filterima...');
      console.log('🔍 Filteri:', { brand, category, subcategory, minPrice, maxPrice, inStock, featured, search, page, limit });
      
      // Kreiraj query s filterima
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Dodaj filtere
      if (brand && brand !== '' && brand !== 'all') {
        query = query.eq('brand', brand);
      }

      if (category && category !== '' && category !== 'all') {
        query = query.eq('category', category);
      }

      if (subcategory && subcategory !== '' && subcategory !== 'all') {
        query = query.eq('subcategory', subcategory);
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      if (inStock === 'true') {
        query = query.eq('in_stock', true);
      }

      if (featured === 'true') {
        query = query.eq('featured', true);
      }

      // Search po nazivu, opisu ili SKU-u
      if (search && search.trim() !== '') {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
      }

      // Sortiranje
      const ascending = sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      // Paginacija
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 50;
      const offset = (pageNumber - 1) * limitNumber;
      
      query = query.range(offset, offset + limitNumber - 1);

      const { data, error, count } = await query;

      console.log('🔍 Supabase odgovor - data length:', data?.length || 0);
      console.log('🔍 Supabase odgovor - error:', error);
      console.log('🔍 Supabase odgovor - count:', count);

      if (error) {
        console.error('❌ Supabase greška detalji:', JSON.stringify(error, null, 2));
        throw error;
      }

      if (!data) {
        console.log('⚠️  Nema podataka u tabeli products');
        return res.json({
          products: [],
          pagination: {
            currentPage: pageNumber,
            totalPages: 0,
            totalProducts: 0,
            hasNext: false,
            hasPrev: false
          },
          filters: { brand, category, subcategory, minPrice, maxPrice, inStock, featured, search },
          message: 'Nema proizvoda u bazi podataka'
        });
      }

      console.log(`✅ Dohvaćeno ${data.length} proizvoda iz baze (ukupno: ${count})`);

      // Formatiraj podatke za frontend
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
        images: row.images || [],
        specifications: row.specifications || {},
        inStock: row.in_stock,
        featured: row.featured,
        tags: row.tags || [],
        warranty: row.warranty || '2 godine',
        createdAt: row.created_at
      }));

      // Paginacija kalkulacije
      const totalProducts = count || 0;
      const totalPages = Math.ceil(totalProducts / limitNumber);
      const hasNext = pageNumber < totalPages;
      const hasPrev = pageNumber > 1;

      res.json({
        products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNext,
          hasPrev,
          limit: limitNumber
        },
        filters: { brand, category, subcategory, minPrice, maxPrice, inStock, featured, search }
      });

    } else {
      console.log('⚠️  Supabase nije dostupan - koristim mock podatke');
      // Mock podaci ako nema Supabase
      const mockProducts = [
        {
          _id: '1',
          name: 'Bosch Perilica rublja WAU28PH9BY (MOCK)',
          description: 'Kvalitetna perilica rublja s 9kg kapaciteta i EcoSilence Drive motorom',
          price: 3299,
          originalPrice: 3599,
          brand: 'Bosch',
          category: 'Bijela tehnika',
          subcategory: 'Perilice rublja',
          inStock: true,
          featured: true,
          images: ['/images/products/bosch-perilica.jpg'],
          specifications: {
            kapacitet: '9 kg',
            energetska_klasa: 'A+++',
            brzina_centrifuge: '1400 rpm',
            boja: 'Bijela'
          },
          warranty: '2 godine'
        }
      ];
      
      res.json({
        products: mockProducts,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: mockProducts.length,
          hasNext: false,
          hasPrev: false
        },
        filters: { brand, category, subcategory, minPrice, maxPrice, inStock, featured, search }
      });
    }

  } catch (error) {
    console.error('❌ Općenita greška pri dohvaćanju proizvoda:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju proizvoda',
      error: error.message || 'Nepoznata greška',
      details: error.details || null
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      console.log(`Dohvaćam proizvod ID: ${id} iz Supabase...`);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
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
        images: data.images || [],
        specifications: data.specifications || {},
        inStock: data.in_stock,
        featured: data.featured,
        tags: data.tags || [],
        warranty: data.warranty || '2 godine',
        createdAt: data.created_at
      };

      res.json(product);

    } else {
      // Mock podatak
      const product = {
        _id: id,
        name: 'Bosch Perilica rublja WAU28PH9BY (MOCK)',
        description: 'Kvalitetna perilica rublja s 9kg kapaciteta i EcoSilence Drive motorom',
        price: 3299,
        originalPrice: 3599,
        brand: 'Bosch',
        category: 'Bijela tehnika',
        subcategory: 'Perilice rublja',
        inStock: true,
        featured: true,
        images: ['/images/products/bosch-perilica.jpg'],
        specifications: {
          kapacitet: '9 kg',
          energetska_klasa: 'A+++',
          brzina_centrifuge: '1400 rpm',
          boja: 'Bijela'
        },
        warranty: '2 godine'
      };
      res.json(product);
    }

  } catch (error) {
    console.error('Greška pri dohvaćanju proizvoda:', error);
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju proizvoda',
      error: error.message 
    });
  }
});

// Filter options API - vraća jedinstvene vrijednosti za dropdown filtere
app.get('/api/filter-options', async (req, res) => {
  try {
    if (supabase) {
      console.log('🔍 Dohvaćam filter opcije iz Supabase...');
      
      // Dohvati brendove iz brands tabele
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('name')
        .order('name');
      
      // Dohvati kategorije iz categories tabele
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      // Dohvati jedinstvene subkategorije iz subcategories tabele
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('name')
        .order('name');

      if (brandsError || categoriesError || subcategoriesError) {
        console.error('❌ Greška pri dohvaćanju filter opcija:', brandsError || categoriesError || subcategoriesError);
        throw brandsError || categoriesError || subcategoriesError;
      }

      // Kreiraj jedinstvene liste
      const uniqueBrands = brandsData.map(item => item.name);
      const uniqueCategories = categoriesData.map(item => item.name);
      const uniqueSubcategories = subcategoriesData.map(item => item.name);

      // Dohvati min/max cijene
      const { data: priceData, error: priceError } = await supabase
        .from('products')
        .select('price')
        .not('price', 'is', null)
        .order('price', { ascending: true });

      const prices = priceData?.map(item => parseFloat(item.price)) || [];
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000;

      console.log(`✅ Filter opcije: ${uniqueBrands.length} brendova, ${uniqueCategories.length} kategorija, ${uniqueSubcategories.length} subkategorija`);

      res.json({
        success: true,
        data: {
          brands: uniqueBrands,
          categories: uniqueCategories,
          subcategories: uniqueSubcategories,
          priceRange: {
            min: minPrice,
            max: maxPrice
          }
        }
      });

    } else {
      // Mock podaci
      const mockFilterOptions = {
        brands: ['Bosch', 'Samsung', 'LG'],
        categories: ['Bijela tehnika', 'Mobiles'],
        subcategories: ['Perilice rublja', 'Frižideri', 'Hladnjaci'],
        priceRange: {
          min: 100,
          max: 5000
        }
      };
      
      res.json({ success: true, data: mockFilterOptions });
    }
  } catch (error) {
    console.error('❌ Greška pri dohvaćanju filter opcija:', error);
    res.status(500).json({ 
      success: false,
      message: 'Greška pri dohvaćanju filter opcija',
      error: error.message 
    });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      const categories = data.map(row => ({
        _id: row.id.toString(),
        name: row.name,
        description: row.description,
        slug: row.slug,
        image: row.image,
        productCount: row.product_count || 0
      }));

      res.json({ success: true, data: categories });
    } else {
      // Mock podaci
      const mockCategories = [
        { 
          _id: '1', 
          name: 'Bijela tehnika (MOCK)', 
          description: 'Perilice, sušilice, hladnjaci, zamrzivači i ostali veliki kućanski aparati', 
          slug: 'bijela-tehnika',
          image: '/images/categories/bijela-tehnika.jpg',
          productCount: 45
        }
      ];
      res.json({ success: true, data: mockCategories });
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju kategorija:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Greška pri dohvaćanju kategorija',
      error: error.message 
    });
  }
});

// Brands API
app.get('/api/brands', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) throw error;

      const brands = data.map(row => ({
        _id: row.id.toString(),
        name: row.name,
        description: row.description,
        logo: row.logo,
        website: row.website,
        productCount: row.product_count || 0
      }));

      res.json({ success: true, data: brands });
    } else {
      // Mock podaci
      const mockBrands = [
        { 
          _id: '1', 
          name: 'Bosch (MOCK)', 
          description: 'Njemačka kvaliteta i pouzdanost', 
          logo: '/images/brands/bosch.png',
          website: 'https://www.bosch-home.com',
          productCount: 15
        }
      ];
      res.json({ success: true, data: mockBrands });
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju brendova:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Greška pri dohvaćanju brendova',
      error: error.message 
    });
  }
});

// Subcategories API
app.get('/api/subcategories', async (req, res) => {
  try {
    const { category_id } = req.query;

    if (supabase) {
      console.log('🔍 Dohvaćam podkategorije iz subcategories tabele...');
      
      let query = supabase
        .from('subcategories')
        .select(`
          id,
          name,
          description,
          slug,
          image,
          product_count,
          category_id,
          categories!inner(
            id,
            name
          )
        `)
        .order('name');

      // Ako je specifičan category_id, filtriraj po njemu
      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Greška pri dohvaćanju podkategorija:', error);
        throw error;
      }

      const subcategories = data.map(row => ({
        _id: row.id.toString(),
        name: row.name,
        description: row.description,
        slug: row.slug,
        image: row.image,
        productCount: row.product_count || 0,
        categoryId: row.category_id,
        categoryName: row.categories?.name || 'Nepoznato'
      }));

      console.log(`✅ Dohvaćeno ${subcategories.length} podkategorija iz subcategories tabele`);

      res.json({ 
        success: true, 
        data: subcategories 
      });

    } else {
      // Mock podaci
      const mockSubcategories = [
        { 
          _id: '1', 
          name: 'Perilice rublja (MOCK)', 
          description: 'Perilice za rublje različitih kapaciteta', 
          slug: 'perilice-rublja',
          image: '/images/subcategories/perilice-rublja.jpg',
          productCount: 12,
          categoryId: 1,
          categoryName: 'Bijela tehnika'
        },
        { 
          _id: '2', 
          name: 'Frižideri (MOCK)', 
          description: 'Frižideri različitih veličina i tipova', 
          slug: 'frizideri',
          image: '/images/subcategories/frizideri.jpg',
          productCount: 8,
          categoryId: 1,
          categoryName: 'Bijela tehnika'
        }
      ];
      
      res.json({ success: true, data: mockSubcategories });
    }
  } catch (error) {
    console.error('❌ Greška pri dohvaćanju podkategorija:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Greška pri dohvaćanju podkategorija',
      error: error.message 
    });
  }
});

// Contact API
app.get('/api/contact', (req, res) => {
  const storeInfo = {
    name: 'Mobili più',
    owner: 'Sandra Fabijanić',
    address: 'Mobili più, trg.obrt, Umag',
    phone: '+385 91 568 7580',
    email: 'info.mobilipiu@gmail.com',
    workingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 15:00',
      saturday: 'Zatvoreno',
      sunday: 'Zatvoreno'
    },
    location: {
      lat: 45.4316,
      lng: 13.5282
    }
  };
  res.json({ success: true, data: storeInfo });
});

// Products Management API - dodavanje novog proizvoda
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.price || !productData.brand || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Ime, cijena, brend i kategorija su obavezni podaci'
      });
    }

    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase nije konfiguriran'
      });
    }

    console.log('📝 Dodajem novi proizvod u Supabase...');
    console.log('📝 Proizvod:', { name: productData.name, brand: productData.brand, category: productData.category, price: productData.price });

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name.trim(),
        description: productData.description || `Opis za ${productData.name}`,
        sku: productData.sku || null,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        brand: productData.brand.trim(),
        category: productData.category.trim(),
        subcategory: productData.subcategory || '',
        images: productData.images || [],
        specifications: productData.specifications || {},
        in_stock: productData.inStock !== undefined ? productData.inStock : true,
        featured: productData.featured || false,
        tags: productData.tags || [],
        warranty: productData.warranty || '2 godine'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Greška pri dodavanju proizvoda:', error);
      throw error;
    }

    console.log(`✅ Proizvod uspješno dodan: ${data.id}`);

    res.json({
      success: true,
      message: 'Proizvod je uspješno dodan',
      data: {
        _id: data.id.toString(),
        name: data.name,
        sku: data.sku,
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
        warranty: data.warranty
      }
    });

  } catch (error) {
    console.error('❌ Greška pri dodavanju proizvoda:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dodavanju proizvoda',
      error: error.message
    });
  }
});

// Admin Products API - admin lista proizvoda
app.get('/api/admin/products', async (req, res) => {
  try {
    // Izvuci filter parametre iz query string-a
    const { 
      brand, 
      category, 
      subcategory,
      search,
      page = 1, 
      limit = 50,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase nije konfiguriran'
      });
    }

    console.log('📋 Admin dohvaća listu proizvoda iz Supabase...');
    console.log('🔍 Admin filteri:', { brand, category, subcategory, search, page, limit });

    // Kreiraj query s filterima
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Dodaj filtere
    if (brand && brand !== '' && brand !== 'all') {
      query = query.eq('brand', brand);
    }

    if (category && category !== '' && category !== 'all') {
      query = query.eq('category', category);
    }

    if (subcategory && subcategory !== '' && subcategory !== 'all') {
      query = query.eq('subcategory', subcategory);
    }

    // Search po nazivu, opisu ili SKU-u
    if (search && search.trim() !== '') {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // Sortiranje
    const ascending = sortOrder === 'asc';
    query = query.order(sortBy, { ascending });

    // Paginacija
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 50;
    const offset = (pageNumber - 1) * limitNumber;
    
    query = query.range(offset, offset + limitNumber - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Greška pri dohvaćanju proizvoda:', error);
      throw error;
    }

    console.log(`✅ Dohvaćeno ${data.length} proizvoda za admin panel (ukupno: ${count})`);

    const formattedProducts = data.map(product => ({
      _id: product.id.toString(),
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      specifications: product.specifications,
      inStock: product.in_stock,
      featured: product.featured,
      tags: product.tags,
      warranty: product.warranty,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    // Paginacija kalkulacije
    const totalProducts = count || 0;
    const totalPages = Math.ceil(totalProducts / limitNumber);
    const hasNext = pageNumber < totalPages;
    const hasPrev = pageNumber > 1;

    res.json({
      success: true,
      message: 'Proizvodi uspješno dohvaćeni',
      data: formattedProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        hasNext,
        hasPrev,
        limit: limitNumber
      },
      filters: { brand, category, subcategory, search }
    });

  } catch (error) {
    console.error('❌ Greška pri dohvaćanju proizvoda:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju proizvoda',
      error: error.message
    });
  }
});

// Admin Products API - admin dodavanje proizvoda
app.post('/api/admin/products', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.price || !productData.brand || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Ime, cijena, brend i kategorija su obavezni podaci'
      });
    }

    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase nije konfiguriran'
      });
    }

    console.log('📝 Admin dodaje novi proizvod u Supabase...');
    console.log('📝 Proizvod:', { name: productData.name, brand: productData.brand, category: productData.category, price: productData.price });

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name.trim(),
        description: productData.description || `Opis za ${productData.name}`,
        sku: productData.sku || null,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        brand: productData.brand.trim(),
        category: productData.category.trim(),
        subcategory: productData.subcategory || '',
        images: productData.images || [],
        specifications: productData.specifications || {},
        in_stock: productData.inStock !== undefined ? productData.inStock : true,
        featured: productData.featured || false,
        tags: productData.tags || [],
        warranty: productData.warranty || '2 godine'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Greška pri dodavanju proizvoda:', error);
      throw error;
    }

    console.log(`✅ Proizvod uspješno dodan: ${data.id}`);

    res.json({
      success: true,
      message: 'Proizvod je uspješno dodan',
      data: {
        _id: data.id.toString(),
        name: data.name,
        sku: data.sku,
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
        warranty: data.warranty
      }
    });

  } catch (error) {
    console.error('❌ Greška pri dodavanju proizvoda:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dodavanju proizvoda',
      error: error.message
    });
  }
});

// Admin Products API - ažuriranje proizvoda
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase nije konfiguriran'
      });
    }

    console.log(`📝 Ažuriram proizvod ${id} u Supabase...`);

    const updateData = {};
    if (productData.name) updateData.name = productData.name.trim();
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.sku !== undefined) updateData.sku = productData.sku;
    if (productData.price) updateData.price = parseFloat(productData.price);
    if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
    if (productData.brand) updateData.brand = productData.brand.trim();
    if (productData.category) updateData.category = productData.category.trim();
    if (productData.subcategory !== undefined) updateData.subcategory = productData.subcategory;
    if (productData.images) updateData.images = productData.images;
    if (productData.specifications) updateData.specifications = productData.specifications;
    if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;
    if (productData.featured !== undefined) updateData.featured = productData.featured;
    if (productData.tags) updateData.tags = productData.tags;
    if (productData.warranty) updateData.warranty = productData.warranty;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Greška pri ažuriranju proizvoda:', error);
      throw error;
    }

    console.log(`✅ Proizvod uspješno ažuriran: ${id}`);

    res.json({
      success: true,
      message: 'Proizvod je uspješno ažuriran',
      data: {
        _id: data.id.toString(),
        name: data.name,
        sku: data.sku,
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
        warranty: data.warranty
      }
    });

  } catch (error) {
    console.error('❌ Greška pri ažuriranju proizvoda:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju proizvoda',
      error: error.message
    });
  }
});

// DELETE /api/admin/products/:id - brisanje proizvoda
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!supabase) {
      return res.status(400).json({
        success: false,
        message: 'Supabase nije konfiguriran'
      });
    }
    console.log(`🗑️ Brišem proizvod ${id} iz Supabase...`);
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Proizvod nije pronađen'
        });
      }
      console.error('❌ Greška pri brisanju proizvoda:', error);
      throw error;
    }
    console.log(`✅ Proizvod uspješno obrisan: ${id}`);
    res.json({
      success: true,
      message: 'Proizvod je uspješno obrisan',
      data: {
        _id: data.id.toString(),
        name: data.name
      }
    });
  } catch (error) {
    console.error('❌ Greška pri brisanju proizvoda:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju proizvoda',
      error: error.message
    });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Ime, email i poruka su obavezni podaci'
    });
  }
  
  // Email validacija
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Molimo unesite valjanu email adresu'
    });
  }

  try {
    if (emailTransporter) {
      console.log('📧 Šaljem email poruku...');
      console.log('📧 Od:', email);
      console.log('📧 Ime:', name);
      
      // Email opcije
      const mailOptions = {
        from: `${process.env.GMAIL_FROM_NAME || 'Mobili più'} <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Prima na isti Gmail account
        replyTo: email, // Reply će ići na email korisnika
        subject: `Nova kontakt poruka od ${name}`,
        html: `
          <!DOCTYPE html>
          <html lang="hr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nova kontakt poruka - Mobili più</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            
            <!-- Main Container -->
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 30px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                  Mobili <span style="font-weight: 600;">più</span>
                </h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Nova kontakt poruka</p>
              </div>
              
              <!-- Content Body -->
              <div style="padding: 40px;">
                
                <!-- Client Information Card -->
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #3498db;">
                  <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">
                    👤 Informacije o klijentu
                  </h2>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; width: 120px; color: #7f8c8d; font-weight: 600;">Ime:</td>
                      <td style="padding: 8px 0; color: #2c3e50; font-size: 16px;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0;">
                        <a href="mailto:${email}" style="color: #3498db; text-decoration: none; font-weight: 500;">
                          ${email}
                        </a>
                      </td>
                    </tr>
                    ${phone ? `
                    <tr>
                      <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Telefon:</td>
                      <td style="padding: 8px 0;">
                        <a href="tel:${phone}" style="color: #27ae60; text-decoration: none; font-weight: 500;">
                          ${phone}
                        </a>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Datum:</td>
                      <td style="padding: 8px 0; color: #2c3e50;">${new Date().toLocaleString('hr-HR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</td>
                    </tr>
                  </table>
                </div>
                
                <!-- Message Card -->
                <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; margin-bottom: 25px; border: 2px solid #ecf0f1;">
                  <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">
                    💬 Poruka
                  </h2>
                  <div style="background-color: #fdfdfd; padding: 20px; border-radius: 6px; border-left: 4px solid #e74c3c; line-height: 1.6; color: #2c3e50; font-size: 16px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="mailto:${email}?subject=Re: Vaš upit - Mobili più" 
                     style="display: inline-block; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    📧 Odgovori
                  </a>
                  ${phone ? `
                  <a href="tel:${phone}" 
                     style="display: inline-block; background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    📱 Pozovi
                  </a>
                  ` : ''}
                </div>
                
              </div>
              
              <!-- Footer -->
              <div style="background-color: #34495e; color: #bdc3c7; padding: 25px 40px; text-align: center; font-size: 14px;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #ecf0f1; font-size: 16px;">Mobili più</strong><br>
                  <span style="color: #95a5a6;">Sandra Fabijanić • Umag</span>
                </div>
                <hr style="border: none; height: 1px; background-color: #7f8c8d; margin: 20px 0;">
                <p style="margin: 10px 0; line-height: 1.5;">
                  📍 <strong>Lokacija:</strong> Pozioi 2, Umag<br>
                  📧 <strong>Email:</strong> <a href="mailto:info.mobilipiu@gmail.com" style="color: #3498db;">info.mobilipiu@gmail.com</a><br>
                  📱 <strong>Telefon:</strong> <a href="tel:+385915687580" style="color: #27ae60;">+385 91 568 7580</a>
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6;">
                  Ova poruka je automatski generirana putem kontakt forme na web stranici.<br>
                  Za odgovor koristite Reply dugme ili direktno kontaktirajte klijenta.
                </p>
              </div>
              
            </div>
            
          </body>
          </html>
        `
      };

      // Pošalji email
      const info = await emailTransporter.sendMail(mailOptions);
      
      console.log('✅ Email uspješno poslan!');
      console.log('📧 Message ID:', info.messageId);
      console.log('📧 Response:', info.response);

      // Uspješan odgovor
      res.json({
        success: true,
        message: 'Vaša poruka je uspješno poslana! Odgovorit ćemo vam u najkraćem mogućem roku.',
        data: { 
          id: Date.now(),
          name, 
          email, 
          phone, 
          message, 
          timestamp: new Date().toISOString(),
          status: 'sent',
          messageId: info.messageId
        }
      });

    } else {
      // Ako nema email transporter-a, vrati poruku o greški
      console.log('⚠️  Email transporter nije konfiguriran');
      res.status(500).json({
        success: false,
        message: 'Email servis trenutno nije dostupan. Molimo pokušajte kasnije ili nas kontaktirajte direktno.',
        fallback: {
          email: 'info.mobilipiu@gmail.com',
          phone: '+385 91 568 7580'
        }
      });
    }

  } catch (error) {
    console.error('❌ Greška pri slanju email-a:', error);
    console.error('❌ Email greška detalji:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri slanju poruke. Molimo pokušajte ponovno.',
      error: error.message,
      fallback: {
        email: 'info.mobilipiu@gmail.com',
        phone: '+385 91 568 7580'
      }
    });
  }
});

console.log('5. Sve API rute dodane s Supabase integracijom i filteriranjem');

app.listen(PORT, () => {
  console.log(`🚀 Server pokrenut na portu ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`💾 Baza podataka: ${supabase ? 'Supabase AKTIVAN' : 'Mock podaci'}`);
  console.log(`📋 Dostupne API rute:`);
  console.log(`   ✅ GET / - osnovne informacije`);
  console.log(`   ✅ GET /api/test - test API`);
  console.log(`   ✅ GET /api/products - lista proizvoda ${supabase ? '(Supabase)' : '(Mock)'}`);
  console.log(`   ✅ GET /api/products/:id - detalji proizvoda ${supabase ? '(Supabase)' : '(Mock)'}`);
  console.log(`   ✅ GET /api/categories - kategorije ${supabase ? '(Supabase)' : '(Mock)'}`);
  console.log(`   ✅ GET /api/brands - brendovi ${supabase ? '(Supabase)' : '(Mock)'}`);
  console.log(`   ✅ GET /api/subcategories - podkategorije ${supabase ? '(Supabase)' : '(Mock)'}`);
  console.log(`   ✅ GET /api/subcategories?category_id=X - podkategorije po kategoriji`);
  console.log(`   ✅ GET /api/contact - kontakt informacije`);
  console.log(`   ✅ POST /api/contact - slanje poruke`);
  console.log(`   🔧 POST /api/products - dodavanje proizvoda (Supabase)`);
  console.log(`   🔧 PUT /api/admin/products/:id - ažuriranje proizvoda (Supabase)`);
  console.log(`   🔧 DELETE /api/admin/products/:id - brisanje proizvoda (Supabase)`);
  console.log(`   🔧 GET /api/admin/products - admin lista proizvoda (Supabase)`);
  console.log(`   🔧 POST /api/admin/products - admin dodavanje proizvoda (Supabase)`);
  console.log(`   🔧 PUT /api/admin/products/:id - ažuriranje proizvoda (Supabase)`);
  console.log(`   🔧 DELETE /api/admin/products/:id - brisanje proizvoda (Supabase)`);
  console.log(`🎯 ${supabase ? 'Supabase baza povezana!' : 'Mock podaci aktivni'}`);
}); 