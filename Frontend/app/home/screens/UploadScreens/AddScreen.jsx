import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import TopAlert from "./TopAlert";
import CustomPickerAlert from "../../../../components/CustomPickerAlert";

export default function AddScreen() {
  const [constructionStatus, setConstructionStatus] = useState("Ready");
  const [possessionBy, setPossessionBy] = useState(""); // New state for Possession By
  const router = useRouter();
  
const [propertyType, setPropertyType] = useState("House");
const [propertyTitle, setPropertyTitle] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState("Freehold");
  const [selectedAge, setSelectedAge] = useState("0-1 years");
  const [images, setImages] = useState([]);
  const [furnishing, setFurnishing] = useState("Furnished");
  const [covered, setCovered] = useState(0);
  const [open, setOpen] = useState(0);
 const [visible, setVisible] = useState(null);
 const [pickerAlertVisible, setPickerAlertVisible] = useState(false);

  const [houseFacing, setHouseFacing] = useState("North-East");
  const [masterBedroom, setMasterBedroom] = useState("North-East");
  const [childrenBedroom, setChildrenBedroom] = useState("North-East");
  const [livingRoom, setLivingRoom] = useState("North-East");
  const [kitchenRoom, setKitchenRoom] = useState("North-East");
  const [poojaRoom, setPoojaRoom] = useState("North-East");
  const [balcony, setBalcony] = useState("North-East");
  const [selectedPrices, setSelectedPrices] = useState([]);

  
  const options = ["0-1 years", "1-5 years", "5-10 years", "10+ years"];
  const directions = ["North-East", "South-West", "East", "West"];
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative society",
    "Power of Attorney",
  ];
const navigation = useNavigation();

  const fields = [
    { key: "houseFacing", label: "House Facing", value: houseFacing, setValue: setHouseFacing },
    { key: "masterBedroom", label: "Master Bedroom", value: masterBedroom, setValue: setMasterBedroom },
    { key: "childrenBedroom", label: "Children Bedroom", value: childrenBedroom, setValue: setChildrenBedroom },
    { key: "livingRoom", label: "Living Room", value: livingRoom, setValue: setLivingRoom },
    { key: "kitchenRoom", label: "Kitchen Room", value: kitchenRoom, setValue: setKitchenRoom },
    { key: "poojaRoom", label: "Pooja Room", value: poojaRoom, setValue: setPoojaRoom },
    { key: "balcony", label: "Balcony", value: balcony, setValue: setBalcony },
  ];

  const [alertVisible, setAlertVisible] = useState(false);

