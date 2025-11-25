import React, { useState, useEffect } from "react";
import { Tabs, Card, List, Empty, Spin, message, Tag, Button } from "antd";
import {
  ShopOutlined,
  ExperimentOutlined,
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
  getNearestLabs,
  getLabPreferences,
} from "../apis/patient";
import {
  useCurrentDiagnosisInfoStore,
  useSelectedPharmacyStore,
  useSelectedLabStore,
} from "../store";
import type {
  Pharmacy,
  PharmacyPreference,
  Lab,
  LabPreference,
} from "../types/Pharmacy";
import {
  GOOGLE_API_KEY,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
} from "../constants";

const LocationSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("pharmacy");
  const [nearestPharmacies, setNearestPharmacies] = useState<Pharmacy[]>([]);
  const [pharmacyPreferences, setPharmacyPreferences] = useState<
    PharmacyPreference[]
  >([]);
  const [nearestLabs, setNearestLabs] = useState<Lab[]>([]);
  const [labPreferences, setLabPreferences] = useState<LabPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [pharmacyMapCenter, setPharmacyMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [labMapCenter, setLabMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { updateSelectedPharmacy, selectedPharmacy: storedPharmacy } =
    useSelectedPharmacyStore();
  const { updateSelectedLab, selectedLab: storedLab } = useSelectedLabStore();

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

  const fetchLabData = async () => {
    if (!diagnosisInfo || diagnosisInfo.length === 0) {
      message.warning("Please search for a patient first");
      return;
    }

    const patientId = diagnosisInfo[0].patient_id;
    setLoading(true);

    try {
      const [nearest, preferences] = await Promise.all([
        getNearestLabs(patientId),
        getLabPreferences(patientId),
      ]);

      setNearestLabs(Array.isArray(nearest) ? nearest : []);
      setLabPreferences(Array.isArray(preferences) ? preferences : []);
    } catch (error) {
      message.error("Failed to load lab data");
      console.error("Error loading lab data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync selected pharmacy/lab from store when data is loaded
  useEffect(() => {
    if (storedPharmacy && nearestPharmacies.length > 0) {
      // Find the full pharmacy object from nearestPharmacies or pharmacyPreferences
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
    if (storedLab && nearestLabs.length > 0) {
      // Find the full lab object from nearestLabs or labPreferences
      const foundInNearest = nearestLabs.find(
        (l) => l.lab_id === storedLab.lab_id
      );
      const foundInPreferences = labPreferences.find(
        (l) => l.lab_id === storedLab.lab_id
      );
      const found = foundInNearest || foundInPreferences;
      if (found) {
        setSelectedLab(found);
        if (found.coordinates) {
          setLabMapCenter(found.coordinates);
        }
      }
    }
  }, [storedLab, nearestLabs, labPreferences]);

  useEffect(() => {
    if (diagnosisInfo && diagnosisInfo.length > 0) {
      if (activeTab === "pharmacy") {
        fetchPharmacyData();
      } else if (activeTab === "lab") {
        fetchLabData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, diagnosisInfo]);

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    if (pharmacy.coordinates) {
      setPharmacyMapCenter(pharmacy.coordinates);
    }
    // Save to store for step4
    updateSelectedPharmacy({
      pharmacy_id: pharmacy.pharmacy_id,
      name: pharmacy.name,
      address: pharmacy.address,
    });
    message.success(`Selected: ${pharmacy.name}`);
  };

  const handleSelectLab = (lab: Lab) => {
    setSelectedLab(lab);
    if (lab.coordinates) {
      setLabMapCenter(lab.coordinates);
    }
    // Save to store for step4
    updateSelectedLab({
      lab_id: lab.lab_id,
      name: lab.name,
      address: lab.address,
    });
    message.success(`Selected: ${lab.name}`);
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
    <Card
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
      }
      className="shadow-md h-full"
      bodyStyle={{ padding: "12px" }}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : pharmacies.length === 0 ? (
        <Empty
          description={`No ${
            isPreference ? "preferred" : "nearby"
          } pharmacies found`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={pharmacies}
          renderItem={(pharmacy, index) => {
            const isSelected =
              selectedPharmacy?.pharmacy_id === pharmacy.pharmacy_id;
            return (
              <List.Item
                key={`${pharmacy.pharmacy_id}-${index}`}
                className={`rounded-lg transition-all duration-200 px-4 py-3 border ${
                  isSelected
                    ? "bg-yellow-50 border-yellow-400 shadow-lg"
                    : "hover:bg-blue-50 border-transparent hover:border-blue-200"
                }`}
                style={{ marginBottom: "12px" }}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-900 break-words">
                          {pharmacy.name}
                        </span>
                        {isPreference && (
                          <HeartFilled className="text-red-500 text-base animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <EnvironmentOutlined className="mt-0.5 text-blue-600 text-base flex-shrink-0" />
                          <span className="leading-relaxed break-words">
                            {pharmacy.address}
                          </span>
                        </div>
                        {pharmacy.phone_number && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <PhoneOutlined className="text-green-600 text-base flex-shrink-0" />
                            <span className="font-medium">
                              {pharmacy.phone_number}
                            </span>
                          </div>
                        )}
                        {pharmacy.email && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-gray-400 flex-shrink-0">
                              📧
                            </span>
                            <span
                              className="text-blue-600 underline break-all"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {pharmacy.email}
                            </span>
                          </div>
                        )}
                      </div>
                      {pharmacy.notes && isPreference && (
                        <div className="mt-3 text-xs text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                          <span className="font-bold text-blue-800">
                            💡 Note:{" "}
                          </span>
                          <span className="italic">{pharmacy.notes}</span>
                        </div>
                      )}
                    </div>
                    {pharmacy.distance_km !== undefined && (
                      <div className="flex flex-col items-end gap-1">
                        <Tag
                          color="blue"
                          className="font-bold text-base px-3 py-1"
                          style={{ margin: 0 }}
                        >
                          {formatDistance(pharmacy.distance_km)}
                        </Tag>
                        <span className="text-xs text-gray-500">away</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button
                      type={isSelected ? "default" : "primary"}
                      size="small"
                      icon={<StarOutlined />}
                      className={
                        isSelected
                          ? "bg-yellow-400 border-yellow-500 text-gray-900 font-bold shadow-md"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-sm hover:shadow-md"
                      }
                      onClick={() => handleSelectPharmacy(pharmacy)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );

  const renderLabList = (
    labs: Lab[],
    title: string,
    icon: React.ReactNode,
    isPreference: boolean = false
  ) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
      }
      className="shadow-md h-full"
      bodyStyle={{ padding: "12px" }}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : labs.length === 0 ? (
        <Empty
          description={`No ${isPreference ? "preferred" : "nearby"} labs found`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={labs}
          renderItem={(lab, index) => {
            const isSelected = selectedLab?.lab_id === lab.lab_id;
            return (
              <List.Item
                key={`${lab.lab_id}-${index}`}
                className={`rounded-lg transition-all duration-200 px-4 py-3 border ${
                  isSelected
                    ? "bg-yellow-50 border-yellow-400 shadow-lg"
                    : "hover:bg-green-50 border-transparent hover:border-green-200"
                }`}
                style={{ marginBottom: "12px" }}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-900 break-words">
                          {lab.name}
                        </span>
                        {isPreference && (
                          <HeartFilled className="text-red-500 text-base animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <EnvironmentOutlined className="mt-0.5 text-green-600 text-base flex-shrink-0" />
                          <span className="leading-relaxed break-words">
                            {lab.address}
                          </span>
                        </div>
                        {lab.phone_number && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <PhoneOutlined className="text-green-600 text-base flex-shrink-0" />
                            <span className="font-medium">
                              {lab.phone_number}
                            </span>
                          </div>
                        )}
                        {lab.email && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-gray-400 flex-shrink-0">
                              📧
                            </span>
                            <span
                              className="text-green-600 underline break-all"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {lab.email}
                            </span>
                          </div>
                        )}
                      </div>
                      {lab.notes && isPreference && (
                        <div className="mt-3 text-xs text-gray-700 bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border border-green-200 shadow-sm">
                          <span className="font-bold text-green-800">
                            💡 Note:{" "}
                          </span>
                          <span className="italic">{lab.notes}</span>
                        </div>
                      )}
                    </div>
                    {lab.distance_km !== undefined && (
                      <div className="flex flex-col items-end gap-1">
                        <Tag
                          color="green"
                          className="font-bold text-base px-3 py-1"
                          style={{ margin: 0 }}
                        >
                          {formatDistance(lab.distance_km)}
                        </Tag>
                        <span className="text-xs text-gray-500">away</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button
                      type={isSelected ? "default" : "primary"}
                      size="small"
                      icon={<StarOutlined />}
                      className={
                        isSelected
                          ? "bg-yellow-400 border-yellow-500 text-gray-900 font-bold shadow-md"
                          : "bg-gradient-to-r from-green-500 to-green-600 border-none shadow-sm hover:shadow-md"
                      }
                      onClick={() => handleSelectLab(lab)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );

  const pharmacyContent = (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPharmacyList(
          nearestPharmacies,
          "Nearest Pharmacies",
          <EnvironmentOutlined className="text-blue-600 text-lg" />,
          false
        )}
        {renderPharmacyList(
          pharmacyPreferences,
          "My Preferred Pharmacies",
          <HeartFilled className="text-red-500 text-lg" />,
          true
        )}
      </div>
      {/* Google Map for Pharmacies */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600 text-lg" />
            <span className="font-semibold">Pharmacy Locations</span>
          </div>
        }
        className="shadow-md"
      >
        <div style={{ height: "500px", width: "100%" }}>
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
                          ? `${(selectedPharmacy.distance_km * 1000).toFixed(
                              0
                            )} m`
                          : `${selectedPharmacy.distance_km.toFixed(1)} km`}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      </Card>
    </div>
  );

  const labContent = (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        {renderLabList(
          nearestLabs,
          "Nearest Labs",
          <EnvironmentOutlined className="text-green-600" />
        )}
        {renderLabList(
          labPreferences,
          "My Preferred Labs",
          <HeartFilled className="text-red-500" />,
          true
        )}
      </div>
      {/* Google Map for Labs */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-green-600 text-lg" />
            <span className="font-semibold">Lab Locations</span>
          </div>
        }
        className="shadow-md"
      >
        <div style={{ height: "500px", width: "100%" }}>
          <APIProvider apiKey={GOOGLE_API_KEY}>
            <Map
              key={selectedLab ? `lab-${selectedLab.lab_id}` : "lab-default"}
              defaultCenter={
                labMapCenter || {
                  lat: INITIAL_LATITUDE,
                  lng: INITIAL_LONGITUDE,
                }
              }
              defaultZoom={labMapCenter ? 16 : 13}
              mapId="lab-map"
              gestureHandling="greedy"
            >
              {/* Nearest Labs - Green Markers */}
              {nearestLabs.map((lab, index) =>
                lab.coordinates ? (
                  <AdvancedMarker
                    key={`nearest-lab-${lab.lab_id}-${index}`}
                    position={lab.coordinates}
                    title={lab.name}
                    onClick={() => handleSelectLab(lab)}
                  >
                    <Pin
                      background={
                        selectedLab?.lab_id === lab.lab_id
                          ? "#facc15"
                          : "#16a34a"
                      }
                      borderColor={
                        selectedLab?.lab_id === lab.lab_id
                          ? "#eab308"
                          : "#15803d"
                      }
                      glyphColor="#ffffff"
                      scale={selectedLab?.lab_id === lab.lab_id ? 1.3 : 1}
                    />
                  </AdvancedMarker>
                ) : null
              )}
              {/* Preferred Labs - Red Markers */}
              {labPreferences.map((lab, index) =>
                lab.coordinates ? (
                  <AdvancedMarker
                    key={`preferred-lab-${lab.lab_id}-${index}`}
                    position={lab.coordinates}
                    title={lab.name}
                    onClick={() => handleSelectLab(lab)}
                  >
                    <Pin
                      background={
                        selectedLab?.lab_id === lab.lab_id
                          ? "#facc15"
                          : "#dc2626"
                      }
                      borderColor={
                        selectedLab?.lab_id === lab.lab_id
                          ? "#eab308"
                          : "#991b1b"
                      }
                      glyphColor="#ffffff"
                      scale={selectedLab?.lab_id === lab.lab_id ? 1.3 : 1}
                    />
                  </AdvancedMarker>
                ) : null
              )}
              {/* InfoWindow for selected lab */}
              {selectedLab && selectedLab.coordinates && (
                <InfoWindow
                  position={selectedLab.coordinates}
                  onCloseClick={() => setSelectedLab(null)}
                >
                  <div style={{ padding: "8px", maxWidth: "250px" }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {selectedLab.name}
                    </h3>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}>
                      📍 {selectedLab.address}
                    </p>
                    {selectedLab.phone_number && (
                      <p style={{ margin: "4px 0", fontSize: "12px" }}>
                        📞 {selectedLab.phone_number}
                      </p>
                    )}
                    {selectedLab.distance_km !== undefined && (
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "12px",
                          color: "#16a34a",
                          fontWeight: "bold",
                        }}
                      >
                        Distance:{" "}
                        {selectedLab.distance_km < 1
                          ? `${(selectedLab.distance_km * 1000).toFixed(0)} m`
                          : `${selectedLab.distance_km.toFixed(1)} km`}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: "pharmacy",
      label: (
        <span className="flex items-center gap-2 text-base">
          <ShopOutlined />
          Pharmacy
        </span>
      ),
      children: pharmacyContent,
    },
    {
      key: "lab",
      label: (
        <span className="flex items-center gap-2 text-base">
          <ExperimentOutlined />
          Lab
        </span>
      ),
      children: labContent,
    },
  ];

  return (
    <div className="w-full h-full">
      {/* Selected Locations Display - Sticky */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border-b-2 border-gray-200 shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Selected Pharmacy Card */}
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

          {/* Selected Lab Card */}
          <div
            className={`rounded-lg p-4 transition-all duration-300 ${
              storedLab
                ? "bg-white border-2 border-green-400 shadow-md"
                : "bg-gray-50 border-2 border-dashed border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <ExperimentOutlined
                className={`text-lg ${
                  storedLab ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span className="font-semibold text-sm text-gray-700">
                Selected Lab
              </span>
            </div>
            {storedLab ? (
              <div className="space-y-1">
                <p
                  className="font-bold text-green-900 text-sm truncate"
                  title={storedLab.name}
                >
                  {storedLab.name}
                </p>
                <p
                  className="text-xs text-gray-600 line-clamp-2"
                  title={storedLab.address}
                >
                  📍 {storedLab.address}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No lab selected yet
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        className="px-4"
        tabBarStyle={{ marginBottom: 0 }}
      />
    </div>
  );
};

export default LocationSelector;
