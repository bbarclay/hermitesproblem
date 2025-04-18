'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

// Track page views
function trackPageView(url: string) {
  // Check if running in production environment to avoid tracking during development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] Page view: ${url}`);
    return;
  }

  try {
    if (typeof window !== 'undefined' && 'plausible' in window) {
      // @ts-ignore - Plausible is added via script tag
      window.plausible('pageview', { props: { url } });
    }
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
}

// Export function to track custom events
export function trackEvent(event: AnalyticsEvent) {
  // Check if running in production environment to avoid tracking during development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] Event: ${event.name}`, event.properties);
    return;
  }

  try {
    if (typeof window !== 'undefined' && 'plausible' in window) {
      // @ts-ignore - Plausible is added via script tag
      window.plausible(event.name, { props: event.properties });
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}