const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');

// Brendovi sa kojima sarađuje Mobili più
const brands = [
  {
    name: 'Bosch',
    description: 'Vodeći njemački proizvođač kućanskih aparata poznat po inovacijama i kvaliteti.',
    logo: '/images/brands/bosch-logo.png',
    website: 'https://www.bosch-home.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Ugradbeni aparati']
  },
  {
    name: 'Miele',
    description: 'Premium njemački brand za kućanske aparate visoke kvalitete s dugotrajnim performansama.',
    logo: '/images/brands/miele-logo.png',
    website: 'https://www.miele.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Pranje i sušenje']
  },
  {
    name: 'Electrolux',
    description: 'Švedski brand s dugom tradicijom u proizvodnji inovativnih kućanskih aparata.',
    logo: '/images/brands/electrolux-logo.png',
    website: 'https://www.electrolux.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Profesionalni aparati']
  },
  {
    name: 'Beko',
    description: 'Turski brand koji kombinira modernu tehnologiju s pristupačnim cijenama.',
    logo: '/images/brands/beko-logo.png',
    website: 'https://www.beko.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Hlađenje']
  },
  {
    name: 'AEG',
    description: 'Njemački brand poznat po pouzdanim i inovativnim kućanskim aparatima.',
    logo: '/images/brands/aeg-logo.png',
    website: 'https://www.aeg.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Ugradbeni aparati']
  },
  {
    name: 'Gorenje',
    description: 'Slovenski brand koji spaja tradiciju s modernom tehnologijom i dizajnom.',
    logo: '/images/brands/gorenje-logo.png',
    website: 'https://www.gorenje.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Retro dizajn']
  },
  {
    name: 'Tesla',
    description: 'Srpski brand poznat po kvalitetnim i pouzdanim kućanskim aparatima.',
    logo: '/images/brands/tesla-logo.png',
    website: 'https://www.tesla.rs',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Klima uređaji']
  },
  {
    name: 'Grundig',
    description: 'Njemački brand s tradicijom u proizvodnji elektronike i kućanskih aparata.',
    logo: '/images/brands/grundig-logo.png',
    website: 'https://www.grundig.com',
    specialties: ['Bijela tehnika', 'Mali kućanski aparati', 'Audio/Video']
  },
  {
    name: 'Philips',
    description: 'Nizozemski multinacionalni brand poznat po inovacijama u zdravlju i wellnessu.',
    logo: '/images/brands/philips-logo.png',
    website: 'https://www.philips.com',
    specialties: ['Mali kućanski aparati', 'Osobna njega', 'Zdravlje']
  },
  {
    name: 'Samsung',
    description: 'Južnokorejski tehnološki gigant poznat po inovativnim kućanskim aparatima.',
    logo: '/images/brands/samsung-logo.png',
    website: 'https://www.samsung.com',
    specialties: ['Bijela tehnika', 'Pametni aparati', 'Tehnologija']
  },
  {
    name: 'Alples',
    description: 'Specijalizovan za kvalitetan kuhinjski namještaj i opremu.',
    logo: '/images/brands/alples-logo.png',
    website: '#',
    specialties: ['Namještaj', 'Kuhinjski elementi']
  },
  {
    name: 'Astra Cucine',
    description: 'Italijanski brand poznat po modernom dizajnu kuhinja.',
    logo: '/images/brands/astra-cucine-logo.png',
    website: 'https://www.astracucine.it',
    specialties: ['Namještaj', 'Kuhinje']
  }
];

// GET svi brendovi
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('name');
        
        if (!error && data && data.length > 0) {
          const dbBrands = data.map(row => ({
            name: row.name,
            description: row.description,
            logo: row.logo,
            website: row.website,
            specialties: typeof row.specialties === 'string' ? JSON.parse(row.specialties) : row.specialties
          }));
          return res.json(dbBrands);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fallback na statičke podatke
      }
    }
    // Fallback na statičke podatke ako nema baze
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET određeni brand
router.get('/:brandName', async (req, res) => {
  try {
    let brand = null;
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .ilike('name', req.params.brandName)
          .single();
        
        if (!error && data) {
          brand = {
            name: data.name,
            description: data.description,
            logo: data.logo,
            website: data.website,
            specialties: typeof data.specialties === 'string' ? JSON.parse(data.specialties) : data.specialties
          };
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    // Fallback na statičke podatke ako nema iz baze
    if (!brand) {
      brand = brands.find(b => 
        b.name.toLowerCase() === req.params.brandName.toLowerCase()
      );
    }
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand nije pronađen' });
    }
    
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 