import { useWindowDimensions } from "react-native";

// Reference device (used across the app)
const REF_WIDTH = 430; // iPhone 14 Pro Max width used in project
const REF_HEIGHT = 932;

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const scaleWidth = (size) => (width / REF_WIDTH) * size;
  const scaleHeight = (size) => (height / REF_HEIGHT) * size;

  const clampWidth = (size, margin = 20) => Math.min(scaleWidth(size), width - margin);

  return {
    width,
    height,
    scaleWidth,
    scaleHeight,
    clampWidth,
  };
};

export const scaleWidth = (size, width) => (width / REF_WIDTH) * size;
export const scaleHeight = (size, height) => (height / REF_HEIGHT) * size;
