import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { readFile, writeFile, unlink } from 'fs/promises';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '1mb' }));

// Function to generate a unique file name
const generateFileName = () => crypto.randomBytes(16).toString('hex');

// Function to execute mermaid CLI and generate PNG
const generateDiagram = (inputFile, outputFile) => new Promise((resolve, reject) => {
  exec(`/home/mermaidcli/node_modules/.bin/mmdc -p /puppeteer-config.json -i ${inputFile} -o ${outputFile}`, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});

// Handle POST requests to /png endpoint
app.post('/png', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Missing `code` in request body' });
    }
    
    const fileName = generateFileName();
    const inputFile = `/tmp/${fileName}.mmd`;
    const outputFile = `/tmp/${fileName}.png`;

    // Write the code to an input file
    await writeFile(inputFile, code);

    // Generate the PNG
    await generateDiagram(inputFile, outputFile);

    // Read the PNG file and send it as a response
    const pngBuffer = await readFile(outputFile);
    res.set('Content-Type', 'image/png');
    res.send(pngBuffer);

    // Clean up the temporary files
    await Promise.all([unlink(inputFile), unlink(outputFile)]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/svg', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Missing `code` in request body' });
    }
    
    const fileName = generateFileName();
    const inputFile = `/tmp/${fileName}.mmd`;
    const outputFile = `/tmp/${fileName}.svg`;

    // Write the code to an input file
    await writeFile(inputFile, code);

    // Generate the SVG
    await generateSVG(inputFile, outputFile);

    // Read the SVG file and send it as a response
    const svgBuffer = await readFile(outputFile);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);

    // Clean up the temporary files
    await Promise.all([unlink(inputFile), unlink(outputFile)]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
