const fs = require('fs');
const path = require('path');
const https = require('https');

// Tạo thư mục soloud trong public nếu chưa tồn tại
const soloudDir = path.join(__dirname, '../public/soloud');
if (!fs.existsSync(soloudDir)) {
  fs.mkdirSync(soloudDir, { recursive: true });
}

// Tải xuống phiên bản đã biên dịch của SoLoud
console.log('Downloading pre-built SoLoud...');
const wasmUrl = 'https://raw.githubusercontent.com/jarikomppa/soloud/master/contrib/emscripten/soloud.wasm';
const jsUrl = 'https://raw.githubusercontent.com/jarikomppa/soloud/master/contrib/emscripten/soloud.js';

// Tải xuống file .wasm
https.get(wasmUrl, (response) => {
  const file = fs.createWriteStream(path.join(soloudDir, 'soloud.wasm'));
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded soloud.wasm');
  });
});

// Tải xuống file .js
https.get(jsUrl, (response) => {
  const file = fs.createWriteStream(path.join(soloudDir, 'soloud.js'));
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded soloud.js');
  });
});

console.log('Download complete!'); 