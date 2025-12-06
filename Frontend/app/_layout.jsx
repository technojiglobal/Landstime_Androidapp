import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import "../global.css";

export default function RootLayout() {
  

  return <Stack screenOptions={{ headerShown: false }} />;
}
