let supabase = null;

// Inicijalizacija baze podataka - još sigurnija verzija
async function initializeDatabase() {
  try {
    // Provjeri da li su Supabase varijable postavljene
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase environment varijable nisu postavljene');
      return false;
    }

    // Validiraj URL format
    if (!supabaseUrl.startsWith('http')) {
      console.log('⚠️  Neispravni Supabase URL format');
      return false;
    }
    
    // Dinamički uvoz Supabase modula
    const { createClient } = require('@supabase/supabase-js');
    
    // Kreiraj Supabase klijent
    supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!supabase) {
      console.log('⚠️  Neuspješno kreiranje Supabase klijenta');
      return false;
    }

    console.log('✅ Supabase klijent kreiran uspješno');
    
    // Vratiti true bez testiranja konekcije
    // Test konekcije će se izvršiti kada se prvi put pozove API
    return true;

  } catch (error) {
    console.error('❌ Greška pri inicijalizaciji Supabase:', error.message);
    return false;
  }
}

// Export
module.exports = {
  supabase,
  initializeDatabase
}; 