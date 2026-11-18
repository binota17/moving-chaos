// =========================================================================
// MOVING CHAOS - LAN CO-OP SERVER (Zero Dependencies - Pure Node.js)
// =========================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

let activePort = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.obj': 'text/plain; charset=utf-8',
  '.mtl': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 1. HTTP Static Server
const server = http.createServer((req, res) => {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  let reqPath;
  try {
    reqPath = decodeURI((req.url || '/').split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('400 Bad Request');
    return;
  }
  if (reqPath === '/' || reqPath === '' || reqPath === '/index.html') reqPath = '/moving_chaos.html';

  const filePath = path.resolve(ROOT_DIR, '.' + reqPath);

  // Security: prevent path traversal
  if (filePath !== ROOT_DIR && !filePath.startsWith(ROOT_DIR + path.sep)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  // API endpoint for server info & LAN IPs
  if (reqPath === '/api/lan-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ips: getLocalIPs(),
      port: activePort,
      time: Date.now()
    }));
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to moving_chaos.html
      const fallback = path.join(ROOT_DIR, 'moving_chaos.html');
      fs.readFile(fallback, (fErr, data) => {
        if (fErr) {
          res.writeHead(404);
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  });
});

// 2. Pure RFC 6455 WebSocket Implementation
const rooms = new Map(); // roomId -> { host: ws, client: ws, state: {} }

function setupWebSocket(httpServer) {
  httpServer.on('upgrade', (req, socket, head) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
      socket.destroy();
      return;
    }

    const digest = crypto.createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      'Sec-WebSocket-Accept: ' + digest
    ];
    socket.setNoDelay(true);
    socket.write(headers.join('\r\n') + '\r\n\r\n');

    const ws = {
      socket,
      role: null, // 'host' or 'client'
      roomId: null,
      send: (data, dropIfBusy = false) => {
        try {
          if (socket.destroyed || !socket.writable) return;
          if (dropIfBusy && socket.writableLength > 24576) return;
          const payload = Buffer.from(typeof data === 'string' ? data : JSON.stringify(data));
          const len = payload.length;
          let header;
          if (len < 126) {
            header = Buffer.from([0x81, len]);
          } else if (len <= 65535) {
            header = Buffer.alloc(4);
            header[0] = 0x81;
            header[1] = 126;
            header.writeUInt16BE(len, 2);
          } else {
            header = Buffer.alloc(10);
            header[0] = 0x81;
            header[1] = 127;
            header.writeBigUInt64BE(BigInt(len), 2);
          }
          socket.write(Buffer.concat([header, payload]));
        } catch (e) {}
      },
      close: () => socket.end()
    };

    let buffer = Buffer.alloc(0);
    let fragChunks = [];
    let fragBytes = 0;
    let fragOpcode = 0;
    const MAX_FRAME_BYTES = 2 * 1024 * 1024;

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 2) {
        const byte1 = buffer[0];
        const byte2 = buffer[1];
        const isFin = (byte1 & 0x80) !== 0;
        const opcode = byte1 & 0x0f;
        const isMasked = (byte2 & 0x80) !== 0;
        let payloadLen = byte2 & 0x7f;
        let offset = 2;

        if (payloadLen === 126) {
          if (buffer.length < 4) break;
          payloadLen = buffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLen === 127) {
          if (buffer.length < 10) break;
          payloadLen = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        if (!Number.isFinite(payloadLen) || payloadLen < 0 || payloadLen > MAX_FRAME_BYTES) {
          handleDisconnect(ws);
          socket.destroy();
          return;
        }

        const maskLen = isMasked ? 4 : 0;
        if (buffer.length < offset + maskLen + payloadLen) break;

        let mask = null;
        if (isMasked) {
          mask = buffer.subarray(offset, offset + 4);
          offset += 4;
        }

        const payload = Buffer.from(buffer.subarray(offset, offset + payloadLen));
        buffer = buffer.subarray(offset + payloadLen);
        if (buffer.length === 0) buffer = Buffer.alloc(0);

        if (opcode === 0x08) { // close frame
          handleDisconnect(ws);
          socket.end();
          return;
        }
        if (opcode === 0x09) { // ping frame -> reply pong
          socket.write(Buffer.from([0x8a, 0x00]));
          continue;
        }
        if (opcode === 0x0a) { // pong frame
          continue;
        }

        if (isMasked) {
          for (let i = 0; i < payload.length; i++) {
            payload[i] ^= mask[i % 4];
          }
        }

        let fullPayload = null;
        if (opcode === 0x01 || opcode === 0x02) {
          if (isFin) {
            fullPayload = payload;
            fragChunks = [];
            fragBytes = 0;
            fragOpcode = 0;
          } else {
            fragOpcode = opcode;
            fragChunks = [payload];
            fragBytes = payload.length;
          }
        } else if (opcode === 0x00 && fragOpcode) {
          fragBytes += payload.length;
          if (fragBytes > MAX_FRAME_BYTES) {
            handleDisconnect(ws);
            socket.destroy();
            return;
          }
          fragChunks.push(payload);
          if (isFin) {
            fullPayload = Buffer.concat(fragChunks);
            fragChunks = [];
            fragBytes = 0;
            fragOpcode = 0;
          }
        }

        if (fullPayload) {
          try {
            const msg = JSON.parse(fullPayload.toString('utf8'));
            handleMessage(ws, msg);
          } catch (err) {
            console.error('WS Parse Error:', err.message);
          }
        }
      }
    });

    socket.on('close', () => handleDisconnect(ws));
    socket.on('error', () => handleDisconnect(ws));
  });
}

