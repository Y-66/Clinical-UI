import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import type { Poi } from "../../../types/Poi";
import { usePoisListStore } from "../../../store";
import type { Center } from "../../../types/Center";
import { SEARCH_RADIUS } from "../../../constants";
import { calculateDistance } from "../../../utils/map";
import { PoiMarkersRequisition } from "./PoiMarkersRequisition";

export const NearbyRequisitions = ({ center }: { center: Center }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [pois, setPois] = useState<Poi[]>([]);

  useEffect(() => {
    if (!map || !placesLib) return;

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: SEARCH_RADIUS,
      type: "doctor",
      keyword: "medical check up OR health screening",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(results);
        setPois(
          results
            .map((place, i) => {
              const lat = place.geometry!.location!.lat();
              const lng = place.geometry!.location!.lng();

              const distance = calculateDistance(
                center.lat,
                center.lng,
                lat,
                lng
              );

              return {
                key: place.place_id ?? `pharmacy-${i}`,
                location: { lat, lng },
                business_status: place.business_status,
                name: place.name,
                vicinity: place.vicinity,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                icon: place.icon,
                plus_code: place.plus_code,
                types: place.types,
                distance, // 临时字段用于排序
              };
            })
            .sort((a, b) => a.distance - b.distance) // 按距离排序
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ distance, ...poi }) => poi) // 移除临时的 distance 字段
        );
      }
    });
  }, [map, placesLib]);

  const { updataPoisList } = usePoisListStore();
  useEffect(() => {
    updataPoisList(pois);
    console.log("zustand测试", usePoisListStore.getState().poisList);
  }, [pois]);

  return <PoiMarkersRequisition pois={pois} />;
};
