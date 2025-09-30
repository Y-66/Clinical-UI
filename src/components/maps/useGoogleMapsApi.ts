// src/hooks/useGoogleMapsApi.ts
import { useEffect, useState } from "react";
import { GOOGLE_API_KEY } from "../../constants";

declare global {
  interface Window {
    google: any;
  }
}

export function useGoogleMapsApi(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mapsScript: HTMLScriptElement | null = null;
    let extScript: HTMLScriptElement | null = null;

    const load = async () => {
      if (window.google && window.google.maps) {
        setLoaded(true);
        return;
      }

      // 1. Google Maps API
      mapsScript = document.createElement("script");
      mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=weekly&libraries=places`;
      mapsScript.async = true;
      mapsScript.defer = true;
      document.head.appendChild(mapsScript);

      // 2. Extended Components
      extScript = document.createElement("script");
      extScript.src = "https://unpkg.com/@googlemaps/extended-component-library";
      extScript.async = true;
      document.head.appendChild(extScript);

      // 等待两个 script 加载完
      let loadedCount = 0;
      const checkLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) setLoaded(true);
      };
      mapsScript.onload = checkLoaded;
      extScript.onload = checkLoaded;
    };

    load();

    return () => {
      mapsScript?.remove();
      extScript?.remove();
    };
  }, [apiKey]);

  return loaded;
}
