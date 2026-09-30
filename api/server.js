const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

let visitors = 0;

app.get('/visits', (req, res) => {
  visitors++;
  res.json({ visitors });
});

app.listen(3000, () => console.log('API running on port 3000'));