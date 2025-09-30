// types.ts
export type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  business_status?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  icon?: string;
  plus_code?: google.maps.places.PlacePlusCode;
  types?: string[];
};
