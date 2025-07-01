const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');
const { sendEmail, createContactEmailTemplate } = require('../config/email');

// Informacije o trgovini
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
  brands: ['Bosch', 'Miele', 'Electrolux', 'AEG', 'Gorenje', 'Tesla', 'Beko'],
  services: ['Prodaja kućanskih aparata', '3D dizajn prostora', 'Dostava i instalacija', 'Servis i održavanje']
};

// GET informacije o trgovini
router.get('/info', (req, res) => {
  try {
    res.json(storeInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contact - Dohvaćanje kontakt informacija
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: storeInfo
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju kontakt informacija:', error);
    res.status(500).json({
      success: false,
      message: 'Greška servera pri dohvaćanju kontakt informacija'
    });
  }
});

// POST /api/contact - Slanje kontakt poruke
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validacija podataka
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
    
    // Spremanje poruke u Supabase (ako je konfiguriran)
    let contactMessageId = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([
            {
              name: name,
              email: email,
              phone: phone || null,
              message: message,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Greška pri spremanju u Supabase:', error);
        } else {
          contactMessageId = data.id;
          console.log('✅ Poruka spremljena u Supabase:', contactMessageId);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Nastavi s slanjem emaila čak i ako se spremanje ne uspije
      }
    }
    
    // Priprema email sadržaja
    const emailTemplate = createContactEmailTemplate({
      name,
      email,
      phone,
      message
    });
    
    // Slanje emaila
    try {
      const emailResult = await sendEmail({
        to: 'info.mobilipiu@gmail.com',
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      });
      
      if (emailResult.success) {
        // Uspješno poslano
        res.status(200).json({
          success: true,
          message: 'Vaša poruka je uspješno poslana! Odgovorit ćemo vam u najkraćem mogućem roku.',
          data: {
            messageId: emailResult.messageId,
            contactId: contactMessageId,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        // Email se nije uspio poslati
        res.status(500).json({
          success: false,
          message: 'Dogodila se greška pri slanju poruke. Molimo pokušajte ponovno ili nas kontaktirajte direktno.',
          error: emailResult.error
        });
      }
    } catch (emailError) {
      console.error('❌ Unexpected email error:', emailError);
      res.status(500).json({
        success: false,
        message: 'Dogodila se neočekivana greška pri slanju poruke. Molimo kontaktirajte nas direktno na info.mobilipiu@gmail.com.',
        error: emailError.message
      });
    }
    
  } catch (error) {
    console.error('❌ General contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Dogodila se greška servera. Molimo pokušajte ponovno.',
      error: error.message
    });
  }
});

// GET /api/contact/messages - Dohvaćanje svih poruka (admin ruta)
router.get('/messages', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: 'Baza podataka nije konfigurirana'
      });
    }
    
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
    
  } catch (error) {
    console.error('Greška pri dohvaćanju poruka:', error);
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju poruka',
      error: error.message
    });
  }
});

module.exports = router; 