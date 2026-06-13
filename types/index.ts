export type LocationType =
  | "country"
  | "city"
  | "region"
  | "mountain"
  | "mountain_range"
  | "landmark"
  | "other";

export type LocationStatus = "visited" | "want_to_visit" | "neutral";

export type Location = {
  id: string;
  name: string;
  description: string | null;
  listColor: string | null;
  location_type: LocationType;
  status: LocationStatus;
  latitude: number;
  longitude: number;
  country: string | null;
  region: string | null;
  visited_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewLocation = {
  name: string;
  description?: string | null;
  location_type: LocationType;
  status: LocationStatus;
  latitude: number;
  longitude: number;
  country?: string | null;
  region?: string | null;
  visited_at?: string | null;
};

export type ConquestList = {
  id: string;
  name: string;
  statusProgress: number;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type NewConquestList = {
  name: string;
  description?: string | null;
  color?: string | null;
};

export type ConquestListLocation = {
  id: string;
  list_id: string;
  location_id: string;
  created_at: string;
};

export type LocationWithLists = Location & {
  lists?: ConquestList[];
};

export type ConquestListWithLocations = ConquestList & {
  locations: Location[];
};
