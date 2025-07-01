const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');

// Statičke kategorije i potkategorije
const categories = {
  'Bijela tehnika': [
    'Frižideri',
    'Perilice rublja',
    'Sušilice rublja',
    'Perilice posuđa',
    'Štednjaci',
    'Pećnice',
    'Ploče za kuhanje',
    'Nape',
    'Mikrovalne pećnice',
    'Zamrzivači'
  ],
  'Mali kućanski aparati': [
    'Kafe aparati',
    'Ekspres za kafu',
    'Toster',
    'Blender',
    'Mikser',
    'Friteuse',
    'Grill',
    'Robot za kuhinju',
    'Aparat za smoothie',
    'Aparat za vafle'
  ],
  'Namještaj': [
    'Kuhinjski namještaj',
    'Trpezarijski namještaj',
    'Dnevni boravak',
    'Spavaće sobe',
    'Radni stolovi',
    'Ormarići',
    'Police',
    'Stolice'
  ]
};

// GET sve kategorije
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (!error && data && data.length > 0) {
          const dbCategories = data.map(row => ({
            name: row.name,
            subcategories: typeof row.subcategories === 'string' ? JSON.parse(row.subcategories) : row.subcategories
          }));
          return res.json(dbCategories);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fallback na statičke podatke
      }
    }
    
    // Fallback na statičke podatke
    const categoryList = Object.keys(categories).map(category => ({
      name: category,
      subcategories: categories[category]
    }));
    
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET potkategorije za određenu kategoriju
router.get('/:category', async (req, res) => {
  try {
    let result = null;
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('name', req.params.category)
          .single();
        
        if (!error && data) {
          result = {
            category: data.name,
            subcategories: typeof data.subcategories === 'string' ? JSON.parse(data.subcategories) : data.subcategories
          };
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    // Fallback na statičke podatke
    if (!result) {
      const category = req.params.category;
      const subcategories = categories[category];
      
      if (!subcategories) {
        return res.status(404).json({ message: 'Kategorija nije pronađena' });
      }
      
      result = {
        category,
        subcategories
      };
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 