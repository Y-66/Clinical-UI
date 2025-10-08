import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { PoiMarkers } from "./PoiMarkers";
import { useEffect, useState } from "react";
import type { Poi } from "../../types/Poi";
import { usePoisListStore } from "../../store";
import type { Center } from "../../types/Center";
import { SEARCH_RADIUS } from "../../constants";

export const NearbyPharmacies = ({ center }: { center: Center }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [pois, setPois] = useState<Poi[]>([]);

  useEffect(() => {
    if (!map || !placesLib) return;

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: SEARCH_RADIUS,
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

  const { updataPoisList } = usePoisListStore();
  useEffect(() => {
    updataPoisList(pois);
    console.log("zustand测试", usePoisListStore.getState().poisList);
  }, [pois]);

  return <PoiMarkers pois={pois} />;
};
