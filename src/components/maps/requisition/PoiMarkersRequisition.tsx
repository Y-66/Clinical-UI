import { type Marker } from "@googlemaps/markerclusterer";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { Circle } from "../Circle";
import type { Poi } from "../../../types/Poi";
import PlaceDetailsCompact from "../PlaceDetailsCompact";
import { useGoogleMapsApi } from "../useGoogleMapsApi";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../../../constants";
import DirectionsMapRequisition from "./DirectionsMapRequisition";
import {
  useSelectedRequisitionPoiStore,
  useRequisitionCenterStore,
} from "../../../store";

export const PoiMarkersRequisition = (props: { pois: Poi[] }) => {
  const loaded = useGoogleMapsApi(GOOGLE_API_KEY);

  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  // const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  // Disabled to prevent red cluster markers
  // useEffect(() => {
  //   if (!map) return;
  //   if (!clusterer.current) {
  //     clusterer.current = new MarkerClusterer({ map });
  //   }
  // }, [map]);

  // Update markers, if the markers array has changed
  // Disabled to prevent red cluster markers
  // useEffect(() => {
  //   clusterer.current?.clearMarkers();
  //   clusterer.current?.addMarkers(Object.values(markers));
  // }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked:", ev.latLng.toString());
      map.panTo(ev.latLng);
      // setCircleCenter(ev.latLng);
    },
    [map]
  );

  // const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(
  //   null
  // );

  // const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  const { selectedRequisitionPoi, updateSelectedRequisitionPoi } =
    useSelectedRequisitionPoiStore();
  const { requisitionCenter } = useRequisitionCenterStore();

  // 在组件挂载时自动选择第一个 POI
  useEffect(() => {
    if (!map || !loaded || props.pois.length === 0) return;

    const firstPoi = props.pois[0];
    console.log("Auto-selecting first POI:", firstPoi);
    if (firstPoi && !selectedRequisitionPoi) {
      updateSelectedRequisitionPoi(firstPoi);
      // 可选：将地图平移到第一个 POI
      map.panTo(firstPoi.location);
    }
  }, [map, loaded, props.pois]);

  const handleSelectedPoiClick = (poi: Poi) => {
    // setSelectedPoi(poi);
    updateSelectedRequisitionPoi(poi);
  };

  const handleClose = () => {
    // setSelectedPoi(null);
    updateSelectedRequisitionPoi(null);
  };

  if (!loaded) return <div>Loading Google Maps...</div>;

  return (
    <>
      {/* <Circle
        radius={800}
        center={circleCenter}
        strokeColor={"#0c4cb3"}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={"#3b82f6"}
        fillOpacity={0.3}
      /> */}
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev) => {
            handleClick(ev);
            handleSelectedPoiClick(poi);
          }}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
      {selectedRequisitionPoi && (
        <>
          <InfoWindow
            position={selectedRequisitionPoi.location}
            onCloseClick={handleClose}
          >
            {/* <MapInfo selectedPoi={selectedPoi} /> */}
            <div style={{ width: "400px" }}>
              <PlaceDetailsCompact placeId={selectedRequisitionPoi.key} />
            </div>
          </InfoWindow>
        </>
      )}
      {selectedRequisitionPoi?.location && requisitionCenter && (
        <>
          <DirectionsMapRequisition
            key={selectedRequisitionPoi.key}
            start={{ lat: requisitionCenter.lat, lng: requisitionCenter.lng }}
            end={{
              lat: selectedRequisitionPoi.location.lat,
              lng: selectedRequisitionPoi.location.lng,
            }}
            zoom={6}
          />
        </>
      )}
    </>
  );
};
