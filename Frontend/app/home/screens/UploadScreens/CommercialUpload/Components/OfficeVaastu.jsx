//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/OfficeVaastu.jsx

import React, { useState,useMemo ,useEffect} from "react";
import { View, Text, ScrollView, TouchableOpacity,Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VastuDropdown from "../../VastuDropdown";
import { useRouter,useLocalSearchParams } from "expo-router";
/* ---------------- MAIN SCREEN ---------------- */

export default function VastuDetailsScreen() {
  // ✅ STEP 1: Declare hooks FIRST (before using them)
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ STEP 2: Then declare state
  const [form, setForm] = useState(() => ({
    officeFacing: "",
    entrance: "",
    cabin: "",
    workstations: "",
    conference: "",
    reception: "",
    accounts: "",
    pantry: "",
    server: "",
    washrooms: "",
    staircase: "",
    storage: "",
    cashLocker: "",
  }));

  // ✅ STEP 3: Then useMemo that depends on params
  const images = useMemo(() => {
    try {
      if (!params.images) return [];
      if (Array.isArray(params.images)) return params.images;
      return JSON.parse(params.images);
    } catch (e) {
      console.error('❌ Error parsing images:', e);
      return [];
    }
  }, [params.images]);

  const commercialDetails = useMemo(() => {
    try {
      console.log('🔍 OfficeVaastu params:', {
        hasCommercialDetails: !!params.commercialDetails,
        type: typeof params.commercialDetails,
      });

      if (!params.commercialDetails) {
        console.log('⚠️ No commercialDetails in params');
        return null;
      }

      if (typeof params.commercialDetails === 'object' && !Array.isArray(params.commercialDetails)) {
        console.log('✅ commercialDetails is already an object');
        return params.commercialDetails;
      }

      if (typeof params.commercialDetails === 'string') {
        console.log('✅ Parsing commercialDetails string');
        return JSON.parse(params.commercialDetails);
      }

      if (Array.isArray(params.commercialDetails)) {
        const first = params.commercialDetails[0];
        if (typeof first === 'string') {
          return JSON.parse(first);
        }
        return first;
      }

      return null;
    } catch (e) {
      console.error('❌ Error parsing commercialDetails:', e);
      return null;
    }
  }, [params.commercialDetails]);

  // ✅ STEP 4: Then useEffect that restores data
  useEffect(() => {
    if (commercialDetails?.officeDetails?.vaasthuDetails) {
      const vastu = commercialDetails.officeDetails.vaasthuDetails;
      console.log('🔄 Restoring Vaastu data:', vastu);
      setForm(vastu);
    }
  }, [commercialDetails]); // ✅ Depend on commercialDetails, not params

  // ✅ STEP 5: Add the update function
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ADD THIS NEW FUNCTION after the update function (around line ~106):

const handleBack = () => {
  if (!commercialDetails || !commercialDetails.officeDetails) {
    router.back();
    return;
  }

  // Save Vaastu data with existing office details
  const updatedCommercialDetails = {
    ...commercialDetails,
    officeDetails: {
      ...commercialDetails.officeDetails,
      vaasthuDetails: form,
    },
  };

router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OfficeNext",
  params: {
    officeDetails: JSON.stringify(commercialDetails.officeDetails),
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
    // ✅ ADD THIS
    commercialBaseDetails: params.commercialBaseDetails,
  },
});
};
  // ✅ Rest of your code (handleNext function, etc.)

