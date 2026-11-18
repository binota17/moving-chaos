// =========================================================================
// WEBSOCKET NETWORK MANAGER FOR LAN CO-OP
// =========================================================================
import { PACKET_TYPES } from './Protocol.js';
import { eventBus } from '../core/EventBus.js';

export class NetworkManager {
  constructor() {
    this.ws = null;
    this.role = null; // 'host' or 'client'
    this.roomId = null;
    this.isConnected = false;

    this.onStateReceived = null;
    this.onP2InputReceived = null;
    this.onP2StateReceived = null;
    this.onP2ActionReceived = null;
  }

  connect(role, roomId, onStatusChange, options = {}) {
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
      this.ws = null;
      this.isConnected = false;
    }

    this.role = role;
    this.roomId = roomId;

    const hostUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + (location.host || 'localhost:3000');

    let ws;
    try {
      ws = new WebSocket(hostUrl);
      this.ws = ws;
    } catch (err) {
      if (onStatusChange) onStatusChange('error', 'Không thể kết nối WebSocket server.');
      return;
    }

    if (onStatusChange) onStatusChange('connecting', 'Đang kết nối WebSocket...');

    ws.onopen = () => {
      if (this.ws !== ws) return;
      this.isConnected = true;
      if (role === 'host') {
        this.send(PACKET_TYPES.CREATE_ROOM, {
          roomId,
          level: options.level || 1,
          variant: options.variant || 'base',
          unlimitedTime: !!options.unlimitedTime
        });
      } else {
        this.send(PACKET_TYPES.JOIN_ROOM, {
          roomId,
          variant: options.variant || 'builder'
        });
      }
      if (onStatusChange) onStatusChange('connected', 'Đã kết nối Server!');
    };

    ws.onmessage = (event) => {
      if (this.ws !== ws) return;
      try {
        const msg = JSON.parse(event.data);
        this.handleMessage(msg, onStatusChange);
      } catch (err) {
        console.error('[NetworkManager] Parse Error:', err);
      }
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;
      this.isConnected = false;
      if (onStatusChange) onStatusChange('error', 'Lỗi kết nối WebSocket.');
    };

    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.isConnected = false;
      if (onStatusChange) onStatusChange('closed', 'Đã ngắt kết nối WebSocket.');
    };
  }

  handleMessage(msg, onStatusChange) {
    switch (msg.type) {
      case PACKET_TYPES.ROOM_CREATED:
        this.roomId = msg.roomId;
        if (onStatusChange) onStatusChange('waiting', `Phòng: ${msg.roomId} (Chờ P2...)`);
        eventBus.emit('roomCreated', { roomId: msg.roomId });
        break;

      case PACKET_TYPES.ROOM_JOINED:
        this.roomId = msg.roomId;
        if (onStatusChange) onStatusChange('ready', `Đã vào phòng: ${msg.roomId}!`);
        eventBus.emit('roomJoined', {
          roomId: msg.roomId,
          level: msg.level,
          p1Variant: msg.p1Variant,
          p2Variant: msg.p2Variant,
          unlimitedTime: !!msg.unlimitedTime
        });
        break;

      case PACKET_TYPES.JOIN_ERROR:
        if (onStatusChange) onStatusChange('error', msg.message);
        eventBus.emit('joinError', { message: msg.message });
        break;

      case PACKET_TYPES.PEER_CONNECTED:
        if (onStatusChange) onStatusChange('ready', 'Thợ 2 đã tham gia! Bắt đầu!');
        eventBus.emit('peerConnected', { p2Variant: msg.p2Variant });
        break;

      case PACKET_TYPES.PEER_DISCONNECTED:
        if (onStatusChange) onStatusChange('disconnected', 'Bạn chơi đã ngắt kết nối!');
        eventBus.emit('peerDisconnected', { message: msg.message });
        break;

      case PACKET_TYPES.P2_INPUT:
        if (this.role === 'host' && this.onP2InputReceived) {
          this.onP2InputReceived(msg.keys);
        }
        break;

      case PACKET_TYPES.P2_STATE:
        if (this.role === 'host' && this.onP2StateReceived) {
          this.onP2StateReceived(msg.state);
        }
        break;

      case PACKET_TYPES.P2_ACTION:
        if (this.role === 'host' && this.onP2ActionReceived) {
          this.onP2ActionReceived(msg.action);
        }
        break;

      case PACKET_TYPES.HOST_STATE:
        if (this.role === 'client' && this.onStateReceived) {
          this.onStateReceived(msg.state);
        }
        break;

      case PACKET_TYPES.RESTART_GAME:
        if (this.role === 'client') {
          eventBus.emit('restartGame', msg);
        }
        break;

      case PACKET_TYPES.REQUEST_RESTART:
        if (this.role === 'host') {
          eventBus.emit('restartRequested', msg);
        }
        break;
    }
  }

  send(type, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type, roomId: this.roomId, ...payload }));
  }

  broadcastHostState(state) {
    if (this.role !== 'host') return;
    this.send(PACKET_TYPES.HOST_STATE, { state });
  }

  sendClientInput(keys) {
    if (this.role !== 'client') return;
    this.send(PACKET_TYPES.P2_INPUT, { keys });
  }

  sendClientState(state) {
    if (this.role !== 'client') return;
    this.send(PACKET_TYPES.P2_STATE, { state });
  }

  sendClientAction(action) {
    if (this.role !== 'client') return;
    this.send(PACKET_TYPES.P2_ACTION, { action });
  }

  sendRestartGame(options = {}) {
    if (this.role !== 'host') return;
    this.send(PACKET_TYPES.RESTART_GAME, options);
  }

  requestRestart() {
    if (this.role !== 'client') return;
    this.send(PACKET_TYPES.REQUEST_RESTART, {});
  }
}

