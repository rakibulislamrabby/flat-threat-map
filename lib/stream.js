// Toggle between static simulation and WebSocket streaming
export const USE_STATIC = true;

// WebSocket connection stub for future implementation
export function connectSocket(onEvent) {
  console.log('WebSocket connection would be established here');
  console.log('onEvent callback:', onEvent);
  
  // Placeholder for WebSocket implementation
  // const ws = new WebSocket('ws://localhost:8080/threats');
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   onEvent(data);
  // };
  // return () => ws.close();
  
  return () => {
    console.log('WebSocket connection closed');
  };
}

// Static event simulation loop
export function simulateLoop(events, onEvent, intervalMs = 2000) {
  if (!events || events.length === 0) {
    console.warn('No events provided for simulation');
    return () => {};
  }

  let currentIndex = 0;
  
  const interval = setInterval(() => {
    const event = events[currentIndex];
    
    // Update timestamp to current time for realistic simulation
    const simulatedEvent = {
      ...event,
      ts: Date.now()
    };
    
    onEvent(simulatedEvent);
    
    currentIndex = (currentIndex + 1) % events.length;
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}
