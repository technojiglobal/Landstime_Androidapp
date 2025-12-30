import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------- UI HELPERS ---------- */
const PillButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-1.5 rounded-full mr-2 mb-2 border ${selected
        ? "border-green-500 bg-green-50"
        : "border-gray-200 bg-white"
      }`}
  >
    <Text
      className={`text-xs ${selected ? "text-green-600" : "text-gray-500"
        }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center mb-3"
  >
    <View
      className={`w-4 h-4 mr-2 items-center justify-center border ${checked
          ? "border-green-500 bg-green-500"
          : "border-gray-300 bg-white"
        }`}
    >
      {checked && <Text className="text-white text-[10px]">✓</Text>}
    </View>
    <Text className="text-sm text-gray-600">{label}</Text>
  </TouchableOpacity>
);

export default function RetailNext() {
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [ownership, setOwnership] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);

  const [preLeased, setPreLeased] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [prevUsedFor, setPrevUsedFor] = useState("Commercial");
  const [showPrevUsed, setShowPrevUsed] = useState(false);

  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [locationAdvantages, setLocationAdvantages] = useState([]);

  /* ---------- OPTIONS ---------- */
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Co-operative Society",
    "Power of Attorney",
  ];

  const prevUsedOptions = ["Commercial", "Retail", "Warehouse"];

  const amenitiesOptions = [
    "+ Service/Goods Lift",
    "+ Maintenance Staff",
    "+ Water Storage",
    "+ ATM",
    "+ Water Disposal",
    "+ Rainwater Harvesting",
    "+ Security Fire Alarm",
    "+ Near Bank",
    "+ Visitor Parking",
    "+ Security Guard",
    "+ Lift(s)",
  ];

  const locationAdvOptions = [
    "+ Close to Metro Station",
    "+ Close to School",
    "+ Close to Hospital",
    "+ Close to Market",
    "+ Close to Railway Station",
    "+ Close to Airport",
    "+ Close to Mall",
    "+ Close to Highway",
  ];

  const toggleItem = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter(v => v !== value)
        : [...list, value]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-4">

        {/* HEADER */}
        <View className="flex-row items-center mt-6 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Image
              source={require("../../../../../../assets/arrow.png")}
              className="w-5 h-5"
            />
          </TouchableOpacity>

          <View className="ml-2">
            <Text className="text-base font-semibold">
              Upload Your Property
            </Text>
            <Text className="text-xs text-gray-500">
              Add your property details
            </Text>
          </View>
        </View>

        {/* ================= SINGLE CARD ================= */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4">

          {/* OWNERSHIP */}
          <Text className="font-semibold mb-2">Ownership</Text>
          <View className="flex-row flex-wrap mb-4">
            {ownershipOptions.map(opt => (
              <PillButton
                key={opt}
                label={opt}
                selected={ownership === opt}
                onPress={() => setOwnership(opt)}
              />
            ))}
          </View>

          {/* EXPECTED PRICE */}
          <Text className="font-semibold mb-2">
            Expected Price Details
          </Text>

          <TextInput
            placeholder="₹ Expected Price"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            keyboardType="numeric"
            className="border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm"
          />

          <Checkbox
            label="All inclusive price"
            checked={allInclusive}
            onPress={() => setAllInclusive(!allInclusive)}
          />
          <Checkbox
            label="Price negotiable"
            checked={negotiable}
            onPress={() => setNegotiable(!negotiable)}
          />
          <Checkbox
            label="Tax & govt. charges excluded"
            checked={taxExcluded}
            onPress={() => setTaxExcluded(!taxExcluded)}
          />
          <TouchableOpacity>
            <Text className="text-[#22C55E] text-sm mt-2">
              + Add more pricing details
            </Text>
          </TouchableOpacity>
          {/* PRE-LEASED */}
          <Text className="font-semibold mt-4 mb-2">
            Is it Pre-leased / Pre-rented?
          </Text>

          <View className="flex-row mb-2">
            <PillButton
              label="Yes"
              selected={preLeased === "Yes"}
              onPress={() => setPreLeased("Yes")}
            />
            <PillButton
              label="No"
              selected={preLeased === "No"}
              onPress={() => setPreLeased("No")}
            />
          </View>

          {preLeased === "Yes" && (
            <>
              <TextInput
                placeholder="Lease duration (eg: 5 years)"
                value={leaseDuration}
                onChangeText={setLeaseDuration}
                className="border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm"
              />
              <TextInput
                placeholder="₹ Monthly rent"
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                keyboardType="numeric"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm"
              />
            </>
          )}

          {/* PREVIOUS USE */}
          <Text className="font-semibold mt-4 mb-2">
            Property previously used for (optional)
          </Text>

          <TouchableOpacity
            onPress={() => setShowPrevUsed(!showPrevUsed)}
            className="border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
          >
            <Text className="text-sm">{prevUsedFor}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {showPrevUsed &&
            prevUsedOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setPrevUsedFor(opt);
                  setShowPrevUsed(false);
                }}
                className="px-4 py-2"
              >
                <Text className="text-sm">{opt}</Text>
              </TouchableOpacity>
            ))}

          {/* DESCRIPTION */}
          <Text className="font-semibold mt-4 mb-2">Description</Text>
          <TextInput
            placeholder="Write here what makes your property unique"
            value={description}
            onChangeText={setDescription}
            multiline
            className="border border-gray-200 rounded-xl px-4 py-3 h-28 text-sm"
            textAlignVertical="top"
          />

          {/* AMENITIES */}
          <Text className="font-semibold mt-6 mb-3">Amenities</Text>
          <View className="flex-row flex-wrap">
            {amenitiesOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onPress={() => toggleItem(item, amenities, setAmenities)}
              />
            ))}
          </View>

          {/* LOCATION ADVANTAGES */}
          <Text className="font-semibold mt-6 mb-3">
            Location Advantages
          </Text>
          <View className="flex-row flex-wrap">
            {locationAdvOptions.map(item => (
              <PillButton
                key={item}
                label={item}
                selected={locationAdvantages.includes(item)}
                onPress={() =>
                  toggleItem(item, locationAdvantages, setLocationAdvantages)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-8">
        <TouchableOpacity
          className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
        >
          <Text className="font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-5 py-3 rounded-lg bg-green-500"
          onPress={() => router.push("/home/screens/UploadScreens/CommercialUpload/Components/RetailVaastu")}
        >
          <Text className="text-white font-semibold">Next</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
