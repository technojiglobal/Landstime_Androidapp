// Frontend/components/WriteReview.jsx
import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { submitReview } from "../utils/reviewApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function WriteReview({ entityId, entityType }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState("Anonymous");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserName(userData.name || userData.username || "Anonymous");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = async () => {
    // ✅ FIXED: Changed from review.length < 5 to review.length < 50
    if (!rating || !title.trim() || review.trim().length < 50) {
      alert("Please fill all fields. Review must be at least 50 characters.");
      return;
    }

    try {
      await submitReview({
        entityId,
        entityType,
        rating,
        title: title.trim(),
        comment: review.trim(),
        userName: userName,
      });

      alert("Review submitted successfully");
      setRating(0);
      setTitle("");
      setReview("");
    } catch (err) {
      alert(err.message || "Failed to submit review");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      >
        {/* Outer Card */}
        <View style={styles.card}>
          <Text style={styles.mainTitle}>
            Excellent property with great potential
          </Text>
          <Text style={styles.subText}>
            Share your experience with this property to help other buyers
          </Text>

          {/* Rating Section */}
          <Text style={styles.sectionTitle}>Overall Rating</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <MaterialCommunityIcons
                  name={i <= rating ? "star" : "star-outline"}
                  size={38}
                  color={i <= rating ? "#FFD700" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Title */}
          <Text style={styles.sectionTitle}>Review Title</Text>
          <TextInput
            placeholder="Summarize your experience..."
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Review Text */}
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            placeholder="Tell others about your experience with this property, the agent, location, and any other relevant details..."
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
            multiline
            textAlignVertical="top"
            style={[styles.input, { height: 120 }]}
          />
          <Text style={styles.helperText}>
            Minimum 50 characters required ({review.length}/50)
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.draftBtn} activeOpacity={0.8}>
              <Text style={styles.draftText}>Save as Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.submitBtn,
                // ✅ Optional: Add visual feedback when form is invalid
                (!rating || !title.trim() || review.trim().length < 50) && styles.submitBtnDisabled
              ]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    marginTop: 40,
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#000",
    marginBottom: 20,
  },
  helperText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: -10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  draftBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  draftText: {
    color: "#111827",
    fontWeight: "500",
    fontSize: 14,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#22C55E", // ✅ Changed from gray to green
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF", // ✅ Gray when disabled
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});