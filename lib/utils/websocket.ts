import { VulnerabilityDetail } from './chat';

type MessageHandler = (message: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url = 'ws://127.0.0.1:8000/ws/secure/';
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private isConnected = false;
  private token: string | null = null;

  connect(token: string): Promise<void> {
    if (this.isConnected && this.token === token) {
      return Promise.resolve();
    }

    this.token = token;
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?token=${token}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.sendPing();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const handler = this.messageHandlers.get(data.type);
            if (handler) {
              handler(data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  onMessage(type: string, handler: MessageHandler): void {
    this.messageHandlers.set(type, handler);
  }

  sendChatMessage(message: string, selectedVulnerabilities: VulnerabilityDetail[], context?: any, previousMessages?: any[]): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'chat_message',
        message,
        selectedVulnerabilities,
        context,
        previousMessages,
        timestamp: Date.now()
      }));
    }
  }

  sendPing(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.token = null;
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();