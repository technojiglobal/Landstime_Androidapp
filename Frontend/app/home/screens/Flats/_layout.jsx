//Frontend/app/home/screens/Flats/_layout.jsx
import { Stack } from "expo-router";

export default function FlatsLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          presentation: 'card',
        }}
      />
      {/* <Stack.Screen 
        name="Property"
        options={{
          presentation: 'card',
        }}
      /> */}
    </Stack>
  );
}