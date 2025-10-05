import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { PoiMarkers } from "./PoiMarkers";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../../constants";
import { useEffect, useState } from "react";
import type { Poi } from "../../types/Poi";
import { Card, Chip, Box } from "@mui/material";
import { Badge } from "antd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const center = { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE };

const NearbyPharmacies = () => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [pois, setPois] = useState<Poi[]>([]);

  useEffect(() => {
    if (!map || !placesLib) return;

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 2000,
      type: "pharmacy",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(results);
        setPois(
          results.map((place, i) => ({
            key: place.place_id ?? `pharmacy-${i}`,
            location: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
            },
            business_status: place.business_status,
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            icon: place.icon,
            plus_code: place.plus_code,
            types: place.types,
          }))
        );
      }
    });
  }, [map, placesLib]);

  return <PoiMarkers pois={pois} />;
};

export const MyMap = () => {
  const [pharmacyCount, setPharmacyCount] = useState(0);

  return (
    <div className="w-full h-full space-y-4">
      {/* Info Header Card */}
      <Card
        elevation={3}
        sx={{
          background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
          borderRadius: "16px",
          padding: "16px 24px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LocationOnIcon sx={{ color: "white", fontSize: 28 }} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg m-0">
                Find Nearby Pharmacies
              </h3>
              <p className="text-white/90 text-sm m-0">
                Select your preferred location from the map
              </p>
            </div>
          </Box>
          <Badge
            count={`${pharmacyCount} Found`}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              padding: "4px 12px",
              height: "auto",
            }}
          />
        </Box>
      </Card>

      {/* Map Container with Legend */}
      <div className="relative">
        <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-2xl border-2 border-cyan-100 relative ">
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
              <NearbyPharmacies />
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
                {pharmacyCount} Stores
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

export default MyMap;
