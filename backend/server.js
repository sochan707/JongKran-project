const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'JongKran backend is running' });
});

app.get('/recipes', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Fried Rice',
      ingredients: ['rice', 'egg', 'garlic']
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});