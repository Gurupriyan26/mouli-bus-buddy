const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function generatePng(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk("IHDR", ihdrData);

  // Raw image scanlines
  const rawData = Buffer.alloc(size * (1 + size * 4));
  let offset = 0;

  const radius = size * 0.22;
  const busMinX = size * 0.2;
  const busMaxX = size * 0.8;
  const busMinY = size * 0.25;
  const busMaxY = size * 0.75;

  for (let y = 0; y < size; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < size; x++) {
      // Background: Crimson Red #dd1818 with rounded corners
      const isCorner =
        (x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius) ||
        (x > size - radius && y < radius && Math.hypot(x - (size - radius), y - radius) > radius) ||
        (x < radius && y > size - radius && Math.hypot(x - radius, y - (size - radius)) > radius) ||
        (x > size - radius && y > size - radius && Math.hypot(x - (size - radius), y - (size - radius)) > radius);

      if (isCorner) {
        // Transparent
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      } else {
        // Inside icon background: Red #dd1818
        let r = 221, g = 24, b = 24, a = 255;

        // Draw white bus body
        if (x >= busMinX && x <= busMaxX && y >= busMinY && y <= busMaxY) {
          r = 255; g = 255; b = 255; // White bus body

          // Red windshield
          if (x >= busMinX + size * 0.05 && x <= busMaxX - size * 0.05 && y >= busMinY + size * 0.06 && y <= busMinY + size * 0.22) {
            r = 221; g = 24; b = 24;
          }

          // Yellow headlights
          const leftLight = Math.hypot(x - (busMinX + size * 0.08), y - (busMaxY - size * 0.12));
          const rightLight = Math.hypot(x - (busMaxX - size * 0.08), y - (busMaxY - size * 0.12));
          if (leftLight < size * 0.05 || rightLight < size * 0.05) {
            r = 250; g = 204; b = 21; // Yellow #facc15
          }

          // Front grille
          if (x >= size * 0.4 && x <= size * 0.6 && y >= busMaxY - size * 0.14 && y <= busMaxY - size * 0.08) {
            r = 31; g = 41; b = 55; // Dark gray
          }
        }

        // Dark wheels at bottom
        const leftWheel = Math.hypot(x - (busMinX + size * 0.12), y - (busMaxY + size * 0.06));
        const rightWheel = Math.hypot(x - (busMaxX - size * 0.12), y - (busMaxY + size * 0.06));
        if (leftWheel < size * 0.08 || rightWheel < size * 0.08) {
          r = 31; g = 41; b = 55;
        }

        rawData[offset++] = r;
        rawData[offset++] = g;
        rawData[offset++] = b;
        rawData[offset++] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressedData);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), generatePng(192));
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), generatePng(512));
fs.writeFileSync(path.join(iconsDir, "apple-touch-icon.png"), generatePng(180));

console.log("Successfully generated icon-192.png, icon-512.png, and apple-touch-icon.png!");
