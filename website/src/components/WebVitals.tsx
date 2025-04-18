'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
};

function sendMetric(metric: WebVitalsMetric) {
  // Check if we're in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Web Vitals]', metric);
    return;
  }

  // Send to analytics or monitoring service
  // This could be sent to Google Analytics, Plausible, or custom endpoint
  const body = JSON.stringify(metric);
  
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', {
      body,
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Only measure web vitals in production
    if (process.env.NODE_ENV === 'production') {
      // Core Web Vitals
      onCLS((metric) => sendMetric(metric));
      onFID((metric) => sendMetric(metric));
      onLCP((metric) => sendMetric(metric));
      
      // Additional metrics
      onFCP((metric) => sendMetric(metric));
      onTTFB((metric) => sendMetric(metric));
    }
  }, []);

  return null; // This component doesn't render anything
}