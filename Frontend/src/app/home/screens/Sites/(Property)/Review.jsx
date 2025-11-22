// Sites // (Property) // Review.jsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import assets
import starImg from "../../../../../../assets/star-3d.png";        // ⭐ single star image
import likeImg from "../../../../../../assets/like.png";        // 👍 like image
//import dislikeImg from "../../assets/dislike.png";  // 👎 dislike image
import replyImg from "../../../../../../assets/reply.png";      // 💬 reply image

const reviews = [
  {
    id: "1",
    name: "Rajesh Kumar",
    time: "2 days ago",
    title: "Excellent property with great potential",
    comment:
      "Visited this property last month and was impressed by the location and development potential. The views are stunning and the connectivity is better than expected. Definitely worth considering for investment.",
    rating: 5,
    helpful: 8,
  },
  {
    id: "2",
    name: "Lakshmana Rao",
    time: "4 days ago",
    title: "Good but a bit far from city",
    comment:
      "Nice views and peaceful environment, but it's a bit far from the main city center. Connectivity could be improved.",
    rating: 4,
    helpful: 3,
  },
];

// ⭐ Using same star image (filled = opacity: 1, empty = opacity: 0.3)
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

const Review = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Header */}
     

      {/* Rating Summary */}
      <View className="items-center mb-6">
        <Text className="text-5xl text-gray-900">4.3</Text>

        {/* ⭐ Big Stars */}
        <View className="flex-row my-2">
          {[1, 2, 3, 4].map((_, i) => (
            <Image
              key={i}
              source={starImg}
              style={{
                width: 22,
                height: 22,
                marginHorizontal: 2,
                opacity: 1,
              }}
              resizeMode="contain"
            />
          ))}

          <Image
            source={starImg}
            style={{
              width: 22,
              height: 22,
              marginHorizontal: 2,
              opacity: 0.3, // empty
            }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-gray-500 mb-3 text-[13px]">
          Based on 27 reviews
        </Text>

        {/* Distribution */}
        {[5, 4, 3, 2, 1].map((star, i) => (
          <View
            key={i}
            className="flex-row items-center w-full my-1 justify-between"
          >
            <View className="flex-row items-center mx-2">
              <Text className="text-gray-700">{star}</Text>
            </View>

            <Image
              source={starImg}
              style={{ width: 10, height: 10, opacity: 1 }}
              resizeMode="contain"
            />

            <View className="flex-1 h-1 bg-gray-200 mx-2 rounded-full overflow-hidden">
              <View
                className="bg-yellow-400 h-1.5 rounded-full"
                style={{ width: `${star * 15}%` }}
              />
            </View>

            <Text className="w-6 text-right text-gray-700">
              {star === 5 ? 21 : star === 4 ? 3 : 1}
            </Text>
          </View>
        ))}
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 pb-4 mb-4">
            <View className="flex-row items-start space-x-3">
              <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center">
                <Text className="text-gray-700 text-base">{item.name[0]}</Text>
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 text-base">{item.name}</Text>
                <Text className="text-xs text-gray-500">{item.time}</Text>
              </View>
            </View>

            {/* ⭐ Stars */}
            <View className="flex-1 w-full mt-1">{renderStars(item.rating)}</View>

            <Text className="mt-1 text-gray-900 font-bold">{item.title}</Text>
            <Text className="text-gray-700 text-xs leading-5 mt-1">
              {item.comment}
            </Text>

            {/* 👍 👎 💬 Action Icons */}
            <View className="flex-row mt-3 space-x-6 mb-3">
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Image
                  source={likeImg}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
                <Text className="black text-[12px] ml-3">
                  Helpful ({item.helpful})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center space-x-1">
                <Image
                  source={likeImg}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center space-x-1">
                <Image
                  source={replyImg}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
                <Text className="black text-sm">Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Review;
