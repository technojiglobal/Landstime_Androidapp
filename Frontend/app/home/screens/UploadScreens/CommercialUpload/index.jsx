import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import TopAlert from "../TopAlert"
import { useLocalSearchParams } from "expo-router";

import Office from "./Components/Office"
import Plot from "./Components/Plot"
import Retail from "./Components/Retail"
import Industry from "./Components/Industry"
import Storage from "./Components/Storage"
import Hospitality from "./Components/Hospitality";
import Other from "./Components/Other";
// Pill Button Component
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="px-3 py-1 h-[23px] rounded-full mr-2 mb-4 items-center justify-center"
    style={{
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#0000001A",
      backgroundColor: selected ? "#22C55E17" : "white",
    }}
  >
    <Text
      className="text-[10px]"
      style={{ color: selected ? "#22C55E" : "#00000099" }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Checkbox Component
const Checkbox = ({ label, selected, onPress }) => (
  <Pressable onPress={onPress} className="flex-row items-center mb-2">
    <View
      className="w-4 h-4 mr-2 mt-3 rounded-sm items-center justify-center"
      style={{
        borderWidth: 1,
        borderColor: selected ? "#22C55E" : "#0000001A",
        backgroundColor: selected ? "#22C55E" : "white",
      }}
    >
      {selected && <Text style={{ color: "white", fontWeight: 'bold' }}>✓</Text>}
    </View>
    <Text className="text-[11px] text-[#00000099]">{label}</Text>
  </Pressable>
);

// Round Option Component
const RoundOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-8 h-8 rounded-full items-center mx-2 justify-center"
    style={{ borderWidth: 1, borderColor: selected ? '#22C55E' : '#0000001A', backgroundColor: selected ? '#22C55E17' : 'transparent' }}
  >
    <Text style={{ fontSize: 12, fontWeight: selected ? '600' : '400', color: selected ? '#22C55E' : 'rgba(0,0,0,0.6)' }}>
      {label}
    </Text>
  </TouchableOpacity>
);
  

export default function PropertyFormScreen() {
     const params = useLocalSearchParams();
   const [propertyTitle, setPropertyTitle] = useState(params.propertyTitle || "");
  const [propertyType, setPropertyType] = useState('Commercial');
  const [image, setImage] = useState(params.image || null);
  const [visible, setVisible] = useState(null);

  const [selectedTypes, setSelectedTypes] = useState(['Office']);
  const typePills = ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other'];

  
  const officeKindPills = ['Ready to move office space', 'Bare shell office space', 'Co-working office space'];
const [selectedType, setSelectedType] = useState("Office"); // Only one selected
const [officeKinds, setOfficeKinds] = useState(['Ready to move office space']);
const [retailKinds, setRetailKinds] = useState([]);
const [plotKinds, setPlotKinds] = useState([]);
  const [location, setLocation] = useState('');
  const [locatedInside, setLocatedInside] = useState('');
  const [zoneType, setZoneType] = useState('');

  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('sqft');
  const [carpetArea, setCarpetArea] = useState('');
  const [carpetUnit, setCarpetUnit] = useState('sqft');

  const [cabins, setCabins] = useState('');
  const [meetingRooms, setMeetingRooms] = useState('');
  const [seats, setSeats] = useState('');

  const [conferenceSelected, setConferenceSelected] = useState(null);
  const conferenceOptions = ['1', '2', '3', '4+'];

  const [publicWashroom, setPublicWashroom] = useState(null);
  const [privateWashroom, setPrivateWashroom] = useState(null);
  const [receptionArea, setReceptionArea] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [washroomType, setWashroomType] = useState(null);

  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [fireMeasures, setFireMeasures] = useState([]);
  const fireOptions = ['Fire Extinguisher', 'Fire Sensors', 'Sprinklers', 'Fire Hose'];

  const [totalFloors, setTotalFloors] = useState('');
  const [stairCase, setStairCase] = useState(null);
  const stairOptions = ['1', '2', '3', '4+'];
  const [lift, setLift] = useState('');

  const [parking, setParking] = useState('');
  const [availability, setAvailability] = useState('');
  const ownershipOptions = ['Freehold', 'Leasehold', 'Company Owned', 'Other'];
  const [ownership, setOwnership] = useState('');

  const [expectedPrice, setExpectedPrice] = useState('');
  const [allInclusive, setAllInclusive] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [preLeased, setPreLeased] = useState(null);
  const [nocCertified, setNocCertified] = useState(null);
  const [occupancyCertified, setOccupancyCertified] = useState(null);
  const [prevUsedFor, setPrevUsedFor] = useState('Commercial');
  const prevUsedForOptions = ['Commercial', 'Residential', 'Warehouse'];

  const [describeProperty, setDescribeProperty] = useState('');
  const amenityOptions = ['+Maintenance Staff','+Water Storage','+Water Disposal','+ATM','+Shopping Center','+Wheelchair Accessibility','+Cafeteria/Foodcourt','+DG Availability','+CCTV Surveillance','+Grocery shop','+Visitor Parking','+Power Backup','+Lift(s)'];
  const [amenities, setAmenities] = useState([]);
  const locationAdvantages = ['+Close to Metro Station','+Close to School','+Close to Hospital','+Close to Market','+Close to Railway Station','+Close to Airport','+Close to Mall','+Close to Highway'];
  const [locAdvantages, setLocAdvantages] = useState([]);

  
  const [alertVisible, setAlertVisible] = useState(false);

  const toggleArrayItem = (setter, array, value) => {
    if (array.includes(value)) setter(array.filter(item => item !== value));
    else setter([...array, value]);
  };

 const openCamera = async () => {
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
      setImage(result.assets[0].uri);
    }
  };
