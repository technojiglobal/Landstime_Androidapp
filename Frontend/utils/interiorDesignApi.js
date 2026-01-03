//Frontend/utils/interiorDesignApi.js

import { Platform } from "react-native";

/**
 * IMPORTANT:
 * Android emulator → use local IP (NOT localhost)
 * Expo physical device → same WiFi IP
 */
const BASE_URL = "http://10.10.2.39:8000/api/admin/interior";


export const fetchInteriorDesigns = async ({
  page = 1,
  limit = 10,
  selectedRoom = "All Rooms",
}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
    });

    // Map selectedRoom → backend fields
    if (selectedRoom && selectedRoom !== "All Rooms") {
  params.append("category", selectedRoom);
}


    const response = await fetch(`${BASE_URL}/designs?${params.toString()}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch designs");
    }

    return result;
  } catch (error) {
    console.error("❌ Fetch Interior Designs Error:", error.message);
    throw error;
  }
};
