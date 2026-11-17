const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:8080';

app.use(cors({ origin: ALLOWED_ORIGIN }));

let visitors = 0;

app.get('/visits', (req, res) => {
  visitors++;
  res.json({ visitors });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));