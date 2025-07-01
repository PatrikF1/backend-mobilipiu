const express = require('express');
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Jednostavan test server radi!' });
});

app.listen(PORT, () => {
  console.log(`Test server pokrenut na portu ${PORT}`);
}); 