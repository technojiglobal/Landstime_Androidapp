// Landstime_Androidapp/Frontend/app/_layout.jsx


import "../global.css";
import { Slot } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#00000001");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return <Slot />;
}