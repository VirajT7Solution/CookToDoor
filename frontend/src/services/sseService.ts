import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import type {
  SSEEventType,
  SSEUnreadCountData,
  SSENotificationData,
  SSENotificationReadData,
  SSENotificationsAllReadData,
} from '../types/notification.types';

type SSEEventCallback = (eventType: SSEEventType, data: any) => void;

class SSEService {
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private callbacks: Set<SSEEventCallback> = new Set();
  private abortController: AbortController | null = null;
  private buffer = '';

  /**
   * Connect to SSE stream
   */
  connect(onEvent: SSEEventCallback): void {
    // Add callback
    this.callbacks.add(onEvent);

    // If already connecting or connected, don't create new connection
    if (this.isConnecting || this.reader) {
      return;
    }

    this.isConnecting = true;
    this.reconnectAttempts = 0;

    this.establishConnection();
  }

  /**
   * Establish SSE connection using fetch (supports custom headers)
   */
  private async establishConnection(): Promise<void> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      console.error('No token available for SSE connection');
      this.isConnecting = false;
      return;
    }

    // Close existing connection if any
    this.disconnect();

    try {
      this.abortController = new AbortController();
      const url = `${API_BASE_URL}/api/notifications/stream`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream',
        },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body reader available');
      }

      this.reader = reader;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.buffer = '';
      console.log('SSE connection established successfully');
      this.notifyCallbacks('connected', 'SSE connection established');

      // Process the stream
      this.processStream(reader, decoder);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Connection was intentionally aborted
        return;
      }
      console.error('Failed to establish SSE connection:', error);
      this.isConnecting = false;
      this.handleStreamError();
    }
  }

  /**
   * Process SSE stream
   */
  private async processStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ): Promise<void> {
    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('SSE stream ended');
          this.handleStreamError();
          break;
        }

        this.buffer += decoder.decode(value, { stream: true });
        const lines = this.buffer.split('\n');
        
        // Keep the last incomplete line in buffer
        this.buffer = lines.pop() || '';

        let currentEvent = '';
        let currentData = '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            currentData = line.substring(5).trim();
          } else if (line === '' && (currentEvent || currentData)) {
            // Empty line indicates end of event
            if (currentData) {
              this.handleSSEEvent(currentEvent || 'message', currentData);
            }
            currentEvent = '';
            currentData = '';
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Error reading SSE stream:', err);
      this.handleStreamError();
    }
  }

  /**
   * Handle SSE event
   */
  private handleSSEEvent(eventType: string, data: string): void {
    try {
      console.log('SSE Event received:', eventType, data);
      
      let parsedData: any = data;

      // Try to parse as JSON
      if (data && (data.startsWith('{') || data.startsWith('['))) {
        try {
          parsedData = JSON.parse(data);
          console.log('Parsed SSE data:', parsedData);
        } catch (parseError) {
          console.error('Failed to parse SSE data as JSON:', parseError);
          parsedData = data;
        }
      }

      // Map event types to our SSEEventType
      let mappedEventType: SSEEventType = 'connected';
      
      if (eventType === 'unread_count') {
        mappedEventType = 'unread_count';
      } else if (eventType === 'notification') {
        mappedEventType = 'notification';
        console.log('New notification received via SSE:', parsedData);
      } else if (eventType === 'notification_read') {
        mappedEventType = 'notification_read';
      } else if (eventType === 'notifications_all_read') {
        mappedEventType = 'notifications_all_read';
      } else if (eventType === 'heartbeat') {
        mappedEventType = 'heartbeat';
      } else if (eventType === 'connected' || eventType === 'message') {
        mappedEventType = 'connected';
      }

      this.notifyCallbacks(mappedEventType, parsedData);
    } catch (err) {
      console.error('Error handling SSE event:', err);
    }
  }

  /**
   * Handle stream errors
   */
  private handleStreamError(): void {
    if (this.reader) {
      this.reader.cancel().catch(() => {
        // Ignore cancel errors
      });
      this.reader = null;
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Attempt reconnection with exponential backoff
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;

      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting SSE reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.establishConnection();
      }, delay);
    } else {
      console.error('Max SSE reconnection attempts reached');
    }
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(eventType: SSEEventType, data: any): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(eventType, data);
      } catch (err) {
        console.error('Error in SSE callback:', err);
      }
    });
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.reader) {
      this.reader.cancel().catch(() => {
        // Ignore cancel errors
      });
      this.reader = null;
    }

    this.isConnecting = false;
    this.buffer = '';
    this.callbacks.clear();
  }

  /**
   * Remove a specific callback
   */
  removeCallback(callback: SSEEventCallback): void {
    this.callbacks.delete(callback);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.reader !== null;
  }
}

// Export singleton instance
export const sseService = new SSEService();
