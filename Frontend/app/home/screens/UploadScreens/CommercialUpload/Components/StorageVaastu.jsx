// //Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu.jsx (jahnavi)

// import React, { useState, useMemo, useEffect } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import VastuDropdown from "../../VastuDropdown";

// export default function VastuDetailsScreen() {
//   // ✅ STEP 1: Declare hooks FIRST (before using them)
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   // ✅ STEP 2: Then declare state
//   const [form, setForm] = useState({
//     buildingFacing: "",
//     entrance: "",
//     storageArea: "",
//     lightGoods: "",
//     loading: "",
//     office: "",
//     electrical: "",
//     water: "",
//     washroom: "",
//     height: "",
//   });

//   // ✅ STEP 3: Then useMemo for parsing params
//   const images = useMemo(() => {
//     try {
//       if (!params.images) return [];
//       if (typeof params.images === 'string') return JSON.parse(params.images);
//       if (Array.isArray(params.images)) return params.images;
//       return [];
//     } catch (e) {
//       console.error('❌ Error parsing images:', e);
//       return [];
//     }
//   }, [params.images]);

//   const commercialDetails = useMemo(() => {
//     try {
//       console.log('🔍 StorageVaastu params:', {
//         hasCommercialDetails: !!params.commercialDetails,
//         type: typeof params.commercialDetails,
//       });

//       if (!params.commercialDetails) {
//         console.log('⚠️ No commercialDetails in params');
//         return null;
//       }

//       if (typeof params.commercialDetails === 'object' && !Array.isArray(params.commercialDetails)) {
//         console.log('✅ commercialDetails is already an object');
//         return params.commercialDetails;
//       }

//       if (typeof params.commercialDetails === 'string') {
//         console.log('✅ Parsing commercialDetails string');
//         return JSON.parse(params.commercialDetails);
//       }

//       if (Array.isArray(params.commercialDetails)) {
//         const first = params.commercialDetails[0];
//         if (typeof first === 'string') {
//           return JSON.parse(first);
//         }
//         return first;
//       }

//       return null;
//     } catch (e) {
//       console.error('❌ Error parsing commercialDetails:', e);
//       return null;
//     }
//   }, [params.commercialDetails]);

//   // ✅ STEP 4: Load draft from AsyncStorage
//   useEffect(() => {
//     const loadDraft = async () => {
//       try {
//         // Priority 1: Load from AsyncStorage
//         const draft = await AsyncStorage.getItem('draft_storage_vaastu');
//         if (draft) {
//           const savedForm = JSON.parse(draft);
//           console.log('📦 Loading Storage Vaastu draft from AsyncStorage');
//           setForm(savedForm);
//           return;
//         }
//       } catch (e) {
//         console.log('⚠️ Failed to load Storage Vaastu draft:', e);
//       }

//       // Fallback: Load from params
//       if (commercialDetails?.storageDetails?.vastuDetails) {
//         const vastu = commercialDetails.storageDetails.vastuDetails;
//         console.log('🔄 Restoring Storage Vaastu data from params:', vastu);
//         setForm(vastu);
//       }
//     };

//     loadDraft();
//   }, [commercialDetails]);

//   // ✅ Auto-save Vaastu draft
//   useEffect(() => {
//     const saveDraft = async () => {
//       try {
//         await AsyncStorage.setItem('draft_storage_vaastu', JSON.stringify(form));
//         console.log('💾 Storage Vaastu draft auto-saved');
//       } catch (e) {
//         console.log('⚠️ Failed to save Storage Vaastu draft:', e);
//       }
//     };

//     const timer = setTimeout(saveDraft, 1000);
//     return () => clearTimeout(timer);
//   }, [form]);

//   // ✅ Update form helper
//   const update = (key, value) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   // ✅ Handle back navigation
//   const handleBack = () => {
//     if (!commercialDetails || !commercialDetails.storageDetails) {
//       router.back();
//       return;
//     }

