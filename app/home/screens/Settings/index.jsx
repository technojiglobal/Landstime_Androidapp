// Frontend/app/home/screens/Settings/index.jsx

import React from "react";
import { View, ScrollView, StatusBar } from "react-native";

import Hero from "./Hero";
import Account from "./Account";
import General from "./General";
import Notifications from "./Notifications";
import Privacy from "./Privacy";

const Index = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-4 pt-2">
          <Hero />
          <Account />
          <Notifications />
          <Privacy />
          <General />
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;