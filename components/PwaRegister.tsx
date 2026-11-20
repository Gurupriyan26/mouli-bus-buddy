"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Bus Buddy PWA ServiceWorker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("Bus Buddy PWA ServiceWorker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