//     // Save Vaastu data with existing storage details
//     const updatedCommercialDetails = {
//       ...commercialDetails,
//       storageDetails: {
//         ...commercialDetails.storageDetails,
//         vastuDetails: form,
//       },
//     };

//     router.push({
//       pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
//       params: {
//         storageDetails: JSON.stringify(commercialDetails.storageDetails),
//         commercialDetails: JSON.stringify(updatedCommercialDetails),
//         images: JSON.stringify(images),
//         area: params.area,
//         propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
//         commercialBaseDetails: params.commercialBaseDetails,
//       },
//     });
//   };

//   // ✅ Handle next navigation
//   const handleNext = () => {
//     console.log('🔄 handleNext called with:', {
//       hasCommercialDetails: !!commercialDetails,
//       hasStorageDetails: !!commercialDetails?.storageDetails,
//       hasVastuDetails: !!form,
//     });

//     if (!commercialDetails || !commercialDetails.storageDetails) {
//       Alert.alert(
//         "Missing Data",
//         "Storage details are missing. Please go back and complete all previous steps.",
//         [
//           {
//             text: "Go Back",
//             onPress: () => router.back()
//           },
//           {
//             text: "Cancel",
//             style: "cancel"
//           }
//         ]
//       );
//       return;
//     }

//     const updatedCommercialDetails = {
//       ...commercialDetails,
//       storageDetails: {
//         ...commercialDetails.storageDetails,
//         vastuDetails: {
//           buildingFacing: form.buildingFacing,
//           entrance: form.entrance,
//           storageArea: form.storageArea,
//           lightGoods: form.lightGoods,
//           loading: form.loading,
//           office: form.office,
//           electrical: form.electrical,
//           water: form.water,
//           washroom: form.washroom,
//           height: form.height,
//         },
//       },
//     };

//     console.log('✅ Navigating to OwnerScreen with:', {
//       hasUpdatedDetails: !!updatedCommercialDetails,
//       hasStorageDetails: !!updatedCommercialDetails.storageDetails,
//       hasVastuDetails: !!updatedCommercialDetails.storageDetails.vastuDetails,
//     });

//     router.push({
//       pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
//       params: {
//         commercialDetails: JSON.stringify(updatedCommercialDetails),
//         images: JSON.stringify(images),
//         area: params.area,
//         propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
//         commercialBaseDetails: params.commercialBaseDetails,
//       },
//     });
//   };

//   return (
//     <View className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center ml-4 mt-12 mb-2">
//         <TouchableOpacity onPress={handleBack}>
//           <Image
//             source={require("../../../../../../assets/arrow.png")}
//             className="w-5 h-5"
//           />
//         </TouchableOpacity>

//         <View className="ml-2">
//           <Text className="text-base font-semibold">
//             Upload Your Property
//           </Text>
//           <Text className="text-xs text-gray-500">
//             Add your property details
//           </Text>
//         </View>
//       </View>

//       {/* Scrollable Form */}
//       <ScrollView className="flex-1 px-4 py-6">
//         <View className="bg-white border border-gray-200 rounded-2xl p-4">
//           <Text className="text-lg font-bold mb-4">Vaasthu Details</Text>

//           <VastuDropdown
//             label="Storage Building Facing"
//             value={form.buildingFacing}
//             options={["North", "East", "North-East", "West", "South"]}
//             onSelect={(v) => update("buildingFacing", v)}
//           />

//           <VastuDropdown
//             label="Main Entrance / Shutter Direction"
//             value={form.entrance}
//             options={["North", "East", "North-East", "West", "South-West"]}
//             onSelect={(v) => update("entrance", v)}
//           />

//           <VastuDropdown
//             label="Storage Area Direction (Heavy Goods)"
//             value={form.storageArea}
//             options={["Towards North", "Towards South", "Towards West"]}
//             onSelect={(v) => update("storageArea", v)}
//           />

//           <VastuDropdown
//             label="Light Goods / Empty Space Direction"
//             value={form.lightGoods}
//             options={["Balanced open space", "North", "East"]}
//             onSelect={(v) => update("lightGoods", v)}
//           />

