import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 15,
          paddingTop: 10,
          borderTopWidth: 0,
          backgroundColor: "white",
        },
      }}
    >

      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Home"
              icon="home-outline"
              activeIcon="home"
            />
          ),
        }}
      />

      {/* SHORTS */}
      <Tabs.Screen
        name="shorts"
        options={{
          
    
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Shorts"
              icon="play-circle-outline"
              activeIcon="play-circle"
            />
          ),
        }}
      />

      {/* ADD BUTTON */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: () => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                backgroundColor: "#22C55E",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 35,
              }}
            >
              <Ionicons name="add" size={30} color="white" />
            </View>
          ),
        }}
      />

      {/* PRO */}
      <Tabs.Screen
        name="pro"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Pro"
              icon="diamond-outline"
              activeIcon="diamond"
            />
          ),
        }}
      />

      {/* SETTINGS / BIDDING */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Bidding"
              icon="hammer"
              activeIcon="hammer"
              iconSet="material"
            />
          ),
        }}
      />

    </Tabs>
  );
}

/* ---------------------------------------------
   CUSTOM ICON COMPONENT — SAME AS YOUR OLD DESIGN
---------------------------------------------- */
function TabIcon({ focused, label, icon, activeIcon, iconSet = "ion" }) {
  const IconComponent =
    iconSet === "material" ? MaterialCommunityIcons : Ionicons;

  return (
    <View
      style={{
        width: 80,
        height: 40,
        borderRadius: 9999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "#22C55E" : "transparent",
        paddingHorizontal: focused ? 10 : 0,
      }}
    >
      <IconComponent
        name={focused ? activeIcon : icon}
        size={24}
        color={focused ? "white" : "#22C55E"}
      />

      {focused && (
        <Text style={{ color: "white", marginLeft: 4, fontWeight: "600" }}>
          {label}
        </Text>
      )}
    </View>
  );
}
