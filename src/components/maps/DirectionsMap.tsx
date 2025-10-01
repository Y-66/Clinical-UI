import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useRef } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface DirectionsMapProps {
  start: LatLng;
  end: LatLng;
  zoom?: number;
}

const DirectionsMap: React.FC<DirectionsMapProps> = ({ start, end }) => {
  const map = useMap();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    if (!map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsServiceRef.current = directionsService;
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // 禁用默认的起点和终点标记
      polylineOptions: {
        strokeColor: getRandomColor(), // 随机颜色
        strokeWeight: 5,
      },
      panel: panelRef.current, // 指定文字路线容器
    });
  }, [map]);

  useEffect(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    // 构建路线请求
    const request: google.maps.DirectionsRequest = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING,
    };

    // 计算路线并渲染
    directionsServiceRef.current.route(request, (result, status) => {
      if (status === "OK" && result) {
        console.log("完整路线结果:", result); // 打印整个 DirectionsResult 对象
        directionsRendererRef.current!.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
      }
    });
  }, [start, end]);

  return (
    <>
      <div
        ref={panelRef}
        style={{ width: "30%", height: "500px", overflowY: "auto" }}
      />
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
    </>
  );
};

export default DirectionsMap;
