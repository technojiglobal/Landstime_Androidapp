//File: Landstime_Androidapp/Frontend/components/VastuModal.jsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useResponsive } from "../utils/responsive";

export default function VastuModal({ visible, onClose, propertyType, vastuDetails, commercialSubType }) {
  const { scaleWidth, scaleHeight } = useResponsive();

  // ✅ Helper function to get icon based on field type
  const getIconForField = (fieldName) => {
    const iconMap = {
      // House/Building facing
      houseFacing: require("../assets/house.png"),
      propertyFacing: require("../assets/house.png"),
      buildingFacing: require("../assets/house.png"),
      officeFacing: require("../assets/house.png"),
      shopFacing: require("../assets/house.png"),
      plotFacing: require("../assets/house.png"),
      
      // Bedrooms
      masterBedroom: require("../assets/bedroom.png"),
      childrenBedroom: require("../assets/bedroom.png"),
      masterSuitroom: require("../assets/bedroom.png"),
      guestRoom: require("../assets/bedroom.png"),
      guestRooms: require("../assets/bedroom.png"),
      
      // Living/Reception areas
      livingRoom: require("../assets/living.png"),
      receptionAreaFacing: require("../assets/living.png"),
      mainLobbyDirection: require("../assets/living.png"),
      reception: require("../assets/living.png"),
      
      // Kitchen
      kitchenRoom: require("../assets/kitchen.png"),
      kitchen: require("../assets/kitchen.png"),
      
      // Pooja Room
      poojaRoom: require("../assets/pooja.png"),
      
      // Balcony
      balcony: require("../assets/balcony.png"),
      
      // Default icon for others
      default: require("../assets/house.png"),
    };
    
    return iconMap[fieldName] || iconMap.default;
  };

  // ✅ Get Vastu fields based on property type
  const getVastuFields = () => {
    if (!vastuDetails) return [];

    let fields = [];

    if (propertyType === 'House' || propertyType === 'House/Flat') {
      fields = [
        { key: 'houseFacing', label: 'House Facing' },
        { key: 'masterBedroom', label: 'Master Bedroom' },
        { key: 'childrenBedroom', label: 'Children Bedroom' },
        { key: 'livingRoom', label: 'Living Room' },
        { key: 'kitchenRoom', label: 'Kitchen Room' },
        { key: 'poojaRoom', label: 'Pooja Room' },
        { key: 'balcony', label: 'Balcony' },
      ];
    } else if (propertyType === 'Resort') {
      fields = [
        { key: 'propertyFacing', label: 'Property Facing' },
        { key: 'entranceDirection', label: 'Entrance Direction' },
        { key: 'receptionAreaFacing', label: 'Reception Area Facing' },
        { key: 'mainLobbyDirection', label: 'Main Lobby Direction' },
        { key: 'masterSuitroom', label: 'Master Suite Room' },
        { key: 'guestRoom', label: 'Guest Room' },
        { key: 'restaurantDirection', label: 'Restaurant Direction' },
        { key: 'vipSuite', label: 'VIP Suite' },
        { key: 'conferenceDirection', label: 'Conference Direction' },
        { key: 'spaRoom', label: 'Spa Room' },
        { key: 'swimmingPool', label: 'Swimming Pool' },
        { key: 'yoga', label: 'Yoga' },
        { key: 'kitchenRoom', label: 'Kitchen Room' },
        { key: 'poojaRoom', label: 'Pooja Room' },
        { key: 'office', label: 'Office' },
        { key: 'recreation', label: 'Recreation' },
        { key: 'balcony', label: 'Balcony' },
        { key: 'garden', label: 'Garden' },
      ];
    } else if (propertyType === 'Site/Plot/Land') {
      fields = [
        { key: 'plotFacing', label: 'Plot Facing' },
        { key: 'mainEntryDirection', label: 'Main Entry Direction' },
        { key: 'plotSlope', label: 'Plot Slope' },
        { key: 'openSpace', label: 'Open Space' },
        { key: 'plotShape', label: 'Plot Shape' },
        { key: 'roadPosition', label: 'Road Position' },
        { key: 'waterSource', label: 'Water Source' },
        { key: 'drainageDirection', label: 'Drainage Direction' },
        { key: 'compoundWallHeight', label: 'Compound Wall Height' },
        { key: 'existingStructures', label: 'Existing Structures' },
      ];
    } else if (propertyType === 'Commercial') {
      if (commercialSubType === 'Office') {
        fields = [
          { key: 'officeFacing', label: 'Office Facing' },
          { key: 'entrance', label: 'Entrance' },
          { key: 'cabin', label: 'Cabin' },
          { key: 'workstations', label: 'Workstations' },
          { key: 'conference', label: 'Conference' },
          { key: 'reception', label: 'Reception' },
          { key: 'accounts', label: 'Accounts' },
          { key: 'pantry', label: 'Pantry' },
          { key: 'server', label: 'Server' },
          { key: 'washrooms', label: 'Washrooms' },
          { key: 'staircase', label: 'Staircase' },
          { key: 'storage', label: 'Storage' },
          { key: 'cashLocker', label: 'Cash Locker' },
        ];
      } else if (commercialSubType === 'Retail') {
        fields = [
          { key: 'shopFacing', label: 'Shop Facing' },
          { key: 'entrance', label: 'Entrance' },
          { key: 'cashCounter', label: 'Cash Counter' },
          { key: 'cashLocker', label: 'Cash Locker' },
          { key: 'ownerSeating', label: 'Owner Seating' },
          { key: 'staffSeating', label: 'Staff Seating' },
          { key: 'storage', label: 'Storage' },
          { key: 'displayArea', label: 'Display Area' },
          { key: 'electrical', label: 'Electrical' },
          { key: 'pantryArea', label: 'Pantry Area' },
          { key: 'staircase', label: 'Staircase' },
          { key: 'staircaseInside', label: 'Staircase Inside' },
        ];
      } else if (commercialSubType === 'Plot/Land') {
        fields = [
          { key: 'plotFacing', label: 'Plot Facing' },
          { key: 'mainEntry', label: 'Main Entry' },
          { key: 'plotSlope', label: 'Plot Slope' },
          { key: 'openSpace', label: 'Open Space' },
          { key: 'shape', label: 'Shape' },
          { key: 'roadPosition', label: 'Road Position' },
          { key: 'waterSource', label: 'Water Source' },
          { key: 'drainage', label: 'Drainage' },
          { key: 'compoundWall', label: 'Compound Wall' },
          { key: 'structures', label: 'Structures' },
        ];
      } else if (commercialSubType === 'Storage') {
        fields = [
          { key: 'buildingFacing', label: 'Building Facing' },
          { key: 'entrance', label: 'Entrance' },
          { key: 'storageArea', label: 'Storage Area' },
          { key: 'lightGoods', label: 'Light Goods' },
          { key: 'loading', label: 'Loading' },
          { key: 'office', label: 'Office' },
          { key: 'electrical', label: 'Electrical' },
          { key: 'water', label: 'Water' },
          { key: 'washroom', label: 'Washroom' },
          { key: 'height', label: 'Height' },
        ];
      } else if (commercialSubType === 'Industry') {
        fields = [
          { key: 'buildingFacing', label: 'Building Facing' },
          { key: 'entrance', label: 'Entrance' },
          { key: 'machinery', label: 'Machinery' },
          { key: 'production', label: 'Production' },
          { key: 'rawMaterial', label: 'Raw Material' },
          { key: 'finishedGoods', label: 'Finished Goods' },
          { key: 'office', label: 'Office' },
          { key: 'electrical', label: 'Electrical' },
          { key: 'water', label: 'Water' },
          { key: 'waste', label: 'Waste' },
          { key: 'washroom', label: 'Washroom' },
        ];
      } else if (commercialSubType === 'Hospitality') {
        fields = [
          { key: 'buildingFacing', label: 'Building Facing' },
          { key: 'entrance', label: 'Entrance' },
          { key: 'reception', label: 'Reception' },
          { key: 'adminOffice', label: 'Admin Office' },
          { key: 'guestRooms', label: 'Guest Rooms' },
          { key: 'banquet', label: 'Banquet' },
          { key: 'kitchen', label: 'Kitchen' },
          { key: 'dining', label: 'Dining' },
          { key: 'cashCounter', label: 'Cash Counter' },
          { key: 'electrical', label: 'Electrical' },
          { key: 'waterStructure', label: 'Water Structure' },
          { key: 'washroom', label: 'Washroom' },
          { key: 'storage', label: 'Storage' },
        ];
      }
    }

    // ✅ Filter out empty/null values and map to display format
    return fields
      .filter(field => vastuDetails[field.key])
      .map(field => ({
        icon: getIconForField(field.key),
        text: field.label,
        direction: vastuDetails[field.key] || 'Not specified',
      }));
  };

  const vastuData = getVastuFields();

  // ✅ If no vaastu data, show message
  if (!vastuDetails || vastuData.length === 0) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View className="bg-white w-[330px] p-6 rounded-[20px]">
            <Text className="text-center text-gray-600 mb-4">No Vaastu details available for this property</Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#22C55E",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // constants
  const scrollViewHeight = 433;
  const thumbHeight = 253.7;
  const itemHeight = 64; // item + margin
  const contentHeight = vastuData.length * itemHeight;
  const scrollableHeight = contentHeight - scrollViewHeight;

  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // map scroll position to thumb position
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const thumbPos =
        (value / scrollableHeight) * (scrollViewHeight - thumbHeight);
      pan.setValue(thumbPos);
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  // draggable thumb behavior
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan.__getValue());
      },
      onPanResponderMove: (_, gestureState) => {
        let newPos = gestureState.dy + pan._offset;
        if (newPos < 0) newPos = 0;
        if (newPos > scrollViewHeight - thumbHeight)
          newPos = scrollViewHeight - thumbHeight;

        pan.setValue(newPos);

        // calculate content scroll position based on thumb drag
        const scrollPos =
          (newPos / (scrollViewHeight - thumbHeight)) * scrollableHeight;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: scrollPos, animated: false });
        }
      },
      onPanResponderRelease: () => pan.flattenOffset(),
    })
  ).current;

  // ✅ Determine property type label for display
  const getPropertyTypeLabel = () => {
    if (propertyType === 'House' || propertyType === 'House/Flat') return 'House';
    if (propertyType === 'Resort') return 'Resort';
    if (propertyType === 'Site/Plot/Land') return 'Site';
    if (propertyType === 'Commercial') {
      if (commercialSubType) return commercialSubType;
      return 'Commercial';
    }
    return 'Property';
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
        <View className="bg-white w-[330px] h-[600px] rounded-[20px] overflow-hidden" style={{ zIndex: 30 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-black/10">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/vastu.png")}
                style={{
                  width: scaleWidth(25),
                  height: scaleHeight(25),
                  resizeMode: "contain",
                  marginRight: scaleWidth(8),
                }}
              />
              <Text className="text-black font-semibold text-lg">
                View Details
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={13} color="#00000066" />
            </TouchableOpacity>
          </View>

          {/* Center Box */}
          <View
            style={{
              width: scaleWidth(103),
              height: scaleHeight(24),
              backgroundColor: "#FFA5002B",
              borderRadius: scaleWidth(8),
              alignSelf: "center",
              marginVertical: scaleHeight(10),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/house.png")}
              style={{
                width: scaleWidth(13),
                height: scaleHeight(13),
                resizeMode: "contain",
                marginRight: scaleWidth(5),
              }}
            />
            <Text
              style={{ fontSize: scaleWidth(10), color: "#FFA500", fontWeight: "500" }}
            >
              {getPropertyTypeLabel()}
            </Text>
          </View>

          {/* Scrollable Area */}
          <View
            style={{
              width: scaleWidth(286),
              height: scaleHeight(scrollViewHeight),
              alignSelf: "center",
              borderRadius: scaleWidth(10),
              flexDirection: "row",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Property List */}
            <Animated.ScrollView
              ref={scrollViewRef}
              style={{
                flex: 1,
                marginRight: 12, // creates gap between list and scrollbar
              }}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false} // hides system scrollbar
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            >
              {vastuData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: scaleHeight(49),
                    borderRadius: scaleWidth(10),
                    backgroundColor: "#F9FAFB",
                    borderWidth: Math.max(1, Math.round(scaleWidth(1))),
                    borderColor: "#E0E0E0",
                    elevation: 2,
                    paddingHorizontal: scaleWidth(10),
                    marginBottom: scaleHeight(15),
                  }}
                >
                  {/* Left: Icon + Text */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={item.icon}
                      style={{
                        width: scaleWidth(18),
                        height: scaleHeight(18),
                        resizeMode: "contain",
                        marginRight: scaleWidth(8),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: scaleWidth(10),
                        color: "#000000CC",
                        fontWeight: "500",
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>

                  {/* Right: Direction */}
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: scaleWidth(10),
                        color: "#000000CC",
                        marginBottom: scaleHeight(2),
                      }}
                    >
                      {item.direction}
                    </Text>
                    <Text style={{ fontSize: scaleWidth(8), color: "#00000066" }}>
                      Direction
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.ScrollView>

            {/* Custom Scrollbar Track + Thumb */}
            <View
              style={{
                width: scaleWidth(7),
                height: scaleHeight(scrollViewHeight),
                backgroundColor: "#D9D9D980",
                borderRadius: scaleWidth(10),
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Animated.View
                {...panResponder.panHandlers}
                style={{
                  width: scaleWidth(7),
                  height: scaleHeight(thumbHeight),
                  borderRadius: scaleWidth(10),
                  backgroundColor: "#00000029",
                  transform: [{ translateY: pan }],
                }}
              />
            </View>
          </View>

          {/* Close Button */}
          <View className="items-center mt-10">
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#22C55E",
                width: scaleWidth(179),
                height: scaleHeight(33),
                borderRadius: scaleWidth(8),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: scaleWidth(14), fontWeight: "600" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}