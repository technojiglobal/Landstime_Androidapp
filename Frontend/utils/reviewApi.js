const BASE_URL = `${process.env.EXPO_PUBLIC_IP_ADDRESS}/api/reviews`;

/**
 * Fetch reviews for an entity
 * entityType: "interior" | "property"
 */
export const fetchReviews = async (entityType, entityId) => {
  const res = await fetch(
    `${BASE_URL}/${entityType}/${entityId}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch reviews");
  }

  return data;
};

/**
 * Submit review
 */
export const submitReview = async (payload) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit review");
  }

  return data;
};
