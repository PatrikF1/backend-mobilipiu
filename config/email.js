const nodemailer = require('nodemailer');

// Email konfiguracija za Gmail SMTP
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true za 465, false za ostale portove
  auth: {
    user: process.env.GMAIL_USER || 'info.mobilipiu@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Mora biti App Password, ne obični password
  }
};

// Kreiranje Nodemailer transportera
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    
    // Testiranje konfiguracije
    transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Email konfiguracija greška:', error.message);
      } else {
        console.log('✅ Email server je spreman za slanje poruka');
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('❌ Greška pri kreiranju email transportera:', error);
    return null;
  }
};

// Funkcija za slanje email poruke
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter nije konfiguriran');
  }
  
  const mailOptions = {
    from: `${process.env.GMAIL_FROM_NAME || 'Mobili više'} <${process.env.GMAIL_USER || 'info.mobilipiu@gmail.com'}>`,
    to: to,
    subject: subject,
    text: text,
    html: html
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email uspješno poslan:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email je uspješno poslan'
    };
  } catch (error) {
    console.error('❌ Greška pri slanju emaila:', error);
    return {
      success: false,
      error: error.message,
      message: 'Greška pri slanju emaila'
    };
  }
};

// Template za kontakt poruku
const createContactEmailTemplate = (data) => {
  const { name, email, phone, message } = data;
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .field label { font-weight: bold; color: #8B4513; }
        .footer { background-color: #8B4513; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nova poruka s web stranice</h1>
          <p>Mobili više - ${new Date().toLocaleDateString('hr-HR')}</p>
        </div>
        <div class="content">
          <div class="field">
            <label>Ime:</label>
            <p>${name}</p>
          </div>
          <div class="field">
            <label>Email:</label>
            <p>${email}</p>
          </div>
          <div class="field">
            <label>Telefon:</label>
            <p>${phone || 'Nije naveden'}</p>
          </div>
          <div class="field">
            <label>Poruka:</label>
            <p>${message}</p>
          </div>
        </div>
        <div class="footer">
          <p>Ova poruka je poslana s kontakt forme na www.mobilipiu.hr</p>
          <p>Odgovorite direktno na email: ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const textTemplate = `
Nova poruka s web stranice - Mobili više

Ime: ${name}
Email: ${email}
Telefon: ${phone || 'Nije naveden'}

Poruka:
${message}

---
Poslano: ${new Date().toLocaleDateString('hr-HR')} u ${new Date().toLocaleTimeString('hr-HR')}
Web stranica: www.mobilipiu.hr
  `;
  
  return {
    html: htmlTemplate,
    text: textTemplate,
    subject: `Nova poruka od ${name} - Mobili više`
  };
};

module.exports = {
  sendEmail,
  createContactEmailTemplate,
  createTransporter
}; 