//           <VastuDropdown
//             label="Loading / Unloading Area Direction"
//             value={form.loading}
//             options={["Square", "North", "East", "West"]}
//             onSelect={(v) => update("loading", v)}
//           />

//           <VastuDropdown
//             label="Office / Admin Area Direction (If any)"
//             value={form.office}
//             options={["North", "East", "North-East"]}
//             onSelect={(v) => update("office", v)}
//           />

//           <VastuDropdown
//             label="Electrical / Generator / Equipment Direction"
//             value={form.electrical}
//             options={["Water source in North", "South-East", "North-West"]}
//             onSelect={(v) => update("electrical", v)}
//           />

//           <VastuDropdown
//             label="Water Source Direction (If any)"
//             value={form.water}
//             options={["North", "North-East", "East"]}
//             onSelect={(v) => update("water", v)}
//           />

//           <VastuDropdown
//             label="Washroom / Toilet Direction (If any)"
//             value={form.washroom}
//             options={["Equal height on all sides", "North-West", "West"]}
//             onSelect={(v) => update("washroom", v)}
//           />

//           <VastuDropdown
//             label="Height & Level"
//             value={form.height}
//             options={["No structures", "Higher in South & West"]}
//             onSelect={(v) => update("height", v)}
//           />
//         </View>
//       </ScrollView>

//       {/* Bottom Buttons */}
//       <View className="flex-row bg-white rounded-lg p-4 justify-end mt-4 space-x-3 mx-3 mb-12">
//         <TouchableOpacity 
//           className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
//           onPress={handleBack}
//         >
//           <Text className="font-semibold">Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="px-5 py-3 rounded-lg bg-green-500"
//           onPress={handleNext}
//         >
//           <Text className="text-white font-semibold">Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }



//Frontend/app/home/screens/UploadScreens/CommercialUpload/Components/StorageVaastu.jsx

import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import VastuDropdown from "../../VastuDropdown";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

