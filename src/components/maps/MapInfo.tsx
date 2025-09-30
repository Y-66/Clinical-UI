import type { Poi } from "../../types/Poi";

const MapInfo = ({ selectedPoi }: { selectedPoi: Poi }) => {
  return (
    <div style={{ maxWidth: "250px" }}>
      {selectedPoi.icon && (
        <img
          src={selectedPoi.icon}
          alt="icon"
          style={{ width: 32, height: 32, float: "right" }}
        />
      )}
      <h4 style={{ margin: "0 0 4px 0" }}>{selectedPoi.name}</h4>
      <p style={{ margin: "0 0 4px 0" }}>{selectedPoi.vicinity}</p>
      {selectedPoi.rating && (
        <p style={{ margin: "0 0 4px 0" }}>
          ⭐ {selectedPoi.rating} ({selectedPoi.user_ratings_total} reviews)
        </p>
      )}
      {selectedPoi.business_status && (
        <p style={{ margin: "0 0 4px 0" }}>
          Status: {selectedPoi.business_status}
        </p>
      )}
      {/* {selectedPoi.plus_code && (
                  <p style={{ margin: "0 0 4px 0" }}>
                    Plus Code: {selectedPoi.plus_code}
                  </p>
                )} */}
      {selectedPoi.types && selectedPoi.types.length > 0 && (
        <p style={{ margin: 0 }}>Types: {selectedPoi.types.join(", ")}</p>
      )}
    </div>
  );
};

export default MapInfo;
