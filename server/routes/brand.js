const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// GET /api/brand/logo -> serves a logo file from project root or from env LOGO_PATH
router.get('/logo', (req, res) => {
  const rootDir = path.resolve(__dirname, '..', '..'); // project root

  // Always prefer the PNG in the project root, as requested
  const pngInRoot = path.resolve(rootDir, 'logo.png');
  try {
    if (fs.existsSync(pngInRoot)) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return res.sendFile(pngInRoot);
    }
  } catch {}

  // If PNG is not present, fall back to LOGO_PATH (prefer PNG if provided), then other common formats
  const envPath = process.env.LOGO_PATH ? path.resolve(rootDir, process.env.LOGO_PATH) : null;
  const envIsPng = envPath && envPath.toLowerCase().endsWith('.png');

  const candidates = [];
  if (envPath && envIsPng) candidates.push(envPath);
  candidates.push(
    path.resolve(rootDir, 'logo.jpg'),
    path.resolve(rootDir, 'logo.jpeg'),
    path.resolve(rootDir, 'logo.svg'),
    path.resolve(rootDir, 'logo.webp')
  );
  if (envPath && !envIsPng) candidates.push(envPath);

  const found = candidates.find(p => {
    try { return fs.existsSync(p); } catch { return false; }
  });

  if (found) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return res.sendFile(found);
  }

  return res.status(404).json({ message: 'Logo not found. Place logo.png in the project root (preferred), or set LOGO_PATH.' });
});

module.exports = router;
