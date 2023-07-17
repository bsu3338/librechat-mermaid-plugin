import { mermaidAPI } from 'mermaid';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

mermaidAPI.initialize({ startOnLoad: false });

// Handle POST requests to /png endpoint
app.post('/png', async (req, res) => {
  try {
    const { code, options } = req.body;

    // Generate the PNG using mermaid API with specified options
    const pngBuffer = mermaidAPI.render(code, options);

    // Send the generated PNG as a response
    res.set('Content-Type', 'image/png');
    res.send(pngBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Handle POST requests to /svg endpoint
app.post('/svg', async (req, res) => {
  try {
    const { code, options } = req.body;

    // Generate the SVG using mermaid API with specified options
    const svgCode = mermaidAPI.render(code, options);

    // Send the generated SVG as a response
    res.set('Content-Type', 'image/svg+xml');
    res.send(svgCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
