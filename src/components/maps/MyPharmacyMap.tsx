import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../../constants";
import { useEffect, useRef } from "react";
import type { Poi } from "../../types/Poi";
import { Card, Box } from "@mui/material";
import { Badge, Tag } from "antd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useCurrentPoiStore, usePoisListStore } from "../../store";
import { NearbyPharmacies } from "./NearbyPharmacies";
import type { Center } from "../../types/Center";

const center: Center = { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE };

export const MyPharmacyMap = () => {
  // const [pharmacyCount, setPharmacyCount] = useState(0);
  const { poisList } = usePoisListStore();
  const { currentPoi, updateSelectedPoi, distance } = useCurrentPoiStore();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // 每当选中项变化时，滚动到对应的 div
  useEffect(() => {
    if (currentPoi?.key && itemRefs.current[currentPoi.key]) {
      itemRefs.current[currentPoi.key]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPoi]);

  const handlePoisListClick = (poi: Poi) => {
    updateSelectedPoi(poi);
  };

  return (
    <div className="w-full h-full space-y-4">
      {/* Map Container with Legend */}
      <div className="grid grid-cols-3 gap-4 h-full items-stretch">
        <div className="col-span-2 h-[350px] rounded-xl overflow-hidden shadow-2xl border-2 border-cyan-100 relative ">
          <APIProvider
            apiKey={GOOGLE_API_KEY}
            onLoad={() => console.log("Maps API has loaded.")}
          >
            <Map
              className="w-full h-full"
              defaultZoom={15}
              defaultCenter={center}
              mapId="320e09b3a26d8c60fe158e5a"
              renderingType="VECTOR"
              tiltInteractionEnabled={true}
              headingInteractionEnabled={true}
              onCameraChanged={(ev: MapCameraChangedEvent) =>
                console.log(
                  "camera changed:",
                  ev.detail.center,
                  "zoom:",
                  ev.detail.zoom
                )
              }
            >
              <AdvancedMarker position={center}>
                <Pin
                  background="#DB4437"
                  borderColor="#000"
                  glyphColor="#fff"
                  scale={1.5}
                />
              </AdvancedMarker>
              <NearbyPharmacies center={center} />
            </Map>
          </APIProvider>

          {/* Floating Legend */}
          <Card
            elevation={4}
            sx={{
              position: "absolute",
              top: 4,
              left: 8,
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: "200px",
            }}
          >
            <Box display="flex" flexDirection="column" gap={1.5}>
              <div className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                <span className="text-cyan-600">📍</span>
                Map Legend
              </div>
              <Box display="flex" alignItems="center" gap={1.5}>
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-md"></div>
                <span className="text-xs text-gray-700 font-medium">
                  Your Location
                </span>
              </Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-md"></div>
                <span className="text-xs text-gray-700 font-medium">
                  Nearby Pharmacies
                </span>
              </Box>
            </Box>
          </Card>

          {/* Floating Action Button - Center Location */}
          <button
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center premium-button"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
              border: "none",
              cursor: "pointer",
            }}
            title="Center to your location"
          >
            <MyLocationIcon sx={{ color: "white", fontSize: 24 }} />
          </button>
        </div>
        {/* 右侧卡片区域 */}

        <Card className="h-[350px] flex flex-col col-span-1 bg-gray-50 border-l rounded-xl overflow-y-auto p-4">
          {/* 列表区 */}
          <div className="flex-1 overflow-y-auto space-y-1 ">
            {poisList.length > 0 ? (
              poisList.map((poi) => (
                <div
                  key={poi.key}
                  ref={(el) => void (itemRefs.current[poi.key] = el)}
                  onClick={() => handlePoisListClick(poi)}
                  className={`border rounded-xl p-2 transition-shadow
                  ${
                    currentPoi?.key === poi.key
                      ? "bg-blue-100 border-blue-500 shadow-md"
                      : "bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-0.5">{poi.name}</p>
                  <p className="text-sm text-gray-600 mb-0.5">{poi.vicinity}</p>
                  <div className="flex flex-row items-center gap-2">
                    {poi.rating && (
                      <p className="text-xs text-yellow-600">
                        ⭐ {poi.rating} ({poi.user_ratings_total} reviews)
                      </p>
                    )}
                    {currentPoi?.key === poi.key && (
                      <Tag color="green" className="text-xs">
                        {distance}
                      </Tag>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No nearby pharmacies found.
              </p>
            )}
          </div>

          {/* 底部说明 */}
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
              borderRadius: "16px",
              padding: "2px 2px",
              width: "230px",
            }}
          >
            <Box display="flex" alignItems="center" width={10}>
              <Box display="flex" alignItems="center" gap={2}>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <LocationOnIcon sx={{ color: "white", fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm m-0">
                    Find Nearby Pharmacies
                  </p>
                </div>
              </Box>
              <Badge
                count={`${poisList.length} Found`}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 400,
                  padding: "4px 2px",
                  height: "auto",
                  width: "60px",
                }}
              />
            </Box>
          </Card>
        </Card>

        {/* Info Cards Below Map */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card
            elevation={2}
            sx={{
              padding: "16px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
              border: "1px solid #14b8a6",
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center mb-2">
                <span className="text-white text-lg">🎯</span>
              </div>
              <p className="text-xs text-gray-600 font-medium m-0">
                Search Radius
              </p>
              <p className="text-lg font-bold text-cyan-700 m-0">2.0 km</p>
            </Box>
          </Card>

          <Card
            elevation={2}
            sx={{
              padding: "16px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
              border: "1px solid #14b8a6",
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mb-2">
                <LocalPharmacyIcon sx={{ color: "white", fontSize: 20 }} />
              </div>
              <p className="text-xs text-gray-600 font-medium m-0">
                Available Now
              </p>
              <p className="text-lg font-bold text-teal-700 m-0">
                {/* {pharmacyCount} Stores */}
              </p>
            </Box>
          </Card>

          <Card
            elevation={2}
            sx={{
              padding: "16px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
              border: "1px solid #14b8a6",
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <span className="text-white text-lg">⚡</span>
              </div>
              <p className="text-xs text-gray-600 font-medium m-0">
                Quick Service
              </p>
              <p className="text-lg font-bold text-green-700 m-0">
                &lt; 2 Hours
              </p>
            </Box>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPharmacyMap;