export default function VastuDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

  const [form, setForm] = useState({
    buildingFacing: "",
    entrance: "",
    storageArea: "",
    lightGoods: "",
    loading: "",
    office: "",
    electrical: "",
    water: "",
    washroom: "",
    height: "",
  });

  const images = useMemo(() => {
    try {
      if (!params.images) return [];
      if (typeof params.images === 'string') return JSON.parse(params.images);
      if (Array.isArray(params.images)) return params.images;
      return [];
    } catch (e) {
      console.error('❌ Error parsing images:', e);
      return [];
    }
  }, [params.images]);

  const commercialDetails = useMemo(() => {
    try {
      console.log('🔍 StorageVaastu params:', {
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

  // Load draft from AsyncStorage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem('draft_storage_vaastu');
        if (draft) {
          const savedForm = JSON.parse(draft);
          console.log('📦 Loading Storage Vaastu draft from AsyncStorage');
          setForm(savedForm);
          return;
        }
      } catch (e) {
        console.log('⚠️ Failed to load Storage Vaastu draft:', e);
      }

      // Fallback: Load from params
      if (commercialDetails?.storageDetails?.vastuDetails) {
        const vastu = commercialDetails.storageDetails.vastuDetails;
        console.log('🔄 Restoring Storage Vaastu data from params:', vastu);
        setForm(vastu);
      }
    };

    loadDraft();
  }, [commercialDetails]);

  // Auto-save Vaastu draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await AsyncStorage.setItem('draft_storage_vaastu', JSON.stringify(form));
        console.log('💾 Storage Vaastu draft auto-saved');
      } catch (e) {
        console.log('⚠️ Failed to save Storage Vaastu draft:', e);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (!commercialDetails || !commercialDetails.storageDetails) {
      router.back();
      return;
    }

    const updatedCommercialDetails = {
      ...commercialDetails,
      storageDetails: {
        ...commercialDetails.storageDetails,
        vastuDetails: form,
      },
    };

    router.push({
      pathname: "/home/screens/UploadScreens/CommercialUpload/Components/StorageNext",
      params: {
        storageDetails: JSON.stringify(commercialDetails.storageDetails),
        commercialDetails: JSON.stringify(updatedCommercialDetails),
        images: JSON.stringify(images),
        area: params.area,
        propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
        commercialBaseDetails: params.commercialBaseDetails,
      },
    });
  };

  const handleNext = () => {
    console.log('🔄 handleNext called with:', {
      hasCommercialDetails: !!commercialDetails,
      hasStorageDetails: !!commercialDetails?.storageDetails,
      hasVastuDetails: !!form,
    });

    if (!commercialDetails || !commercialDetails.storageDetails) {
      Alert.alert(
        t('missing_data_title'),
        t('missing_data_message'),
        [
          {
            text: "Go Back",
            onPress: () => router.back()
          },
          {
            text: t('button_cancel'),
            style: "cancel"
          }
        ]
      );
      return;
    }

    const updatedCommercialDetails = {
      ...commercialDetails,
      storageDetails: {
        ...commercialDetails.storageDetails,
        vastuDetails: {
          buildingFacing: form.buildingFacing,
          entrance: form.entrance,
          storageArea: form.storageArea,
          lightGoods: form.lightGoods,
          loading: form.loading,
          office: form.office,
          electrical: form.electrical,
          water: form.water,
          washroom: form.washroom,
          height: form.height,
        },
      },
    };

    console.log('✅ Navigating to OwnerScreen with:', {
      hasUpdatedDetails: !!updatedCommercialDetails,
      hasStorageDetails: !!updatedCommercialDetails.storageDetails,
      hasVastuDetails: !!updatedCommercialDetails.storageDetails.vastuDetails,
    });
  router.push({
  pathname: "/home/screens/UploadScreens/CommercialUpload/Components/OwnerScreen",
  params: {
    commercialDetails: JSON.stringify(updatedCommercialDetails),
    images: JSON.stringify(images),
    area: params.area,
    propertyTitle: commercialDetails.storageDetails?.propertyTitle || params.propertyTitle,
    commercialBaseDetails: params.commercialBaseDetails,
  },
});
};

//Define Vaastu options with translations
const vastuOptions = {
  buildingFacing: [
    t('vaastu_option_north'),
    t('vaastu_option_east'),
    t('vaastu_option_north_east'),
    t('vaastu_option_west'),
    t('vaastu_option_south')
  ],
  entrance: [
    t('vaastu_option_north'),
    t('vaastu_option_east'),
    t('vaastu_option_north_east'),
    t('vaastu_option_west'),
    t('vaastu_option_south_west')
  ],
  storageArea: [
    t('vaastu_option_towards_north'),
    t('vaastu_option_towards_south'), 
    t('vaastu_option_towards_west')
  ],
  lightGoods: [
    t('vaastu_option_balanced_open_space'),
    t('vaastu_option_north'),
    t('vaastu_option_east')
  ],
  loading: [
    t('vaastu_option_square'),
    t('vaastu_option_north'),
    t('vaastu_option_east'),
    t('vaastu_option_west')
  ],
  office: [
    t('vaastu_option_water_source_north'),
    t('vaastu_option_south_east'),
    t('vaastu_option_north_west'),
  ],
  water: [
    t('vaastu_option_north'),
    t('vaastu_option_north_east'),
    t('vaastu_option_east')
  ],
  washroom: [
    t('vaastu_option_equal_height'),
    t('vaastu_option_north_west'),
    t('vaastu_option_west')
  ],
  height: [
    t('vaastu_option_no_structures'),
    t('vaastu_option_higher_south_west')
  ],
};
//English values to store in backend(same order as translated options)
const vastuEnglishValues = {
  buildingFacing: ["North", "East", "North-East", "West", "South"],
entrance: ["North", "East", "North-East", "West", "South-West"],
storageArea: ["Towards North", "Towards South", "Towards West"],
lightGoods: ["Balanced open space", "North", "East"],
loading: ["Square", "North", "East", "West"],
office: ["North", "East", "North-East"],
electrical: ["Water source in North", "South-East", "North-West"],
water: ["North", "North-East", "East"],
washroom: ["Equal height on all sides", "North-West", "West"],
height: ["No structures", "Higher in South & West"],
};

