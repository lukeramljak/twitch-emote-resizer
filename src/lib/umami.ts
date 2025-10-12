import { browser } from '$app/environment';

export const umami = {
  track: (eventName: string, eventData?: Record<string, string | number | boolean>) => {
    if (browser && window.umami) {
      window.umami.track(eventName, eventData);
    }
  }
};

declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, string | number | boolean>
      ) => Promise<void>;
    };
  }
}