const handleNext = () => {
  console.log('🔄 handleNext called with:', {
    hasCommercialDetails: !!commercialDetails,
    hasOfficeDetails: !!commercialDetails?.officeDetails,
    hasVaasthuDetails: !!form,
  });

  if (!commercialDetails || !commercialDetails.officeDetails) {
    Alert.alert(
      "Missing Data",
      "Property details are missing. Please go back and complete all previous steps.",
      [
        {
          text: "Go Back",
          onPress: () => router.back()
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
    return;
  }

  const updatedCommercialDetails = {
    ...commercialDetails,
    officeDetails: {
      ...commercialDetails.officeDetails,
      vaasthuDetails: {
        officeFacing: form.officeFacing,
        entrance: form.entrance,
        cabin: form.cabin,
        workstations: form.workstations,
        conference: form.conference,
        reception: form.reception,
        accounts: form.accounts,
        pantry: form.pantry,
        server: form.server,
        washrooms: form.washrooms,
        staircase: form.staircase,
        storage: form.storage,
        cashLocker: form.cashLocker,
      },
    },
  };

router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails.officeDetails?.propertyTitle || params.propertyTitle,
    // ✅ ADD THIS - Pass original base details forward
    commercialBaseDetails: params.commercialBaseDetails,
  },
});
};

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
                <View className="bg-white rounded-2xl p-4">
                    <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

                    <VastuDropdown
                        label="Office Facing"
                        value={form.officeFacing}
                        options={["North", "East", "North-East", "West", "South"]}
                        onSelect={(v) => update("officeFacing", v)}
                    />

                    <VastuDropdown
                        label="Main Entrance Direction"
                        value={form.entrance}
                        options={["North", "East", "North-East", "West"]}
                        onSelect={(v) => update("entrance", v)}
                    />

                    <VastuDropdown
                        label="Owner / MD / Manager Cabin Direction"
                        value={form.cabin}
                        options={["South-West", "West", "South"]}
                        onSelect={(v) => update("cabin", v)}
                    />

                    <VastuDropdown
                        label="Workstations / Employee Seating Direction"
                        value={form.workstations}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("workstations", v)}
                    />

                    <VastuDropdown
                        label="Conference / Meeting Room Direction"
                        value={form.conference}
                        options={["North-West", "West"]}
                        onSelect={(v) => update("conference", v)}
                    />

                    <VastuDropdown
                        label="Reception Area Direction"
                        value={form.reception}
                        options={["North", "East", "North-East"]}
                        onSelect={(v) => update("reception", v)}
                    />

                    <VastuDropdown
                        label="Accounts / Finance Department Direction"
                        value={form.accounts}
                        options={["North", "North-East"]}
                        onSelect={(v) => update("accounts", v)}
                    />

                    <VastuDropdown
                        label="Pantry / Cafeteria Direction"
                        value={form.pantry}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("pantry", v)}
                    />

                    <VastuDropdown
                        label="Server / IT / Electrical Room Direction"
                        value={form.server}
                        options={["South-East", "North-West"]}
                        onSelect={(v) => update("server", v)}
                    />

                    <VastuDropdown
                        label="Washrooms / Toilets Direction"
                        value={form.washrooms}
                        options={["North-West", "West", "South-East"]}
                        onSelect={(v) => update("washrooms", v)}
                    />

                    <VastuDropdown
                        label="Staircase / Lift Direction"
                        value={form.staircase}
                        options={["South", "South-West", "West"]}
                        onSelect={(v) => update("staircase", v)}
                    />

                    <VastuDropdown
                        label="Storage / Records Room Direction"
                        value={form.storage}
                        options={["South-West", "West"]}
                        onSelect={(v) => update("storage", v)}
                    />

                    <VastuDropdown
                        label="Cash Locker / Safe Direction"
                        value={form.cashLocker}
                        options={["South-West"]}
                        onSelect={(v) => update("cashLocker", v)}
                    />
                </View>

            </ScrollView>
            <View className="flex-row bg-white rounded-lg p-4  justify-end mt-4 space-x-3 mx-3 mb-12">
               
<TouchableOpacity
  className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
  onPress={handleBack}
>
  <Text className="font-semibold">Cancel</Text>
</TouchableOpacity>

                <TouchableOpacity
                    className="px-5 py-3 rounded-lg bg-green-500"
                    onPress={handleNext}
                >
                    <Text className="text-white font-semibold">Next</Text>
                </TouchableOpacity>

            </View>
        </View>


    );
}