const handleUpload = () => {
  setAlertVisible(true);
};

  const takePhoto = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getCameraPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to grant camera permissions to use this feature. Please go to your device settings and enable them for this app."
        );
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const pickFromGallery = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to grant access to your photo library to use this feature. Please go to your device settings and enable them for this app."
        );
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
        setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return ( 
    <SafeAreaView className="flex-1 bg-white">
      <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
     <ScrollView>
    
        <CustomPickerAlert
            visible={pickerAlertVisible}
            onClose={() => setPickerAlertVisible(false)}
            onCameraPress={takePhoto}
            onGalleryPress={pickFromGallery}
        />
       
       
      {/* Header */}
     <View className="flex-row items-center mt-7 mb-4">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/home")}
                className="p-2"
                accessibilityRole="button"
              >
                <Image
                  source={require("../../../../assets/arrow.png")}
                  style={{ width: 20, height: 20, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              <View className="ml-2">
                <Text className="text-[16px]  font-semibold">
                  Upload Your Property
                </Text>
                <Text className="text-[12px]  text-[#00000066] ">
                  Add your property details
                </Text>
              </View>
            </View>
    
     
        {/* Property Details Card */}
        <View className="border justify-between rounded-xl border-gray-300 shadow-sm bg-white m-5">
          <View className="mt-5 px-3 flex-row justify-between">
            <Text className="font-semibold text-left">Property Details</Text>
            <Text style={{ color: "#22C55E" }}>View Guidelines</Text>
          </View>
          {/* Camera */}
          <View className="bg-[#D9D9D91C] p-4">
            <TouchableOpacity
              onPress={pickImage}
              className="border-2 border-dashed border-gray-300 mx-8 rounded-xl mt-4 p-6 items-center mb-5"
            >
              <Ionicons name="camera-outline" size={40} color="#888" />
              <Text className="text-gray-500 mt-2 text-left">Add Photos or Videos</Text>
            </TouchableOpacity>
            {images.length > 0 && (
                <FlatList
                    data={images}
                    horizontal
                    renderItem={({ item, index }) => (
                        <View style={{ position: 'relative', marginRight: 10 }}>
                            <Image
                                source={{ uri: item }}
                                className="w-48 h-48 mt-2 rounded-lg"
                            />
                            <TouchableOpacity
                                onPress={() => removeImage(index)}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    borderRadius: 15,
                                    padding: 5,
                                }}
                            >
                                <Ionicons name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
          </View>
        </View>

        {/* Conditional Content */}
        {constructionStatus === "Ready" ? (
          <View>
            {/* Basic Details, Ownership, Price, Location, Description */}
           
          <View className="border mt-1 overflow-hidden rounded-xl border-gray-300 shadow-sm bg-white m-5 p-5">
              <Text className="mt-3 mb-4 font-bold">Basic Details</Text>
              {/* Title */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Property Title</Text>
            <TextInput
  placeholder="Surya Teja Apartments"
  placeholderTextColor="#9CA3AF"
  className="bg-gray-100 rounded-lg p-3 mb-4 text-gray-800"
  value={propertyTitle}
  onChangeText={setPropertyTitle}
/>

                  <View className="px-1">
      <Text className="text-gray-500 font-semibold mb-2">
  Property Type
</Text>

<TouchableOpacity
  onPress={() => setVisible(visible === "propertyType" ? null : "propertyType")}
  className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
>
  <Text className="text-gray-800 text-left">
    {propertyType || "House"}
  </Text>
  <Ionicons name="chevron-down" size={24} color="#888" />
</TouchableOpacity>
{visible === "propertyType" && (
  <View
    className="bg-white rounded-lg shadow-lg -mt-3 mb-4"
    style={{ borderWidth: 1, borderColor: "#0000001A" }}
  >
    {["House", "Site/Plot", "Commercial", "Resort"].map((type) => (
      <TouchableOpacity
        key={type}
        onPress={() => {
          setPropertyType(type);
          setVisible(null);
          
          // Navigate based on the selected type
          if (type === "House") {
            // Already on the correct screen, do nothing.
          } else if (type === "Site/Plot") {
            router.push({
              pathname: "/home/screens/UploadScreens/SiteUpload",
              params: { 
                images: JSON.stringify(images),
                propertyTitle: propertyTitle 
              },
            });
          } else if (type === "Commercial") {
            router.push({
              pathname: "/home/screens/UploadScreens/CommercialUpload",
              params: { 
                images: JSON.stringify(images),
                propertyTitle: propertyTitle 
              },
            });
          } else {
            router.push({
              pathname: "/home/screens/UploadScreens/ResortUpload",
              params: { 
                images: JSON.stringify(images),
                propertyTitle: propertyTitle 
              },
            });
          }
        }}
        className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"}`}
      >
        <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>{type}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

    </View>


              {/* Floors & Area */}
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">No. of Floors</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Area (sqft)</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
              </View>

              {/* Bedrooms & Bathrooms */}
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Bedrooms</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Bathrooms</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
              </View>
           <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Balcony</Text>
                  <TextInput
                    placeholder="0"
                    className="bg-[#D9D9D91C] border-gray-400  rounded-xl p-3 text-gray-800 text-left"
                  />
            </View>
            <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Floor Details</Text>
                  <TextInput
                    placeholder=""
                    className=" bg-[#D9D9D91C]  rounded-lg p-3 text-gray-800 text-left"
                  />
            </View>
              {/* Construction Status Buttons */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Availability Status</Text>
              <View className="flex-row justify-center mt-4 mb-6">
                <TouchableOpacity
                  onPress={() => setConstructionStatus("Ready")}
                  className={`px-4 py-2 border rounded-full mx-2 ${
                    constructionStatus === "Ready" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                  }`}
                >
                  <Text className={`font-medium ${constructionStatus === "Ready" ? "text-green-600" : "text-gray-600"} text-left`}>
                    Ready to Move
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setConstructionStatus("Under")}
                  className={`px-4 py-2 border rounded-full mx-2 ${
                    constructionStatus === "Under" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                  }`}
                >
                  <Text className={`font-medium ${constructionStatus === "Under" ? "text-green-600" : "text-gray-600"} text-left`}>
                    Under Construction
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Age */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Age of Property</Text>
              <View className="flex-row flex-wrap gap-3 mb-4">
                {options.map((option) => {
                  const isSelected = selectedAge === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedAge(option)}
                      className={`px-4 py-2 rounded-full border ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
                    >
                      <Text className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-700"} text-left`}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Ownership */}
              <Text className="text-gray-500 text-base font-semibold mb-2 text-left">Ownership</Text>
              <View className="flex-row flex-wrap gap-3 mb-4">
                {ownershipOptions.map((option) => {
                  const isSelected = selectedOwnership === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedOwnership(option)}
                      className={`px-4 py-2 rounded-full border ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
                    >
                      <Text className={`text-sm ${isSelected ? "text-green-600 font-semibold" : "text-gray-700"} text-left`}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price Placeholder */}
              <View className="mt-2">
                <Text className="text-gray-500 font-semibold mb-2 text-left">Price Details</Text>
                <TextInput
                  placeholder="₹ Expected Price"
                  keyboardType="numeric"
                  className="border  border-gray-300 rounded-lg bg-[#F9F9F9] p-3 mb-3 text-gray-800 text-left"
                />
              </View>
              <View className="flex-col gap-2 mb-2">
               {["All inclusive price", "Price Negotiable", "Tax and Govt.charges excluded"].map((item) => {
  const isSelected = selectedPrices.includes(item);
  return (
    <TouchableOpacity
      key={item}
      onPress={() => {
        if (isSelected) {
          setSelectedPrices(selectedPrices.filter((i) => i !== item));
        } else {
          setSelectedPrices([...selectedPrices, item]);
        }
      }}
      className="flex-row items-center gap-2"
    >
      <View
        className={`w-5 h-5 border rounded-sm items-center justify-center ${
          isSelected ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
        }`}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
      </View>
      <Text className="text-gray-700 text-left">{item}</Text>
    </TouchableOpacity>
  );
})}

                <TouchableOpacity>
                  <Text className="text-[#22C55E] font-semibold text-left">+ Add more pricing details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Location */}
            <View className="border border-gray-300 rounded-lg bg-white ml-5 mt-5 mr-4 p-5">
              <Text className="text-gray-500 font-semibold mb-2 text-left">Location</Text>
              <View className="flex-row items-center bg-[#D9D9D91C] rounded-lg p-3 mb-4">
                <Ionicons name="location-outline" size={20} color="#22C55E" />
                <TextInput
                  placeholder="Enter Property Location"
                  placeholderTextColor="#888"
                  className="flex-1 ml-2 text-gray-800 text-left"
                />
              </View>
            </View>

            {/* Description */}
            <View className="border border-gray-300 rounded-lg bg-white ml-5 mr-4 mt-5 p-5">
              <Text className="text-gray-500 font-semibold mb-2 text-left">Description</Text>
              <View className="border border-gray-300 rounded-xl mb-4">
                <TextInput
                  placeholder="Describe your property ........"
                  placeholderTextColor="#888"
                  className="w-full p-3 text-gray-800 text-left"
                />
              </View>
            </View>

        {/* Other rooms */}
<View className="bg-white rounded-xl border border-gray-200 p-4 m-3 ml-5 mr-4">
  {/* Other Rooms */}
  <Text className="text-lg font-semibold text-gray-800">
    Other Rooms <Text className="text-gray-400 text-sm">(Optional)</Text>
  </Text>
  <View className="flex-row flex-wrap gap-2 mt-2">
    {["Pooja Room", "Study Room", "Servant Room", "Others"].map((room) => (
      <TouchableOpacity key={room} className="border border-gray-300 rounded-full px-4 py-2">
        <Text className="text-gray-600">+ {room}</Text>
      </TouchableOpacity>
    ))}
  </View>

  {/* Furnishing */}
<Text className="text-lg font-semibold text-gray-800 mt-5">
  Furnishing <Text className="text-gray-400 text-sm">(Optional)</Text>
</Text>

<View className="flex-row gap-2 mt-2">
 {["Unfurnished", "Semi-furnished", "Furnished"].map((type) => (
  <TouchableOpacity
    key={type}
    onPress={() => {
      if (type === "Furnished") {
        navigation.navigate("AddFurnishingsScreen", {
          selectedFurnishing: type,
        });
      } else {
        setFurnishing(type);
      }
    }}
    className={`rounded-full px-4 py-2 border ${
      furnishing === type ? "border-green-500 bg-green-50" : "border-gray-300"
    }`}
  >
    <Text
      className={`${
        furnishing === type ? "text-green-700" : "text-gray-600"
      }`}
    >
      {type}
    </Text>
  </TouchableOpacity>
))}

</View>



  {/* Reserved Parking */}
  <Text className="text-lg font-semibold text-gray-800 mt-5">
    Reserved Parking <Text className="text-gray-400 text-sm">(Optional)</Text>
  </Text>
  <View className="mt-2 space-y-3">
    {[
      { label: "Covered Parking", count: covered, setCount: setCovered },
      { label: "Open Parking", count: open, setCount: setOpen },
    ].map((item) => (
      <View key={item.label} className="flex-row items-center justify-between">
        <Text className="text-gray-700">{item.label}</Text>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => item.setCount(Math.max(0, item.count - 1))}
            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
          >
            <Text className="text-gray-500 text-lg">-</Text>
          </TouchableOpacity>
          <Text className="text-gray-800 text-base w-4 text-center">{item.count}</Text>
          <TouchableOpacity
            onPress={() => item.setCount(item.count + 1)}
            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
          >
            <Text className="text-gray-500 text-lg">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </View>
</View>
            <View className="bg-white rounded-xl border  border-gray-300 p-4 m-3 ml-5 mr-4">
              <View className="flex-row items-center mb-3 justify-between">
                <Text
  className="text-lg font-semibold text-gray-800 text-left"
  numberOfLines={1}
  ellipsizeMode="tail"
>
  Vaasthu Details
</Text>

                <Image source={require("../../../../assets/vastu.png")}style={{ width: 30, height: 30 }} />
              </View>
              {fields.map((item) => (
                <View key={item.key} className="mb-4">
                  <Text className="text-gray-700 font-semibold mb-1 text-left">{item.label}</Text>
                  <TouchableOpacity
                    onPress={() => setVisible(item.key)}
                    className="flex-row items-center justify-between border border-gray-300 rounded-xl p-3 bg-[#F9FAFB]"
                  >
                    <Text className="text-gray-800 text-left">{item.value}</Text>
                    <Ionicons name="chevron-down" size={20} color="#555" />
                  </TouchableOpacity>
                  {/* Dropdown Modal */}
                  <Modal visible={visible === item.key} transparent animationType="fade">
                    <TouchableOpacity
                      activeOpacity={1}
                      onPressOut={() => setVisible(null)}
                      className="flex-1 bg-black/30 justify-center items-center"
                    >
                      <View className="bg-white w-[85%] rounded-2xl p-3 shadow-lg">
                        <FlatList
                          data={directions}
                          keyExtractor={(dir) => dir}
                          renderItem={({ item: direction }) => (
                            <TouchableOpacity
                              onPress={() => {
                                item.setValue(direction);
                                setVisible(null);
                              }}
                              className="p-3 border-b border-gray-200"
                            >
                              <Text className="text-gray-800 text-left">{direction}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {/* Basic Details for Under Construction */}
            <View className="border mt-1 overflow-hidden rounded-xl border-gray-300 shadow-sm bg-white m-5 p-5">
              <Text className="mt-3 mb-4 font-bold">Basic Details</Text>
              {/* Title */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Property Title</Text>
              <TextInput
  placeholder="Surya Teja Apartments"
  placeholderTextColor="#9CA3AF" // softer gray text
  className="bg-gray-100 rounded-lg p-3 mb-4 text-gray-800"
/>


              {/* Type */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Property Type</Text>
              <View className="relative mb-4">
                <TextInput
                  placeholder="House"
                  className="bg-[#D9D9D91C] rounded-lg p-3 pr-12 text-gray-800 text-left"
                />
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color="#888"
                  style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -12 }] }}
                />
              </View>

              {/* Floors & Area */}
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">No. of Floors</Text>
                  <TextInput
                    placeholder="0"
                    className=" border-gray-300 rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Area (sqft)</Text>
                  <TextInput
                    placeholder="0"
                    className="  rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
              </View>

              {/* Bedrooms & Bathrooms */}
              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Bedrooms</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-semibold mb-2 text-left">Bathrooms</Text>
                  <TextInput
                    placeholder="0"
                    className=" bg-[#D9D9D91C] rounded-lg p-3 text-gray-800 text-left"
                  />
                </View>
              </View>

              {/* Construction Status Buttons */}
              <Text className="text-gray-500 font-semibold mb-2 text-left">Availability Status</Text>
              <View className="flex-row justify-center mt-4 mb-6">
                <TouchableOpacity
                  onPress={() => setConstructionStatus("Ready")}
                  className={`px-4 py-2 border rounded-full mx-2 ${
                    constructionStatus === "Ready" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                  }`}
                >
                  <Text className={`font-medium ${constructionStatus === "Ready" ? "text-green-600" : "text-gray-600"} text-left`}>
                    Ready to Move
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setConstructionStatus("Under")}
                  className={`px-4 py-2 border rounded-full mx-2 ${
                    constructionStatus === "Under" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                  }`}
                >
                  <Text className={`font-medium ${constructionStatus === "Under" ? "text-green-600" : "text-gray-600"} text-left`}>
                    Under Construction
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Possession */}
              <View>
                <Text className="font-semibold text-gray-500 mb-2">Possession By</Text>
               
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-[#F9FAFB]"
                  onPress={() => setVisible(true)}
                >
                  <Text className="text-base text-gray-700">{possessionBy || "Expected By"}</Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                <Modal visible={visible} transparent animationType="slide">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setVisible(false)}
                    className="flex-1 justify-center items-center bg-black/40"
                  >
                    <View className="w-[90%] max-h-[50%] bg-white rounded-xl p-2 shadow-md">
                      <FlatList
                        data={[
                          
                          "Immediate",
                          "Within 3 months",
                          "Within 6 months",
                          "By 2026",
                          "By 2027",
                          "By 2028",
                          "By 2029",
                          "By 2030",
                        ]}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
  className={`p-3 border-b border-gray-200 ${item === "Immediate" ? "bg-[#22C55E]" : ""}`}
  onPress={() => {
    setPossessionBy(item);
    setVisible(false);
  }}
>
  <Text className={`text-base ${item === "Immediate" ? "text-white font-medium" : "text-gray-700"}`}>
    {item}
  </Text>
</TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </View>

            {/* Location */}
            <View className="border border-gray-300 rounded-lg bg-white ml-2 mt-5 p-5">
              <Text className="text-gray-500 font-semibold mb-2 text-left">Location</Text>
              <View className="flex-row items-center bg-[#D9D9D91C] rounded-lg p-3 mb-4">
                <Ionicons name="location-outline" size={20} color="#22C55E" />
                <TextInput
                  placeholder="Enter Property Location"
                  placeholderTextColor="#888"
                  className="flex-1 ml-2 text-gray-800 text-left"
                />
              </View>
            </View>

            {/* Description */}
            <View className="border border-gray-300 rounded-lg bg-white ml-2 mt-5 p-5">
              <Text className="text-gray-500 font-semibold mb-2 text-left">Description</Text>
              <View className="border border-gray-300 rounded-xl mb-4">
                <TextInput
                  placeholder="Describe your property ........"
                  placeholderTextColor="#888"
                  className="w-full p-3 text-gray-800 text-left"
                />
              </View>
            </View>
          </View>
        )}

        {/* BUTTON */}
     <View
       style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16,
         gap:12
        }}
       className="space-x-3  mr-4"
     >
          {/* Cancel Button */}
          <TouchableOpacity
              style={{
                backgroundColor: "#E5E7EB",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
              onPress={() => {
               router.push("/(tabs)/home")
              }}
            >
              <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          
            {/* Upload Property Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#22C55E",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
              onPress={() => setAlertVisible(true)}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                Upload Property
              </Text>
            </TouchableOpacity>
        </View>

        </ScrollView>   
    </SafeAreaView>
    
  );
}