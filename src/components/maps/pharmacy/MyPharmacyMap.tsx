import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../../../constants";
import { useEffect, useRef, useState } from "react";
import type { Poi } from "../../../types/Poi";
import { Card, Box, TextField, InputAdornment } from "@mui/material";
import { Badge, Tag } from "antd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import {
  usePoisListStore,
  useSelectedPharmacyPoiStore,
  usePharmacyCenterStore,
} from "../../../store";
import { NearbyPharmacies } from "./NearbyPharmacies";
import type { Center } from "../../../types/Center";

const initialCenter: Center = { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE };

// Search box component inside the map
const MapSearchBox = ({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}) => {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!places || !inputRef.current || !isExpanded) return;

    const autocompleteInstance = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();
      onPlaceSelect(place);
      setIsExpanded(false); // 选择地址后收起
    });

    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [places, onPlaceSelect, isExpanded]);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {isExpanded && (
        <TextField
          inputRef={inputRef}
          placeholder="Search for an address..."
          size="small"
          autoFocus
          sx={{
            width: "300px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#06b6d4" }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        title={isExpanded ? "Close search" : "Search address"}
      >
        <SearchIcon sx={{ color: "#06b6d4", fontSize: 20 }} />
      </button>
    </div>
  );
};

// Map controller component to handle map instance
const MapController = ({
  onMapReady,
}: {
  onMapReady: (map: google.maps.Map) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export const MyPharmacyMap = () => {
  const [center, setCenter] = useState<Center>(initialCenter);
  const [key, setKey] = useState(0);
  const mapRef = useRef<google.maps.Map | null>(null);
  // const [pharmacyCount, setPharmacyCount] = useState(0);
  const { poisList } = usePoisListStore();
  const { selectedPharmacyPoi, updateSelectedPharmacyPoi, distancePharmacy } =
    useSelectedPharmacyPoiStore();
  const { updatePharmacyCenter } = usePharmacyCenterStore();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 初始化时设置默认中心点
  useEffect(() => {
    updatePharmacyCenter(initialCenter);
  }, [updatePharmacyCenter]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenter(newCenter);
      updatePharmacyCenter(newCenter); // 更新全局中心点
      // Pan to the new location
      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(15);
      }
      // Force re-render of NearbyPharmacies by changing key
      setKey((prev) => prev + 1);
    }
  };

  const handleCenterToMyLocation = () => {
    setCenter(initialCenter);
    updatePharmacyCenter(initialCenter); // 更新全局中心点
    if (mapRef.current) {
      mapRef.current.panTo(initialCenter);
      mapRef.current.setZoom(15);
    }
    setKey((prev) => prev + 1);
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // 每当选中项变化时，滚动到对应的 div
  useEffect(() => {
    if (selectedPharmacyPoi?.key && itemRefs.current[selectedPharmacyPoi.key]) {
      itemRefs.current[selectedPharmacyPoi.key]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedPharmacyPoi]);

  const handlePoisListClick = (poi: Poi) => {
    updateSelectedPharmacyPoi(poi);
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
              defaultCenter={initialCenter}
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
              <MapController onMapReady={handleMapReady} />
              <AdvancedMarker position={center}>
                <Pin
                  background="#DB4437"
                  borderColor="#000"
                  glyphColor="#fff"
                  scale={1.5}
                />
              </AdvancedMarker>
              <NearbyPharmacies key={key} center={center} />
              <MapSearchBox onPlaceSelect={handlePlaceSelect} />
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
              minWidth: "170px",
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
            onClick={handleCenterToMyLocation}
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
                    selectedPharmacyPoi?.key === poi.key
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
                    {selectedPharmacyPoi?.key === poi.key && (
                      <Tag color="green" className="text-xs">
                        {distancePharmacy}
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
        <div className="col-span-3 grid grid-cols-3 gap-4 mt-4">
          <Card
            elevation={2}
            sx={{
              padding: "16px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
              border: "1px solid #14b8a6",
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center mb-2">
                <span className="text-white text-lg">🎯</span>
              </div>
              <p className="text-sm text-gray-600 font-medium m-0">
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
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mb-2">
                <LocalPharmacyIcon sx={{ color: "white", fontSize: 20 }} />
              </div>
              <p className="text-sm text-gray-600 font-medium m-0">
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
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
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
