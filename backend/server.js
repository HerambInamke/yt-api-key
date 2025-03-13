import express from 'express';
import cors from 'cors';
import { dataset } from './dataset.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Search endpoint
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }

  const results = dataset.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(query.toLowerCase())
    )
  );

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});