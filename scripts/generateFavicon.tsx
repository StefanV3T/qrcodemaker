import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import Logo from '../app/components/Logo';

// Path to public directory
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Generate the SVG string
const svgString = ReactDOMServer.renderToString(
  <Logo size={512} color="#000000" bgColor="#FFFFFF" />
);

// Create the favicon.svg file
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'favicon.svg'),
  svgString
);

console.log('Favicon SVG generated successfully!');
console.log('Now convert SVG to ICO/PNG formats using tools like https://realfavicongenerator.net');
