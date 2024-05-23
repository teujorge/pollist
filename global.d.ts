// global.d.ts
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        userListener?: {
          postMessage?: (msg: string) => void;
        };
      };
    };
  }
}

export {};