function handleMessage(ws, msg) {
  const { type, roomId, data, level, variant, unlimitedTime } = msg;

  if (type === 'CREATE_ROOM') {
    const rId = roomId || 'room_' + Math.floor(1000 + Math.random() * 9000);
    ws.role = 'host';
    ws.roomId = rId;

    rooms.set(rId, {
      host: ws,
      client: null,
      level: level || (data ? data.level : 1) || 1,
      p1Variant: variant || 'base',
      p2Variant: 'builder',
      unlimitedTime: !!unlimitedTime,
      lastActive: Date.now()
    });

    ws.send({
      type: 'ROOM_CREATED',
      roomId: rId,
      role: 'host',
      message: 'Đã tạo phòng ' + rId + '. Đang chờ Thợ 2 kết nối...'
    });
    console.log(`[ROOM ${rId}] Host P1 đã tạo phòng.`);
    return;
  }

  if (type === 'JOIN_ROOM') {
    const rId = roomId || 'default';
    let room = rooms.get(rId);

    // If default room doesn't exist, search for any room waiting for client
    if (!room) {
      for (const [id, r] of rooms.entries()) {
        if (!r.client) {
          room = r;
          break;
        }
      }
    }

    if (!room) {
      ws.send({
        type: 'JOIN_ERROR',
        message: 'Không tìm thấy phòng chơi nào đang mở. Hãy nhờ máy Host bấm Tạo Phòng!'
      });
      return;
    }

    if (room.client) {
      ws.send({
        type: 'JOIN_ERROR',
        message: 'Phòng đã đủ 2 người chơi (Host P1 + Client P2)!'
      });
      return;
    }

    ws.role = 'client';
    ws.roomId = room.host.roomId;
    room.client = ws;
    if (variant) room.p2Variant = variant;

    // Notify Client
    ws.send({
      type: 'ROOM_JOINED',
      roomId: room.host.roomId,
      role: 'client',
      level: room.level,
      p1Variant: room.p1Variant,
      p2Variant: room.p2Variant,
      unlimitedTime: !!room.unlimitedTime,
      message: 'Đã tham gia phòng thành công! Sẵn sàng dọn nhà cùng Thợ Cả P1!'
    });

    // Notify Host
    room.host.send({
      type: 'PEER_CONNECTED',
      p2Variant: room.p2Variant,
      message: 'Thợ Phụ P2 đã kết nối vào phòng! Bắt đầu dọn nhà nào!'
    });

    console.log(`[ROOM ${room.host.roomId}] Client P2 đã kết nối vào phòng.`);
    return;
  }

  // Relay real-time messages between Host and Client
  if (ws.roomId && rooms.has(ws.roomId)) {
    const room = rooms.get(ws.roomId);
    if (type === 'RESTART_GAME' && ws.role === 'host') {
      if (msg.level) room.level = msg.level;
      if (msg.p1Variant) room.p1Variant = msg.p1Variant;
      if (msg.p2Variant) room.p2Variant = msg.p2Variant;
      if (msg.unlimitedTime !== undefined) room.unlimitedTime = !!msg.unlimitedTime;
      if (room.client) room.client.send(msg);
      return;
    }
    if (type === 'REQUEST_RESTART' && ws.role === 'client' && room.host) {
      room.host.send(msg);
      return;
    }
    if (ws.role === 'host' && room.client) {
      // Drop stale HOST_STATE frames if client TCP buffer is busy
      room.client.send(msg, type === 'HOST_STATE');
    } else if (ws.role === 'client' && room.host) {
      room.host.send(msg, type === 'P2_STATE');
    }
  }
}

