import { useRef, useEffect, useState } from "react";
import { View, FlatList, Dimensions } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");

// Import your 4 screens
import Screen1 from "../onboarding/welcomescreen1";
import Screen2 from "../onboarding/welcomescreen2";
import Screen3 from "../onboarding/welcomescreen3";
import Screen4 from "../onboarding/welcomescreen4";

const screens = [Screen1, Screen2, Screen3, Screen4];

export default function AutoSlider() {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    if (index >= screens.length - 1) return;

    const timer = setTimeout(() => {
      const nextIndex = index + 1;
      setIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ref={flatListRef}
        data={screens}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.index * width,
            animated: true,
          });
        }}
        renderItem={({ item: ScreenComponent }) => (
          <Animated.View
            entering={SlideInRight.duration(600)}
            exiting={SlideOutLeft.duration(600)}
            style={{ width }}
          >
            <ScreenComponent />
          </Animated.View>
        )}
        keyExtractor={(_, i) => i.toString()}
      />
    </View>
  );
}
