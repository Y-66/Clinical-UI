import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "../App.css";

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [address, setAddress] = useState("");
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyDw43mWhjBByW3DKHaCvGzcEDLaaYKio5o", // 这里换成你自己的 key
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const initMap = new Map(mapRef.current, {
        center: { lat: 45.4215, lng: -75.6972 },
        zoom: 11,
      });

      setMap(initMap);
    });
  }, []);

  // 点击搜索按钮
  const handleSearch = () => {
    if (!map || !address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;

        // 地图居中并放大
        map.setCenter(location);
        map.setZoom(15); // 缩小范围，更贴近

        // 清除之前的 markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // ⭐ 添加一个特殊标记，表示用户输入的位置
        const userMarker = new google.maps.Marker({
          map,
          position: location,
          title: "Search Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // 红色标记
            scaledSize: new google.maps.Size(40, 40), // 放大一点
          },
        });
        markersRef.current.push(userMarker);

        // PlacesService 查找药店
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(
          {
            location,
            radius: 2000, // 2km
            type: "pharmacy",
          },
          (results: any, status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              results.forEach((place: any) => {
                if (place.geometry?.location) {
                  const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: {
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 蓝色标记用于药店
                    },
                  });

                  // InfoWindow 显示店名和地址
                  const infowindow = new google.maps.InfoWindow({
                    content: `<strong>${place.name}</strong><br/>${
                      place.vicinity || ""
                    }`,
                  });

                  marker.addListener("click", () => {
                    infowindow.open(map, marker);
                  });

                  markersRef.current.push(marker);
                }
              });
            }
          }
        );
      } else {
        alert("地址解析失败，请换一个试试");
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 固定在顶部的搜索框 */}
      <div className="w-full bg-white p-2 flex gap-2 shadow">
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border flex-1 px-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* 地图自动填满剩余空间 */}
      <div ref={mapRef} className="flex-1 w-full" />
    </div>
  );
};

export default Map;
