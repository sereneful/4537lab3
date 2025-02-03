/**
 * server.js
 *
 * This is the main server file for the assignment.
 * It implements three GET endpoints:
 *
 * 1. GET /COMP4537/labs/3/getDate/?name=YourName
 *    - Returns an HTML page with a greeting and the current server date and time,
 *      styled in blue (inline CSS).
 *
 * 2. GET /COMP4537/labs/3/writeFile/?text=YourText
 *    - Appends the provided text (plus a newline) to 'file.txt'.
 *      If the file does not exist, it is created.
 *
 * 3. GET /COMP4537/labs/3/readFile/file.txt
 *    - Reads the contents of 'file.txt' and returns them as plain text.
 *      If the file does not exist, a 404 error is returned.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Import the getDate function from our utils module.
const { getDate } = require('./modules/utils');

// Determine the port from the environment (DigitalOcean App Platform) or default to 3000.
const PORT = process.env.PORT || 3000;

// Set a safe location for file storage (DigitalOcean may block root directory writes)
const filePath = path.join('/tmp', 'file.txt');

// Create the HTTP server.
const server = http.createServer((req, res) => {
  // Parse the URL and its query parameters.
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Received request: ${req.method} ${pathname}`);

  // -----------------------------------------------------------
  // Endpoint 1: GET /COMP4537/labs/3/getDate/?name=YourName
  // -----------------------------------------------------------
  if (pathname === '/COMP4537/labs/3/getDate/' || pathname === '/COMP4537/labs/3/getDate') {
    // Get the 'name' parameter; default to "Guest" if not provided.
    const name = query.name || 'Guest';
    // Generate the HTML response using the getDate function.
    const htmlResponse = getDate(name);

    console.log(`Sent time response for: ${name}`);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlResponse);

  // -----------------------------------------------------------
  // Endpoint 2: GET /COMP4537/labs/3/writeFile/?text=YourText
  // -----------------------------------------------------------
  } else if (pathname === '/COMP4537/labs/3/writeFile/' || pathname === '/COMP4537/labs/3/writeFile') {
    const text = query.text || '';

    fs.appendFile(filePath, text + '\n', (err) => {
      if (err) {
        console.error(`Error writing to file: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error: Failed to write to file.');
      } else {
        console.log(`Text appended: "${text}"`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Success: Text appended to file.txt.');
      }
    });

  // -----------------------------------------------------------
  // Endpoint 3: GET /COMP4537/labs/3/readFile/file.txt
  // -----------------------------------------------------------
  } else if (pathname === '/COMP4537/labs/3/readFile/file.txt') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Error: File 'file.txt' not found.`);
      } else {
        console.log(`File read successfully.`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });

  // -----------------------------------------------------------
  // Fallback for any undefined endpoints.
  // -----------------------------------------------------------
  } else {
    console.warn(`404 Not Found: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: Endpoint not found.');
  }
});

// Start the server, ensuring it listens on all network interfaces.
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
