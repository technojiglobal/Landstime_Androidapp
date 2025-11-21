// app/home/screens/Flats/_layout.tsx
import { Stack } from "expo-router";

export default function FlatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Property" />
    </Stack>
  );
}
