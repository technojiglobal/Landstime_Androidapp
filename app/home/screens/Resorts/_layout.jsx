//app/home/screens/Resorts/_layout.jsx
import { Stack } from "expo-router";

export default function FlatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Property" />
    </Stack>
  );
}
