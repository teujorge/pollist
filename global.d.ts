// global.d.ts
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        iosListener?: {
          postMessage?: (msg: string) => void;
        };
      };
    };
  }
}

export {};
