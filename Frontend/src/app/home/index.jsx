import * as React from "react";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useResponsive } from "../../utils/responsive";

import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/UploadScreens/AddScreen";
import AddFurnishingsScreen from "./screens/UploadScreens/AddFurnishingsScreen";
import PlanScreen from "./screens/PlanScreen";
import ShortsScreen from "./screens/ShortsScreen";
import SettingsScreen from "./screens/BiddingsScreen";

const Tab = createBottomTabNavigator();
const AddStack = createNativeStackNavigator();

/* -----------------------------------------------------
   UNIVERSAL TAB ICON (handles both vector and images)
------------------------------------------------------ */
function TabItem({ focused, label, icon, activeIcon, isCenter, iconSet, scaleWidth, scaleHeight }) {
  const IconComponent =
    iconSet === "material" ? MaterialCommunityIcons : Ionicons;

  // Center Add button
  if (isCenter) {
    return (
      <View
        style={{
          width: scaleWidth(50),
          height: scaleWidth(50),
          borderRadius: scaleWidth(30),
          backgroundColor: "#22C55E",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: scaleHeight(35),
        }}
      >
        <Ionicons name="add" size={scaleWidth(30)} color="white" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: scaleWidth(80),
        height: scaleHeight(40),
        borderRadius: 9999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "#22C55E" : "transparent",
        paddingHorizontal: focused ? scaleWidth(10) : 0,
        
      }}
    >
      <IconComponent
        name={focused ? activeIcon : icon}
        size={scaleWidth(24)}
        color={focused ? "white" : "#22C55E"}
        
      />

      {focused && (
        <Text style={{ color: "white", marginLeft: scaleWidth(2), marginRight: scaleWidth(6), fontWeight: "600" }}>
          {label}
          
        </Text>
      )}
    </View>
  );
}

/* -----------------------------------------------------
   ADD TAB WRAPPER
------------------------------------------------------ */
function AddTabWrapper({ toggleSidebar, sidebarOpen }) {
  return (
    <AddStack.Navigator screenOptions={{ headerShown: false }}>
      <AddStack.Screen name="AddScreen">
        {(props) => (
          <AddScreen
            {...props}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        )}
      </AddStack.Screen>

      <AddStack.Screen
        name="AddFurnishingsScreen"
        component={AddFurnishingsScreen}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </AddStack.Navigator>
  );
}

/* -----------------------------------------------------
                  MAIN APP
------------------------------------------------------ */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { scaleWidth, scaleHeight } = useResponsive();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: sidebarOpen ? "none" : "flex",
          height: scaleHeight(80),
          borderTopWidth: 0,
          borderTopColor: "#e5e5e5",
          paddingBottom: scaleHeight(15),
          paddingTop: scaleHeight(10),
          backgroundColor: "white",
         },

        tabBarIcon: ({ focused }) => {
          const config = {
            Home: {
              label: "Home",
              icon: "home-outline",
              activeIcon: "home",
            },

            Shorts: {
              label: "Shorts",
              icon: "play-circle-outline",
              activeIcon: "play-circle",
            },

            Add: {
              isCenter: true,
            },

            Pro: {
              label: "Pro",
              icon: "diamond-outline",   // Ionicon
              activeIcon: "diamond",
            },

            Settings: {
              label: "Bidding",
              icon: "hammer-outline",   // Ionicon
              activeIcon: "hammer",
            },
          };

          const item = config[route.name];

          return (
            <TabItem
              focused={focused}
              label={item?.label}
              icon={item?.icon}
              activeIcon={item?.activeIcon}
              isCenter={item?.isCenter}
              scaleWidth={scaleWidth}
              scaleHeight={scaleHeight}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomeScreen toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      </Tab.Screen>

      <Tab.Screen name="Shorts">
        {() => <ShortsScreen toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      </Tab.Screen>

      <Tab.Screen name="Add">
        {() => <AddTabWrapper toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      </Tab.Screen>

      <Tab.Screen name="Pro">
        {() => <PlanScreen toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      </Tab.Screen>

      <Tab.Screen name="Settings">
        {() => <SettingsScreen toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
