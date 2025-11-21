import * as React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/UploadScreens/AddScreen";
import AddFurnishingsScreen from "./screens/UploadScreens/AddFurnishingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShortsScreen from "./screens/ShortsScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const AddStack = createNativeStackNavigator();

function CustomTabIcon({ name, label, focused, isCenter }) {
  if (isCenter) {
    return (
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 30,
          backgroundColor: "#22C55E",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 35,
          shadowColor: "#22C55E",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Ionicons name={name} size={30} color="white" />
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 40,
        borderRadius: 9999,
        paddingHorizontal: focused ? 10 : 0,
        backgroundColor: focused ? "#22C55E" : "transparent",
      }}
    >
      <Ionicons name={name} size={24} color={focused ? "white" : "#22C55E"} />
      {focused && (
        <Text style={{ color: "white", fontWeight: "600", marginLeft: 6 }}>
          {label}
        </Text>
      )}
    </View>
  );
}

// 🧩 Stack used only inside the Add tab
function AddTabWrapper({ toggleSidebar, sidebarOpen }) {
  return (
    <AddStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Add Screen */}
      <AddStack.Screen name="AddScreen">
        {(props) => (
          <AddScreen
            {...props}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </AddStack.Screen>

      {/* Modal-style popup screen for Add Furnishings */}
      <AddStack.Screen
        name="AddFurnishingsScreen"
        component={AddFurnishingsScreen}
        options={{
          presentation: "modal", // 👈 makes it show like a popup
          headerShown: false,
          title: "Add Furnishings",
          headerLeft: () => null, // hide default back arrow
        }}
      />
    </AddStack.Navigator>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: sidebarOpen ? "none" : "flex" },

        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "Home":
              return (
                <CustomTabIcon
                  name={focused ? "home" : "home-outline"}
                  label="Home"
                  focused={focused}
                />
              );
            case "Add":
              return (
                <CustomTabIcon name="add" focused={focused} isCenter={true} />
              );
            case "Shorts":
              return (
                <CustomTabIcon
                  name={focused ? "play-circle" : "play-circle-outline"}
                  label="Shorts"
                  focused={focused}
                />
              );
            case "Profile":
              return (
                <CustomTabIcon
                  name={focused ? "person" : "person-outline"}
                  label="Profile"
                  focused={focused}
                />
              );
            case "Settings":
              return (
                <CustomTabIcon
                  name={focused ? "settings" : "settings-outline"}
                  label="Settings"
                  focused={focused}
                />
              );
          }
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => (
          <HomeScreen toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        )}
      </Tab.Screen>

      <Tab.Screen name="Shorts">
        {() => (
          <ShortsScreen
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </Tab.Screen>

      {/* 🧩 Wrapped Add tab */}
      <Tab.Screen name="Add">
        {() => (
          <AddTabWrapper
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Settings">
        {() => (
          <SettingsScreen
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
