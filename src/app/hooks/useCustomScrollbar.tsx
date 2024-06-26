import { useEffect } from "react";

export function useCustomScrollbar() {
  useEffect(() => {
    return;
    const isSafariMac = /Macintosh.*Safari/.test(navigator.userAgent);
    if (isSafariMac) return;

    const css = `
        ::-webkit-scrollbar {
          width: 9px;
        }
  
        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 10px 10px transparent;
          border-radius: 2rem;
        }
  
        ::-webkit-scrollbar-thumb {
          min-height: 1.5rem;
          border-radius: 1.5rem;
          box-shadow: inset 0 0 10px 10px #444;
          border: 3px solid transparent;
          transition: all 150ms ease;
        }
  
        ::-webkit-scrollbar-thumb:hover {
          box-shadow: inset 0 0 10px 10px #666;
          border: 2px solid transparent;
        }
  
        ::-webkit-scrollbar-button {
          display: none;
        }
      `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup the style element on unmount
      document.head.removeChild(styleSheet);
    };
  }, []);
}