return (
  <View className="flex-1 bg-white">

{/* Header */}
<View className="flex-row items-center ml-4 mt-12 mb-2">
  <TouchableOpacity onPress={handleBack}>

<Image
source={require("../../../../../../assets/arrow.png")}
className="w-5 h-5"
/>

  </TouchableOpacity>

<View className="ml-2">
      <Text className="text-base font-semibold">
        {t('upload_property_title')}
      </Text>
      <Text className="text-xs text-gray-500">
        {t('upload_property_subtitle')}
      </Text>
    </View>
  </View>

  {/* Scrollable Form */}
  <ScrollView className="flex-1 px-4 py-6">
    <View className="bg-white border border-gray-200 rounded-2xl p-4">
      <Text className="text-lg font-bold mb-4">{t('vaastu_details_title')}</Text>

      <VastuDropdown
        label={t('storage_building_facing')}
        value={form.buildingFacing}
        options={vastuOptions.buildingFacing}
        onSelect={(translatedValue) => {
          const index = vastuOptions.buildingFacing.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.buildingFacing[index];
          update("buildingFacing", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_entrance_direction')}
        value={form.entrance}
        options={vastuOptions.entrance}
        onSelect={(translatedValue) => {
          const index = vastuOptions.entrance.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.entrance[index];
          update("entrance", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_area_direction')}
        value={form.storageArea}
        options={vastuOptions.storageArea}
        onSelect={(translatedValue) => {
          const index = vastuOptions.storageArea.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.storageArea[index];
          update("storageArea", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_light_goods_direction')}
        value={form.lightGoods}
        options={vastuOptions.lightGoods}
        onSelect={(translatedValue) => {
          const index = vastuOptions.lightGoods.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.lightGoods[index];
          update("lightGoods", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_loading_direction')}
        value={form.loading}
        options={vastuOptions.loading}
        onSelect={(translatedValue) => {
          const index = vastuOptions.loading.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.loading[index];
          update("loading", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_office_direction')}
        value={form.office}
        options={vastuOptions.office}
        onSelect={(translatedValue) => {
          const index = vastuOptions.office.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.office[index];
          update("office", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_electrical_direction')}
        value={form.electrical}
        options={vastuOptions.electrical}
        onSelect={(translatedValue) => {
          const index = vastuOptions.electrical.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.electrical[index];
          update("electrical", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_water_direction')}
        value={form.water}
        options={vastuOptions.water}
        onSelect={(translatedValue) => {
          const index = vastuOptions.water.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.water[index];
          update("water", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_washroom_direction')}
        value={form.washroom}
        options={vastuOptions.washroom}
        onSelect={(translatedValue) => {
          const index = vastuOptions.washroom.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.washroom[index];
          update("washroom", englishValue);
        }}
      />

      <VastuDropdown
        label={t('storage_height_level')}
        value={form.height}
        options={vastuOptions.height}
        onSelect={(translatedValue) => {
          const index = vastuOptions.height.indexOf(translatedValue);
          const englishValue = vastuEnglishValues.height[index];
          update("height", englishValue);
        }}
      />
    </View>
  </ScrollView>

  {/* Bottom Buttons */}
  <View className="flex-row bg-white rounded-lg p-4 justify-end mt-4 space-x-3 mx-3 mb-12">
    <TouchableOpacity 
      className="px-5 py-3 rounded-lg bg-gray-200 mx-3"
      onPress={handleBack}
    >
      <Text className="font-semibold">{t('button_cancel')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      className="px-5 py-3 rounded-lg bg-green-500"
      onPress={handleNext}
    >
      <Text className="text-white font-semibold">{t('button_next')}</Text>
    </TouchableOpacity>
  </View>
</View>
);
}

  


