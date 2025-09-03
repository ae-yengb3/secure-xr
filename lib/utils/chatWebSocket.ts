import { wsManager } from './websocket';
import { VulnerabilityDetail } from './chat';

export class ChatWebSocketService {
  private onMessageCallback?: (message: string) => void;

  setupMessageHandler(onMessage: (message: string) => void): void {
    this.onMessageCallback = onMessage;
    
    // Set up chat message handler
    wsManager.onMessage('chat_response', (data) => {
      if (data.response && this.onMessageCallback) {
        this.onMessageCallback(data.response);
      }
    });
  }

  sendMessage(message: string, selectedVulnerabilities: VulnerabilityDetail[], context?: any): void {
    wsManager.sendChatMessage(message, selectedVulnerabilities, context);
  }

  clearMessageHandler(): void {
    this.onMessageCallback = undefined;
  }
}

export const chatWebSocketService = new ChatWebSocketService();