function handleDisconnect(ws) {
  if (!ws.roomId) return;
  const room = rooms.get(ws.roomId);
  if (!room) return;

  if (ws.role === 'host') {
    console.log(`[ROOM ${ws.roomId}] Host đã ngắt kết nối.`);
    if (room.client) {
      room.client.send({
        type: 'PEER_DISCONNECTED',
        message: 'Host P1 đã rời phòng!'
      });
      room.client.role = null;
      room.client.roomId = null;
    }
    rooms.delete(ws.roomId);
  } else if (ws.role === 'client') {
    console.log(`[ROOM ${ws.roomId}] Client P2 đã ngắt kết nối.`);
    room.client = null;
    if (room.host) {
      room.host.send({
        type: 'PEER_DISCONNECTED',
        message: 'Thợ Phụ P2 đã ngắt kết nối!'
      });
    }
  }
}

// 3. Helper to detect Local Network IP addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({ name, address: iface.address });
      }
    }
  }
  return ips;
}

// 4. Start Server
setupWebSocket(server);

const maxPort = activePort + 20;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && activePort < maxPort) {
    console.warn(`⚠️ Port ${activePort} đang được sử dụng, tự động thử Port ${activePort + 1}...`);
    activePort += 1;
    server.listen(activePort, '0.0.0.0');
  } else {
    throw err;
  }
});

server.on('listening', () => {
  const actualPort = server.address().port;
  activePort = actualPort;
  const ips = getLocalIPs();
  console.log('\n=============================================================');
  console.log('🚚 MOVING CHAOS - LAN CO-OP WEBSOCKET SERVER');
  console.log('=============================================================');
  console.log(`✅ Server đang chạy tại Port: ${actualPort}`);
  console.log(`👉 Truy cập trên máy này:     http://localhost:${actualPort}`);
  if (ips.length > 0) {
    console.log('\n🌐 ĐỊA CHỈ TRUY CẬP TRONG MẠNG LAN / WI-FI:');
    ips.forEach(ip => {
      console.log(`   🔗 [${ip.name}] http://${ip.address}:${actualPort}`);
    });
    console.log('\n💡 Chỉ cần mở link trên từ Điện Thoại hoặc Laptop khác');
    console.log('   (ở chung Wi-Fi) là có thể chơi Co-op 2 người ngay!');
  } else {
    console.log('⚠️ Không phát hiện card mạng Wi-Fi/LAN ngoài (Đang chạy localhost).');
  }
  console.log('=============================================================\n');
});

server.listen(activePort, '0.0.0.0');
