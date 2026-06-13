import { supabase } from "@/lib/supabase";
import type {
  ConquestList,
  ConquestListWithLocations,
  Location,
  LocationStatus,
  LocationWithLists,
  NewConquestList,
  NewLocation,
} from "@/types";

export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
export async function getConquestLists(): Promise<ConquestList[]> {
  const { data, error } = await supabase
    .from("conquest_lists")
    .select(
      `
      *,
      conquest_list_locations (
        location_id,
        locations (
          id,
          status
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((list) => {
    const listLocations = list.conquest_list_locations ?? [];

    const totalLocations = listLocations.length;

    const visitedLocations = listLocations.filter(
      (item) => item.locations?.status === "visited",
    ).length;

    const { conquest_list_locations, ...conquestList } = list;

    return {
      ...conquestList,
      statusProgress:
        totalLocations > 0 ? visitedLocations / totalLocations : 0,
    } as ConquestList;
  });
}

export async function createConquestList(
  list: NewConquestList,
): Promise<ConquestList> {
  const { data, error } = await supabase
    .from("conquest_lists")
    .insert({
      name: list.name,
      description: list.description ?? null,
      color: list.color ?? "#8b5cf6",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

//   Endre dette til at man enten oppretter en location hvis det ikke finnes i databasen, eller oppdaterer eksisterende location hvis den allerede finnes
export async function createOrUpdateLocation(
  location: NewLocation,
): Promise<Location> {
  const latitude = Number(location.latitude.toFixed(4));
  const longitude = Number(location.longitude.toFixed(4));

  const { data: existingLocation, error: findError } = await supabase
    .from("locations")
    .select("*")
    .eq("name", location.name)
    .eq("latitude", latitude)
    .eq("longitude", longitude)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  const locationPayload = {
    name: location.name,
    description: location.description ?? null,
    location_type: location.location_type,
    status: location.status,
    latitude,
    longitude,
    country: location.country ?? null,
    region: location.region ?? null,
    visited_at:
      location.status === "visited"
        ? (location.visited_at ?? new Date().toISOString().slice(0, 10))
        : null,
  };

  if (existingLocation) {
    const { data, error } = await supabase
      .from("locations")
      .update(locationPayload)
      .eq("id", existingLocation.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("locations")
    .insert(locationPayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addLocationToList(
  listId: string,
  locationId: string,
): Promise<void> {
  const { error } = await supabase.from("conquest_list_locations").insert({
    list_id: listId,
    location_id: locationId,
  });

  if (error) {
    throw error;
  }
}

export async function createLocationAndMaybeAddToList(params: {
  location: NewLocation;
  existingListId?: string | null;
  newListName?: string | null;
  newListColor?: string | null;
}): Promise<Location> {
  const createdLocation = await createOrUpdateLocation(params.location);

  let listId = params.existingListId ?? null;

  const trimmedNewListName = params.newListName?.trim();

  if (trimmedNewListName) {
    const createdList = await createConquestList({
      name: trimmedNewListName,
      color: params.newListColor || "#8b5cf6",
    });

    listId = createdList.id;
  }

  if (listId) {
    await addLocationToList(listId, createdLocation.id);
  }

  return createdLocation;
}

export async function updateLocationStatus(
  locationId: string,
  status: LocationStatus,
): Promise<Location> {
  const { data, error } = await supabase
    .from("locations")
    .update({
      status,
      visited_at:
        status === "visited" ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", locationId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getLocationsWithLists(): Promise<LocationWithLists[]> {
  const { data, error } = await supabase
    .from("locations")
    .select(
      `
      *,
      conquest_list_locations (
        conquest_lists (
          id,
          name,
          description,
          color,
          created_at,
          updated_at
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((location) => {
    const lists =
      location.conquest_list_locations
        ?.map((item: any) => item.conquest_lists)
        .filter(Boolean) ?? [];

    const listColor = lists[0]?.color ?? null;

    return {
      ...location,
      lists,
      listColor,
    };
  });
}

export async function updateConquestList({
  listId,
  name,
  description,
  durationDays,
  lengthKm,
}: {
  listId: string;
  name: string;
  description: string;
  durationDays: number | null;
  lengthKm: number | null;
}) {
  const { data, error } = await supabase
    .from("conquest_lists")
    .update({
      name,
      description,
      duration: durationDays,
      length: lengthKm,
    })
    .eq("id", listId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getListWithLocations(
  listId: string,
): Promise<ConquestListWithLocations> {
  const { data, error } = await supabase
    .from("conquest_lists")
    .select(
      `
      *,
      conquest_list_locations (
        locations (
          id,
          name,
          description,
          location_type,
          status,
          latitude,
          longitude,
          country,
          region,
          visited_at,
          created_at,
          updated_at
        )
      )
    `,
    )
    .eq("id", listId)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    locations:
      data.conquest_list_locations
        ?.map((item: any) => item.locations)
        .filter(Boolean) ?? [],
  };
}

export async function deleteLocation(locationId: string): Promise<void> {
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", locationId);

  if (error) {
    throw error;
  }
}

export async function removeLocationFromList(
  listId: string,
  locationId: string,
): Promise<void> {
  const { error } = await supabase
    .from("conquest_list_locations")
    .delete()
    .eq("list_id", listId)
    .eq("location_id", locationId);

  if (error) {
    throw error;
  }
}

export async function updateConquestListColor(
  listId: string,
  color: string,
): Promise<ConquestList> {
  const { data, error } = await supabase
    .from("conquest_lists")
    .update({ color })
    .eq("id", listId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
