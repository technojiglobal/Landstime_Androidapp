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
import TopAlert from "../../TopAlert";


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

const RoundOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-8 h-8 rounded-full items-center mx-2 justify-center"
    style={{
      borderWidth: 1,
      borderColor: selected ? "#22C55E" : "#0000001A",
      backgroundColor: selected ? "#22C55E17" : "transparent",
    }}
  >
    <Text className={`text-sm ${selected ? "text-green-700 font-semibold" : "text-[rgba(0,0,0,0.6)]"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);


export default function PropertyFormScreen() {
    const [plotKinds, setplotKinds] = useState(['commercial Land/Inst.Land']);
    const plotKindPills = ['commercial Land/Inst.Land', 'Agricultural/Farm Land', 'Industrial Lands/Plots'];
    const [alertVisible, setAlertVisible] = useState(false);
    const [area, setArea] = useState('');
      const [unit, setUnit] = useState('sqft');
      const [location, setLocation] = useState('');
      const [propertyLength, setpropertyLength] = useState('');
      const [propertyBreadth, setpropertyBreadth] = useState('');
      const [width,setWidth]=useState('');
      const [unit1,setUnit1]=useState('feet');
      const[opensides,setOpensides]=useState("");
      const[isconstruction,setIsconstruction]=useState("");
       const constructiontype = ["+ Shed", "+ Room(s)", "+ Washroom","+ Other"];
       const [selectedconstructiontype,setselectedconstructiontype]=useState("");
       const propertyfacing = ["North", "South", "East","West","North-West","South-East","South-West"];
       const[seletedpropertyfacing,setselectedpropertyfacing]=useState("");
       const[visible,setVisible]=useState("");
       const[ possessionBy,setPossessionBy]=useState("");
       const ownership=["Freehold","Leasehold","Co-operative Society","Power of Attorney"];
       const [selectedownership,setselectedownership]=useState("");
       const [approved,setapproved]=useState("");
       const [approvalindustry,setapprovalindustry]=useState("");
       const industrytype=[  "Automobiles",  "Biotechnology", "Capital Goods",  "Chemicals","Construction","Defence and Aerospace Manufacturing",
                               "Electronics Hardware",  "Engineering",  "Food Processing",   "Gems and Jewellery", 
                                   "Handicrafts",  "IT and ITeS","Leather","Manufacturing","Medical devices",  "Metals",  "Mixed",
                                 "Petrolenum",  "Pharamaceuticals", "Renewable Energy","Software","Textiles"]
       const [price,setprice]=useState("");
       const [ selectedPrices,setselectedPrices]=useState("");
        const [isrented,setisrented]=useState("");
        const [rent,setrent]=useState("");
        const [lease,setlease]=useState("");
        const [description,setDescription]=useState("");
        const amenities=["+ Service/Goods Lift","+ Water Storage","+ Water Disposal","+ ATM","+ Maintenance Staff","+ Rain water harvesting",
                           "+ Security/Fire Alarm","+ Near Bank","+ Security Personnel","+ Visitor Parking ","+ Lift(s) "
                         ]
        const locationadvantages=["+ Close to Metro Station","+ Close to School","+ Close to Hospital",
                                   "+ Close to Market","+ Close to Railway Station","+ Close to Airport","+ Close to Mall","+ Close to Highway"

                                    ]
      return (
        <View className="flex-1 bg-gray-50">
          <TopAlert visible={alertVisible} onHide={() => setAlertVisible(false)} />
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
            showsVerticalScrollIndicator={false}
          >


              <Text className="text-[15px] text-[#00000099] font-bold mb-2">What kind of plot/land is it ?</Text>
                      <View className="flex-row flex-wrap">
                        {plotKindPills.map((p) => (
                          <PillButton
                            key={p}
                            label={p}
                            selected={plotKinds.includes(p)}
                            onPress={() => setplotKinds([p])}
                          />
                        ))}
                      </View>

                        <View
                                className="bg-white rounded-lg p-4 mb-4"
                                style={{ borderWidth: 1, borderColor: "#0000001A" }}
                              >
                                <Text className="text-[15px] text-black-400 mb-3 font-20">Location</Text>
                                <View
                                  className="flex-row items-center rounded-md p-3 mb-5"
                                  style={{
                                    backgroundColor: "#D9D9D91C",
                                    borderWidth: 1,
                                    borderColor: "#0000001A",
                                  }}
                                >
                                  <Image
                                    source={require("../../../../../../assets/location.png")}
                                    style={{ width: 18, height: 18, marginRight: 8 }}
                                  />
                                  <TextInput placeholder="Enter Property Location" className="flex-1" value={location} onChangeText={setLocation} />
                                </View>
                    </View>
                 <View
                          className="bg-white rounded-lg p-4 mb-6"
                          style={{ borderWidth: 1, borderColor: "#0000001A" }}
                        >
                           <Text className="text-[14px] font-medium text-black-300 mb-3">
                            Area
                          </Text>
                          <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            <TextInput
                              placeholder="Carpet Area"
                              value={area}
                              onChangeText={setArea}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
                            <View style={{ width: 100 }}>
                              <Picker
                                selectedValue={unit}
                                onValueChange={(v) => setUnit(v)}
                                mode="dropdown"
                                style={{ height: 52, width: "100%",backgroundColor:"#D9D9D91C" }}
                              >
                                 
                                <Picker.Item label="sqft" value="sqft" />
                                <Picker.Item label="sqm" value="sqm" />
                                <Picker.Item label="acre" value="acre" />
                              </Picker>
                            </View>
                          </View>
                           <Text className="text-[14px] font-medium text-black-300 mb-3">
                           Property Dimensions (optional)
                          </Text>
                           <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            <TextInput
                              placeholder="Length of plot(in Ft.)"
                              value={propertyLength}
                              onChangeText={setpropertyLength}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                             </View>
                               <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            <TextInput
                              placeholder="Breadth of plot(in Ft.)"
                              value={propertyBreadth}
                              onChangeText={setpropertyBreadth}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                           </View>
                           <Text className="text-[14px] font-medium text-black-300 mb-3">
                           Width of facing road
                          </Text>
                          <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            <TextInput
                              placeholder="Enter the width"
                              value={width}
                              onChangeText={setWidth}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                            <View style={{ width: 1, backgroundColor: "#0000001A", height: "60%" }} />
                            <View style={{ width: 100 }}>
                              <Picker
                                selectedValue={unit1}
                                onValueChange={(v) => setUnit1(v)}
                                mode="dropdown"
                                style={{ height: 52, width: "100%" ,backgroundColor:"#D9D9D91C"}}
                              >
                                <Picker.Item label="feet" value="feet" />
                                <Picker.Item label="sqft" value="sqft" />
                                <Picker.Item label="sqm" value="sqm" />
                                <Picker.Item label="acre" value="acre" />
                              </Picker>
                            </View>
                          </View>
                           <Text className="text-[14px] font-medium text-black-300 mb-3">
                          No.of open sides
                          </Text>
                           <View className="flex-row mb-3">
                            {['1', '2', '3', '4+'].map((o) => (
                             <RoundOption key={o} label={o} selected={opensides === o} onPress={() => setOpensides(o)} />
                             ))}
                         </View>
                         <Text className="text-[14px] font-medium text-black-300 mb-3">
                         Any construction done on this property?
                          </Text>
                           <View className="flex-row ml-4">
                                  {["  Yes  ", " No "].map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={isconstruction === option}
                                      onPress={() => setIsconstruction(option)}
                                       className="w-24" 
                                    />
                                  ))}
                                </View>
                               <Text className="text-[14px] font-medium text-black-300 mb-3">
                        What type of construction has been done ?
                          </Text>
                           <View className="flex-row flex-wrap">
                                  {constructiontype.map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={selectedconstructiontype === option}
                                      onPress={() => setselectedconstructiontype(option)}
                                    />
                                  ))}
                                </View>
                                   <Text className="text-[14px] font-medium text-black-300 mb-3">
                        Property Facing
                          </Text>
                           <View className="flex-row flex-wrap">
                                  {propertyfacing.map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={seletedpropertyfacing === option}
                                      onPress={() => setselectedpropertyfacing(option)}
                                    />
                                  ))}
                                </View>
                         <Text className="text-[14px] font-medium text-black-300 mb-3">
                                 Possession By
                          </Text>
                         
                             <TouchableOpacity
                               onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
                               className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                             >
                               <Text className="text-gray-800 text-left">
                                 {possessionBy || "Expected By"}
                               </Text>
                               <Ionicons name="chevron-down" size={24} color="#888" />
                             </TouchableOpacity>
                             {visible === "possessionBy" && (
                               <View
                                 className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
                                 style={{ borderWidth: 1, borderColor: "#0000001A" }}
                               >
                                 {[
                                   "Immediate",
                                   "1-3 months",
                                   "3-6 months",
                                   "6+ months",
                                   "Ready to Move",
                                   "Other",
                                 ].map((item) => (
                                   <TouchableOpacity
                                     key={item}
                                     onPress={() => {
                                       setPossessionBy(item);
                                       setVisible(null);
                                     }}
                                     className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
                                   >
                                     <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
                                   </TouchableOpacity>
                                 ))}
                               </View>
                             )}
                              <Text className="text-[14px] font-medium text-black-300 mb-3">
                                Ownership
                          </Text>     
                            <View className="flex-row flex-wrap">
                                  {ownership.map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={selectedownership === option}
                                      onPress={() => setselectedownership(option)}
                                    />
                                  ))}
                                </View>
                                 <Text className="text-[14px] font-medium text-black-300 mb-3">
                                Which authority the property is approved by?(optional)
                          </Text>
                            <View className="flex-row flex-wrap">
                                  {["+ Local Authority"].map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={approved === option}
                                      onPress={() => setapproved(option)}
                                    />
                                  ))}
                                </View>   

                             <Text className="text-[14px] font-medium text-black-300 mb-3">
                                 Approved for industry type?(optional)
                          </Text>
                         
                             <TouchableOpacity
                               onPress={() => setVisible(visible === "possessionBy" ? null : "possessionBy")}
                               className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300 mb-3"
                             >
                               <Text className="text-gray-800 text-left">
                                 {approvalindustry || "Select Industry type"}
                               </Text>
                               <Ionicons name="chevron-down" size={24} color="#888" />
                             </TouchableOpacity>
                             {visible === "possessionBy" && (
                               <View
                                 className="bg-white rounded-lg shadow-lg -mt-4 mb-4"
                                 style={{ borderWidth: 1, borderColor: "#0000001A" }}
                               >
                                 {
                                 industrytype.map((item) => (
                                   <TouchableOpacity
                                     key={item}
                                     onPress={() => {
                                       setapprovalindustry(item);
                                       setVisible(null);
                                     }}
                                     className={`p-4 border-b border-gray-200 ${possessionBy === item ? "bg-green-500" : "bg-white"}`}
                                   >
                                     <Text className={`${possessionBy === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
                                   </TouchableOpacity>
                                 ))}
                               </View>
                             )}  
                              <Text className="text-[14px] font-medium text-black-300 mb-3">
                                   Expected Price Details
                          </Text>
                                <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            
                            <TextInput
                              placeholder="₹ Expected Price"
                              value={price}
                                keyboardType="numeric"
                              onChangeText={setprice}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                           </View>
                             <View className="flex-col gap-2 mb-2">
                                            {["Price Negotiable", "Tax and Govt.charges excluded",].map((item) => {
                               const isSelected = selectedPrices.includes(item);
                               return (
                                 <TouchableOpacity
                                   key={item}
                                   onPress={() => {
                                     if (isSelected) {
                                       setselectedPrices(selectedPrices.filter((i) => i !== item));
                                     } else {
                                       setselectedPrices([...selectedPrices, item]);
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
                               <Text className="text-[14px] font-medium text-black-300 mb-3">
                                  Is it Pre-leased/ Pre-Reneted?
                          </Text>
                           <View className="flex-row ml-4">
                                  {["  Yes  ", " No "].map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={isrented === option}
                                      onPress={() => setisrented(option)}
                                       className="w-24" 
                                    />
                                  ))}
                                </View>
                                 <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            
                            <TextInput
                              placeholder="₹ Current rent per month"
                              value={rent}
                                keyboardType="numeric"
                              onChangeText={setrent}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                           </View>

                                  <View
                            className="flex-row items-center mb-3 rounded-md"
                            style={{
                              borderWidth: 1,
                              borderColor: "#0000001A",
                              backgroundColor: "#D9D9D91C",
                              height: 52,
                            }}
                          >
                            
                            <TextInput
                              placeholder="Lease tenure in years"
                              value={lease}
                                keyboardType="numeric"
                              onChangeText={setlease}
                              className="flex-1 px-3"
                              style={{ height: 52 }}
                            />
                           </View>   
                            <Text className="text-[14px] font-medium text-black-300 mb-3">
                                 Describe your property
                          </Text>     
                                  <TextInput
                                          placeholder="Write here what makes your property unique"
                                          value={description}
                                          onChangeText={setDescription}
                                          multiline
                                          numberOfLines={4}
                                          textAlignVertical="top"
                                          className="rounded-md p-3 mb-3"
                                          style={{ borderWidth: 1, borderColor: "#0000001A", height: 108, paddingTop: 10 }}
                                        />
                       
                         <Text className="text-[14px] font-medium text-black-300 mb-3">
                                Amenities
                          </Text>     
                            <View className="flex-row flex-wrap">
                                  {amenities.map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={selectedownership === option}
                                      onPress={() => setselectedownership(option)}
                                    />
                                  ))}
                                </View>
                                <Text className="text-[14px] font-medium text-black-300 mb-3">
                               Location Advantages
                          </Text>     
                            <View className="flex-row flex-wrap">
                                  {locationadvantages.map((option) => (
                                    <PillButton
                                      key={option}
                                      label={option}
                                      selected={selectedownership === option}
                                      onPress={() => setselectedownership(option)}
                                    />
                                  ))}
                                </View>
                                 </View>

          </ScrollView>
          </View>
      )
}