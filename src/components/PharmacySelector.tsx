import React, { useState, useEffect, useRef } from "react";
import { Empty, Spin, message, Tag } from "antd";
import {
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  StarOutlined,
  HeartFilled,
} from "@ant-design/icons";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  getNearestPharmacies,
  getPharmacyPreferences,
  setPrescriptionPharmacy,
} from "../apis/patient";
import {
  useCurrentDiagnosisInfoStore,
  useSelectedPharmacyStore,
  useGeneratedOrdersStore,
} from "../store";
import type { Pharmacy, PharmacyPreference } from "../types/Pharmacy";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../constants";

const PharmacySelector: React.FC = () => {
  const [nearestPharmacies, setNearestPharmacies] = useState<Pharmacy[]>([]);
  const [pharmacyPreferences, setPharmacyPreferences] = useState<
    PharmacyPreference[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [pharmacyMapCenter, setPharmacyMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { updateSelectedPharmacy, selectedPharmacy: storedPharmacy } =
    useSelectedPharmacyStore();
  const { prescriptionId } = useGeneratedOrdersStore();

  const isSelectingPharmacy = useRef(false);

  const fetchPharmacyData = async () => {
    if (!diagnosisInfo || diagnosisInfo.length === 0) {
      message.warning("Please search for a patient first");
      return;
    }

    const patientId = diagnosisInfo[0].patient_id;
    setLoading(true);

    try {
      const [nearest, preferences] = await Promise.all([
        getNearestPharmacies(patientId),
        getPharmacyPreferences(patientId),
      ]);

      setNearestPharmacies(Array.isArray(nearest) ? nearest : []);
      setPharmacyPreferences(Array.isArray(preferences) ? preferences : []);
    } catch (error) {
      message.error("Failed to load pharmacy data");
      console.error("Error loading pharmacy data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync selected pharmacy from store when data is loaded
  useEffect(() => {
    if (storedPharmacy && nearestPharmacies.length > 0) {
      const foundInNearest = nearestPharmacies.find(
        (p) => p.pharmacy_id === storedPharmacy.pharmacy_id
      );
      const foundInPreferences = pharmacyPreferences.find(
        (p) => p.pharmacy_id === storedPharmacy.pharmacy_id
      );
      const found = foundInNearest || foundInPreferences;
      if (found) {
        setSelectedPharmacy(found);
        if (found.coordinates) {
          setPharmacyMapCenter(found.coordinates);
        }
      }
    }
  }, [storedPharmacy, nearestPharmacies, pharmacyPreferences]);

  useEffect(() => {
    if (diagnosisInfo && diagnosisInfo.length > 0) {
      fetchPharmacyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisInfo]);

  // Auto-select default pharmacy if none selected
  useEffect(() => {
    const autoSelectPharmacy = async () => {
      if (!prescriptionId) return;
      if (storedPharmacy) return;
      if (isSelectingPharmacy.current) return;

      const candidate = pharmacyPreferences[0] || nearestPharmacies[0] || null;
      if (!candidate) return;

      isSelectingPharmacy.current = true;

      try {
        await setPrescriptionPharmacy(prescriptionId, candidate.pharmacy_id);
        updateSelectedPharmacy({
          pharmacy_id: candidate.pharmacy_id,
          name: candidate.name,
          address: candidate.address,
        });
        setSelectedPharmacy(candidate);
        if (candidate.coordinates) {
          setPharmacyMapCenter(candidate.coordinates);
        }
        message.success(
          `Automatically selected preferred pharmacy: ${candidate.name}`
        );
      } catch (error) {
        console.error("Auto-select pharmacy failed", error);
      } finally {
        isSelectingPharmacy.current = false;
      }
    };

    autoSelectPharmacy();
  }, [
    pharmacyPreferences,
    nearestPharmacies,
    storedPharmacy,
    prescriptionId,
    updateSelectedPharmacy,
  ]);

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    if (pharmacy.coordinates) {
      setPharmacyMapCenter(pharmacy.coordinates);
    }
    updateSelectedPharmacy({
      pharmacy_id: pharmacy.pharmacy_id,
      name: pharmacy.name,
      address: pharmacy.address,
    });
    message.success(`Selected: ${pharmacy.name}`);
  };

  const formatDistance = (distanceKm?: number) => {
    if (!distanceKm) return "--";
    return distanceKm < 1
      ? `${(distanceKm * 1000).toFixed(0)} m`
      : `${distanceKm.toFixed(1)} km`;
  };

  const renderPharmacyList = (
    pharmacies: Pharmacy[],
    title: string,
    icon: React.ReactNode,
    isPreference: boolean = false
  ) => (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 m-0">{title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Empty
              description={
                <span className="text-slate-400">
                  No {isPreference ? "preferred" : "nearby"} pharmacies found
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          pharmacies.map((pharmacy, index) => {
            const isSelected =
              selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id;
            return (
              <div
                key={`${pharmacy.pharmacy_id}-${index}`}
                className={`rounded-2xl p-4 border transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 shadow-md scale-[1.02]"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md hover:scale-[1.01]"
                }`}
                onClick={() => handleSelectPharmacy(pharmacy)}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-bold text-base truncate ${
                          isSelected ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {pharmacy.name}
                      </span>
                      {isPreference && (
                        <HeartFilled className="text-red-500 text-sm animate-pulse flex-shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <EnvironmentOutlined className="mt-1 text-blue-400 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs">
                          {pharmacy.address}
                        </span>
                      </div>
                      {pharmacy.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <PhoneOutlined className="text-green-500 flex-shrink-0" />
                          <span className="text-xs">{pharmacy.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {pharmacy.notes && isPreference && (
                      <div className="mt-2 text-xs text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-600">Note: </span>
                        {pharmacy.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {pharmacy.distance_km !== undefined && (
                      <Tag
                        color="blue"
                        className="m-0 font-bold border-0 bg-blue-100 text-blue-700 rounded-full px-2 text-xs"
                      >
                        {formatDistance(pharmacy.distance_km)}
                      </Tag>
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-400"
                      }`}
                    >
                      <StarOutlined className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* Selected Pharmacy Display - Sticky */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-gray-200 shadow-md">
        <div
          className={`rounded-lg p-4 transition-all duration-300 ${
            storedPharmacy
              ? "bg-white border-2 border-blue-400 shadow-md"
              : "bg-gray-50 border-2 border-dashed border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShopOutlined
              className={`text-lg ${
                storedPharmacy ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <span className="font-semibold text-sm text-gray-700">
              Selected Pharmacy
            </span>
          </div>
          {storedPharmacy ? (
            <div className="space-y-1">
              <p
                className="font-bold text-blue-900 text-sm truncate"
                title={storedPharmacy.name}
              >
                {storedPharmacy.name}
              </p>
              <p
                className="text-xs text-gray-600 line-clamp-2"
                title={storedPharmacy.address}
              >
                📍 {storedPharmacy.address}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No pharmacy selected yet
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {renderPharmacyList(
            nearestPharmacies,
            "Nearby Pharmacies",
            <EnvironmentOutlined className="text-blue-600 text-lg" />,
            false
          )}
          {renderPharmacyList(
            pharmacyPreferences,
            "Preferred Pharmacies",
            <HeartFilled className="text-red-500 text-lg" />,
            true
          )}
        </div>

        {/* Google Map for Pharmacies */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <EnvironmentOutlined className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 m-0">Pharmacy Map</h3>
          </div>
          <div className="h-[500px] w-full relative">
            <APIProvider apiKey={GOOGLE_API_KEY}>
              <Map
                key={
                  selectedPharmacy
                    ? `pharmacy-${selectedPharmacy.pharmacy_id}`
                    : "pharmacy-default"
                }
                defaultCenter={
                  pharmacyMapCenter || {
                    lat: INITIAL_LATITUDE,
                    lng: INITIAL_LONGITUDE,
                  }
                }
                defaultZoom={pharmacyMapCenter ? 16 : 13}
                mapId="pharmacy-map"
                gestureHandling="greedy"
              >
                {/* Nearest Pharmacies - Blue Markers */}
                {nearestPharmacies.map((pharmacy, index) =>
                  pharmacy.coordinates ? (
                    <AdvancedMarker
                      key={`nearest-pharmacy-${pharmacy.pharmacy_id}-${index}`}
                      position={pharmacy.coordinates}
                      title={pharmacy.name}
                      onClick={() => handleSelectPharmacy(pharmacy)}
                    >
                      <Pin
                        background={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? "#facc15"
                            : "#1e40af"
                        }
                        borderColor={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? "#eab308"
                            : "#1e3a8a"
                        }
                        glyphColor="#ffffff"
                        scale={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? 1.3
                            : 1
                        }
                      />
                    </AdvancedMarker>
                  ) : null
                )}
                {/* Preferred Pharmacies - Red Markers */}
                {pharmacyPreferences.map((pharmacy, index) =>
                  pharmacy.coordinates ? (
                    <AdvancedMarker
                      key={`preferred-pharmacy-${pharmacy.pharmacy_id}-${index}`}
                      position={pharmacy.coordinates}
                      title={pharmacy.name}
                      onClick={() => handleSelectPharmacy(pharmacy)}
                    >
                      <Pin
                        background={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? "#facc15"
                            : "#dc2626"
                        }
                        borderColor={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? "#eab308"
                            : "#991b1b"
                        }
                        glyphColor="#ffffff"
                        scale={
                          selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id
                            ? 1.3
                            : 1
                        }
                      />
                    </AdvancedMarker>
                  ) : null
                )}
                {/* InfoWindow for selected pharmacy */}
                {selectedPharmacy && selectedPharmacy.coordinates && (
                  <InfoWindow
                    position={selectedPharmacy.coordinates}
                    onCloseClick={() => setSelectedPharmacy(null)}
                  >
                    <div style={{ padding: "8px", maxWidth: "250px" }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedPharmacy.name}
                      </h3>
                      <p style={{ margin: "4px 0", fontSize: "12px" }}>
                        📍 {selectedPharmacy.address}
                      </p>
                      {selectedPharmacy.phone_number && (
                        <p style={{ margin: "4px 0", fontSize: "12px" }}>
                          📞 {selectedPharmacy.phone_number}
                        </p>
                      )}
                      {selectedPharmacy.distance_km !== undefined && (
                        <p
                          style={{
                            margin: "4px 0",
                            fontSize: "12px",
                            color: "#1e40af",
                            fontWeight: "bold",
                          }}
                        >
                          Distance:{" "}
                          {selectedPharmacy.distance_km < 1
                            ? `${(selectedPharmacy.distance_km * 1000).toFixed(0)} m`
                            : `${selectedPharmacy.distance_km.toFixed(1)} km`}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacySelector;
