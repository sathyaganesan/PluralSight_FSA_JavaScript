const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());

// Allow CORS so recipe.html can call this API from anywhere (file:// or http://)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const dataFilePath = path.join(__dirname, 'data.json');
console.log('Using data.json at:', dataFilePath);  // <-- check this path in the console

app.post('/recipes', (req, res) => {
  const newRecipe = req.body;
  console.log('Received recipe:', newRecipe);  // <-- confirms request reached server

  // Read existing file
  fs.readFile(dataFilePath, 'utf8', (readErr, fileData) => {
    let recipes = [];

    if (!readErr && fileData.trim() !== '') {
      try {
        recipes = JSON.parse(fileData);
        if (!Array.isArray(recipes)) {
          recipes = [];
        }
      } catch (parseErr) {
        console.error('Error parsing data.json, resetting to []:', parseErr);
        recipes = [];
      }
    }

    // Append new recipe
    recipes.push(newRecipe);

    // Write updated array back to data.json
    fs.writeFile(
      dataFilePath,
      JSON.stringify(recipes, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error('Error writing to data.json:', writeErr);
          return res.status(500).send('Failed to write to data.json');
        }

        console.log('Saved recipe. Total recipes:', recipes.length);
        res.status(200).send('Recipe saved successfully');
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
