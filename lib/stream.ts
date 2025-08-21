import type { Event } from './types';
import { SAMPLE_EVENTS } from './events-static';

// Toggle between static simulation and WebSocket
export const USE_STATIC = true;

// WebSocket connection stub
export function connectSocket(onEvent: (e: Event) => void): () => void {
  if (USE_STATIC) {
    // Return cleanup function for static mode
    return () => {};
  }

  // WebSocket implementation (commented out for now)
  /*
  const ws = new WebSocket('ws://localhost:8080/threats');
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'threat') {
        onEvent(data.event);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
  
  // Return cleanup function
  return () => {
    ws.close();
  };
  */
  
  // For now, return empty cleanup function
  return () => {};
}

// Static event simulation
export function simulateLoop(
  events: Event[], 
  onEvent: (e: Event) => void,
  intervalMs: number = 2000
): () => void {
  if (!USE_STATIC) {
    return () => {};
  }

  let currentIndex = 0;
  let intervalId: NodeJS.Timeout | null = null;
  
  const emitNextEvent = () => {
    if (events.length === 0) return;
    
    const event = events[currentIndex];
    onEvent({
      ...event,
      ts: Date.now() // Update timestamp to current time
    });
    
    currentIndex = (currentIndex + 1) % events.length;
  };
  
  // Start the loop
  intervalId = setInterval(emitNextEvent, intervalMs);
  
  // Emit first event immediately
  emitNextEvent();
  
  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

// Alternative: Server-Sent Events example
export function connectSSE(onEvent: (e: Event) => void): () => void {
  if (USE_STATIC) {
    return () => {};
  }

  /*
  const eventSource = new EventSource('/api/threats/stream');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
  };
  
  return () => {
    eventSource.close();
  };
  */
  
  return () => {};
}