const router=useRouter();
  return (
     <View className="flex-1 bg-gray-50">
         <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
         <ScrollView
           contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
           showsVerticalScrollIndicator={false}
         >
           {/* Header */}
           <View className="flex-row items-center mt-7 mb-4">
             <TouchableOpacity
               onPress={() => router.push("/home/screens/UploadScreens/AddScreen")}
               className="p-2"
               accessibilityRole="button"
             >
               <Image
                source={require("../../../../../assets/arrow.png")}
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
           <View
             className="bg-white rounded-lg p-4 mb-4"
             style={{ borderWidth: 1, borderColor: "#0000001A" }}
           >
             <View className="flex-row justify-between items-center mb-2">
               <Text className="text-[15px] font-bold">Property Details</Text>
               <TouchableOpacity>
                 <Text className="text-[11px] text-[#22C55E]">View Guidelines</Text>
               </TouchableOpacity>
             </View>
   
             <TouchableOpacity
               onPress={openCamera}
               className="border-2 border-dashed border-gray-300 rounded-xl mt-4 p-6 items-center mb-5"
             >
               <Ionicons name="camera-outline" size={40} color="#888" />
               <Text className="text-gray-500 mt-2 text-left">
                 Add Photos or Videos
               </Text>
             </TouchableOpacity>
             {image && (
               <Image
                 source={{ uri: image }}
                 className="w-full h-48 -mt-2 mb-2 rounded-lg"
               />
             )}
           </View>
   
           {/* Basic Details */}
           <View
             className="bg-white rounded-lg p-4 mb-4"
             style={{ borderWidth: 1, borderColor: "#0000001A" }}
           >
             <Text className="text-[16px] font-bold mb-5">Basic Details</Text>
   
             <Text className="text-[15px] text-[#00000099] mb-2">Property Title</Text>
               <TextInput
       placeholder="Surya Teja Sites"
       className="rounded-md p-3 mb-3"
       style={{ borderWidth: 1, borderColor: "#0000001A", height:50, backgroundColor:"#D9D9D91C"}}
       value={propertyTitle}
       onChangeText={setPropertyTitle}
     />
   
        
                  <Text className="text-[15px] text-[#00000099] font-bold mb-2">Property Type</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setVisible(visible === "propertyType" ? null : "propertyType")
                    }
                    className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
                  >
                    <Text className="text-gray-800 text-left">
                      {propertyType || "House"}
                    </Text>
                    <Ionicons name="chevron-down" size={24} color="#888" />
                  </TouchableOpacity>
                  </View>
                 {visible === "propertyType" && (
          <View
            className="bg-white rounded-lg shadow-lg -mt-1 mb-4"
            style={{ borderWidth: 1, borderColor: "#0000001A" }}
          >
            {["House", "Site/Plot/Land", "Commercial", "Resort"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setPropertyType(type);
                  setVisible(null);
                  if (type === "House") {
                    router.push("/home/screens/UploadScreens/AddScreen");
                  } else if (type === "Site/Plot/Land") {
                    router.push("/home/screens/UploadScreens/SiteUpload");
                  } else if (type === "Commercial") {
                    // Already on this screen
                  } else {
                    router.push("/home/screens/UploadScreens/ResortUpload");
                  }
                }}
                className={`p-4 border-b border-gray-200 ${propertyType === type ? "bg-green-500" : "bg-white"}`}
              >
                <Text className={`${propertyType === type ? "text-white" : "text-gray-800"}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
 <Text className="text-[15px] text-[#00000099] font-bold mt-4 mb-2">
  Select Property Type
</Text>
<View className="flex-row flex-wrap mb-4">
  {typePills.map((p) => (
    <PillButton
      key={p}
      label={p}
      selected={selectedType === p}
      onPress={() => setSelectedType(p)} // Only one type active
    />
  ))}
</View>

{/* Conditional sub-options */}
{selectedType === "Office" && (
 <Office/>
)}
{selectedType === "Retail" && (
  <>
   <Retail />
    
  </>
)}

{selectedType === "Plot/Land" && (
  
     <Plot/>
  
)}
{selectedType === "Industry" && (
  
     <Industry/>
  
)}
{selectedType === "Storage" && (
  
     <Storage/>
  
)}
{selectedType === "Hospitality" && (
  
     <Hospitality/>
  
)}
{selectedType === "Other" && (
  
     <Other/>
  
)}
  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 12 }} className="space-x-3 ">
          <TouchableOpacity style={{ backgroundColor: "#E5E7EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }} onPress={() => { /* handle cancel action */ }}>
            <Text style={{ color: "black", fontWeight: "600", fontSize: 15 }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#22C55E", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }} onPress={() => setAlertVisible(true)}>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
              Upload Property
            </Text>
          </TouchableOpacity>
        </View>

                 
        </ScrollView>


        </View>
  )};