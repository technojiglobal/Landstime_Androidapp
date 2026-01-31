
// Frontend/components/Review.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { fetchReviews } from "../utils/reviewApi";

// Assets
import starImg from "../assets/star-3d.png";
import likeImg from "../assets/like.png";

// ⭐ Render stars (filled + empty)
const renderStars = (count) => (
  <View className="flex-row mt-1">
    {[...Array(5)].map((_, i) => (
      <Image
        key={i}
        source={starImg}
        style={{
          width: 12,
          height: 12,
          marginRight: 2,
          opacity: i < count ? 1 : 0.3,
        }}
        resizeMode="contain"
      />
    ))}
  </View>
);

// 📊 Calculate rating distribution
const getRatingStats = (reviews) => {
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      stats[r.rating]++;
    }
  });

  return stats;
};

const getPercentage = (count, total) => {
  if (!total) return "0%";
  return `${Math.round((count / total) * 100)}%`;
};

const Review = ({ entityId, entityType }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ avgRating: 0, count: 0 });

  useEffect(() => {
    if (!entityId || !entityType) return;

    fetchReviews(entityType, entityId).then((res) => {
      setReviews(res.reviews || []);
      setSummary({
        avgRating: res.avgRating || 0,
        count: res.count || 0,
      });
    });
  }, [entityId, entityType]);

  const ratingStats = getRatingStats(reviews);
  const totalReviews = summary.count;

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* ================= SUMMARY ================= */}
      <View className="items-center mb-6">
        <Text className="text-5xl text-gray-900">
          {summary.avgRating.toFixed(1)}
        </Text>

        {/* ⭐ Big stars */}
        <View className="flex-row my-2">
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              source={starImg}
              style={{
                width: 22,
                height: 22,
                marginHorizontal: 2,
                opacity: i < Math.round(summary.avgRating) ? 1 : 0.3,
              }}
              resizeMode="contain"
            />
          ))}
        </View>

        <Text className="text-gray-500 text-sm mb-3">
          Based on {totalReviews} reviews
        </Text>

        {/* ================= DISTRIBUTION GRAPH ================= */}
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingStats[star] || 0;

          return (
            <View
              key={star}
              className="flex-row items-center w-full my-1"
            >
              <Text className="w-4 text-gray-700">{star}</Text>

              <Image
                source={starImg}
                style={{ width: 10, height: 10, marginHorizontal: 4 }}
                resizeMode="contain"
              />

              <View className="flex-1 h-1 bg-gray-200 mx-2 rounded-full overflow-hidden">
                <View
                  className="bg-yellow-400 h-1.5 rounded-full"
                  style={{
                    width: getPercentage(count, totalReviews),
                  }}
                />
              </View>

              <Text className="w-8 text-right text-gray-700">
                {count}
              </Text>
            </View>
          );
        })}
      </View>

      {/* ================= REVIEW LIST ================= */}
      {reviews.length === 0 ? (
        <Text className="text-center text-gray-400 mt-6">
          No reviews yet. Be the first to review.
        </Text>
      ) : (
        <View>
          {reviews.map((item) => (
            <View
              key={item._id}
              className="border-b border-gray-200 pb-4 mb-4"
            >
              {/* Header */}
              {/* Header */}
              <View className="flex-row items-start space-x-3">
                <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center">
                  <Text className="text-gray-700 text-base">
                    {(item.userName || "A")[0]}  {/* ✅ Changed from item.name to item.userName */}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 text-base">
                    {item.userName || "Anonymous"}  {/* ✅ Changed from item.name to item.userName */}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(item.createdAt).toDateString()}
                  </Text>
                </View>
              </View>

              {/* Rating */}
              <View className="mt-1">{renderStars(item.rating)}</View>

              {/* Content */}
              <Text className="mt-1 text-gray-900 font-bold">
                {item.title}
              </Text>
              <Text className="text-gray-700 text-xs leading-5 mt-1">
                {item.comment}
              </Text>

              {/* Actions */}
              <View className="flex-row mt-3 space-x-6">
                <TouchableOpacity className="flex-row items-center space-x-1">
                  <Image source={likeImg} style={{ width: 18, height: 18 }} />
                  <Text className="text-[12px] ml-2">
                    Helpful ({item.helpful ?? 0})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Review;
