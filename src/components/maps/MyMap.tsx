import {
  APIProvider,
  Map,
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
  return (
    <div className="w-full h-full">
      <APIProvider
        apiKey={GOOGLE_API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          className="w-full h-full"
          defaultZoom={13}
          defaultCenter={center}
          mapId="320e09b3a26d8c60123f0cd4"
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          }
        >
          <NearbyPharmacies />
        </Map>
      </APIProvider>
    </div>
  );
};

export default MyMap;
