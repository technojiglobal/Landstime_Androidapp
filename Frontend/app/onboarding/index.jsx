

import React from "react";
import { useRouter } from "expo-router";
import { useEffect } from "react";
// import AutoSlider from "../home/AutoSlider"; // adjust path

export default function HomeScreen() {

  const router = useRouter();


  useEffect(()=> {
  router.replace("/onboarding/AutoSlider");
  })
  return null;
}
