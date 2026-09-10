const fs = require('fs');
const path = require('path');
const d = '/mnt/IA/IA/AgentWorkspaces/FiTWM/public';

// Minimal valid PNG (1x1 red pixel)
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync(path.join(d, 'pwa-192x192.png'), png);
fs.writeFileSync(path.join(d, 'pwa-512x512.png'), png);
fs.writeFileSync(path.join(d, 'apple-touch-icon.png'), png);
console.log('Icons created');
