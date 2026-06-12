import { browser } from '$app/environment';

export const umami = {
  track: (eventName: string, eventData?: Record<string, string | number | boolean>) => {
    if (browser && !window.__TAURI__ && window.umami) {
      window.umami.track(eventName, eventData);
    }
  }
};

declare global {
  interface Window {
    __TAURI__?: unknown;
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, string | number | boolean>
      ) => Promise<void>;
    };
  }
}
