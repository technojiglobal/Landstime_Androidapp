// Frontend/app/home/screens/UploadScreens/CommercialUpload/index.jsx
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";
import { useTranslation } from 'react-i18next'; // ✅ ADD THIS

import PropertyImageUpload from "components/PropertyImageUpload";
import TopAlert from "../TopAlert";
import CustomPickerAlert from "components/CustomPickerAlert";
import HowTo360Modal from "../HowTo360Modal";
import PhotoUploadGuide from "../PhotoUploadGuide";

import Office from "./Components/Office";
import Plot from "./Components/Plot";
import Retail from "./Components/Retail";
import Industry from "./Components/Industry";
import Storage from "./Components/Storage";
import Hospitality from "./Components/Hospitality";
import Other from "./Components/Other";

/* ---------------- PILL BUTTON ---------------- */
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

/* ---------------- MAIN SCREEN ---------------- */
export default function PropertyFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation(); // ✅ ADD THIS

  /* ---------- STATES ---------- */
  const [propertyTitle, setPropertyTitle] = useState(params.propertyTitle || "");
  const [propertyType, setPropertyType] = useState("Commercial");
  const [visible, setVisible] = useState(null);
  const [officeKinds, setOfficeKinds] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [retailKinds, setRetailKinds] = useState([]);
  const [storageKinds, setStorageKinds] = useState([]);
  const [industryKinds, setIndustryKinds] = useState([]);
  const [HospitalityKinds, setHospitalityKinds] = useState([]);
  const [plotKinds, setPlotKinds] = useState([]);
  const [area, setArea] = useState("");
  const [neighborhoodArea, setNeighborhoodArea] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [locatedInside, setLocatedInside] = useState("");
  const [isHowto360ModalVisible, setIsHowto360ModalVisible] = useState(false);
  const [isPhotoGuideModalVisible, setIsPhotoGuideModalVisible] = useState(false);
  const [pickerAlertVisible, setPickerAlertVisible] = useState(false);

  /* ---------- CONSTANTS WITH TRANSLATIONS ---------- */
  const typePills = [
    { key: "Office", label: t('office_type') },
    { key: "Retail", label: t('retail_type') },
    { key: "Plot/Land", label: t('plot_land_type') },
    { key: "Storage", label: t('storage_type') },
    { key: "Industry", label: t('industry_type') },
    { key: "Hospitality", label: t('hospitality_type') },
    { key: "Other", label: t('other_type') },
  ];

  const officeKindPills = [
    t('office_ready_to_move'),
    t('office_bare_shell'),
    t('office_coworking'),
  ];

  const storageKindPills = [
    t('storage_warehouse'),
    t('storage_cold_storage'),
  ];

  const retailTypeOptions = [
    t('retail_commercial_shop'),
    t('retail_commercial_showroom'),
  ];

  const industryKindPills = [
    t('industry_factory'),
    t('industry_manufacturing'),
  ];

  const hospitalityKindPills = [
    t('hospitality_hotel_resorts'),
    t('hospitality_guest_house'),
  ];

  const plotKindPills = [
    t('plot_commercial_land'),
    t('plot_agricultural_land'),
    t('plot_industrial_land'),
  ];

  const locatedInsideOptions = [
    t('retail_mall'),
    t('retail_commercial_project'),
    t('retail_residential_project'),
    t('retail_complex_building'),
    t('retail_market_high_street'),
  ];

  // ✅ Restore from params
  useEffect(() => {
    console.log('🔍 index.jsx useEffect - params:', {
      hasOfficeDetails: !!params.officeDetails,
      hasHospitalityDetails: !!params.hospitalityDetails,
      hasCommercialBaseDetails: !!params.commercialBaseDetails,
      hasImages: !!params.images,
      hasArea: !!params.area
    });

    // STEP 1: Restore images first
    if (params.images) {
      try {
        const savedImages = JSON.parse(params.images);
        if (Array.isArray(savedImages)) {
          setImages(savedImages);
          console.log('✅ Images restored:', savedImages.length);
        }
      } catch (e) {
        console.log('❌ Could not restore images:', e);
      }
    }

    // STEP 2: Restore area
    if (params.area) {
      setNeighborhoodArea(params.area);
      setArea(params.area);
      console.log('✅ Area restored from params:', params.area);
    }

    // STEP 3: Restore from commercialBaseDetails (highest priority)
// STEP 3: Restore from commercialBaseDetails (highest priority)
if (params.commercialBaseDetails) {
  try {
    const baseDetails = JSON.parse(params.commercialBaseDetails);
    console.log('🔄 Restoring from commercialBaseDetails:', baseDetails);

    setSelectedType(baseDetails.subType || '');
    setPropertyTitle(baseDetails.propertyTitle || '');

    if (baseDetails.officeKind) {
      setOfficeKinds([baseDetails.officeKind]);
    }

    if (baseDetails.retailKind) {
      setRetailKinds([baseDetails.retailKind]);
      console.log('✅ Retail kind restored from baseDetails:', baseDetails.retailKind);
    }

    if (baseDetails.plotKind) {
      setPlotKinds([baseDetails.plotKind]);
      console.log('✅ Plot kind restored from baseDetails:', baseDetails.plotKind);
    }

    if (baseDetails.locatedInside) {
      setLocatedInside(baseDetails.locatedInside);
      console.log('✅ Located inside restored from baseDetails:', baseDetails.locatedInside);
    }

    // ✅ FIXED - Check for hospitalityType instead of hospitalityKind
    if (baseDetails.hospitalityType) {
      setHospitalityKinds([baseDetails.hospitalityType]);
      console.log('✅ Hospitality type restored from baseDetails:', baseDetails.hospitalityType);
    }

      // ✅ Support both storageType and storageKind
const storageTypeValue = baseDetails.storageType || baseDetails.storageKind;
if (storageTypeValue) {
  // ✅ If it's already in English, reverse map to current language for UI
  const reverseMap = {
    'Warehouse': t('storage_warehouse'),
    'Cold Storage': t('storage_cold_storage')
  };
  const displayValue = reverseMap[storageTypeValue] || storageTypeValue;
  setStorageKinds([displayValue]);
  console.log('✅ Storage type restored from baseDetails:', displayValue);
}

        if (baseDetails.industryKind) {
          setIndustryKinds([baseDetails.industryKind]);
          console.log('✅ Industry kind restored from baseDetails:', baseDetails.industryKind);
        }

        console.log('✅ Selected type restored:', baseDetails.subType);
        console.log('✅ Property title restored:', baseDetails.propertyTitle);
      } catch (e) {
        console.log('❌ Failed to parse commercialBaseDetails:', e);
      }
    }

    // STEP 4: Fallback - restore from officeDetails
    if (params.officeDetails && officeKinds.length === 0) {
      try {
        const savedData = JSON.parse(params.officeDetails);
        if (savedData.officeKind) {
          setOfficeKinds([savedData.officeKind]);
          console.log('✅ Office kind restored from officeDetails:', savedData.officeKind);
        }
      } catch (e) {
        console.log('❌ Could not restore from officeDetails:', e);
      }
    }

    // STEP 4.5: Fallback - restore from plotDetails
    if (params.plotDetails && plotKinds.length === 0) {
      try {
        const savedData = JSON.parse(params.plotDetails);
        if (savedData.plotKind) {
          setPlotKinds([savedData.plotKind]);
          console.log('✅ Plot kind restored from plotDetails:', savedData.plotKind);
        }
      } catch (e) {
        console.log('❌ Could not restore from plotDetails:', e);
      }
    }

    // STEP 5: Fallback - restore from hospitalityDetails
    if (params.hospitalityDetails && HospitalityKinds.length === 0) {
      try {
        const savedData = JSON.parse(params.hospitalityDetails);
        if (savedData.hospitalityType) {
          setHospitalityKinds([savedData.hospitalityType]);
          console.log('✅ Hospitality type restored from hospitalityDetails:', savedData.hospitalityType);
        }
      } catch (e) {
        console.log('❌ Could not restore from hospitalityDetails:', e);
      }
    }
  }, [params.officeDetails, params.hospitalityDetails, params.plotDetails, params.images, params.commercialBaseDetails, params.area]);

// ✅ Load draft from AsyncStorage on mount
useEffect(() => {
  const loadDraft = async () => {
    // ✅ NEW - If coming fresh from AddScreen, clear all drafts
    if (!params.officeDetails && !params.hospitalityDetails && 
        !params.retailDetails && !params.plotDetails && 
        !params.storageDetails && !params.industryDetails &&
        !params.commercialBaseDetails) {
      console.log('🧹 Fresh entry - clearing all drafts');
      
      try {
        await AsyncStorage.multiRemove([
          'draft_commercial_office',
          'draft_commercial_retail',
          'draft_commercial_hospitality',
          'draft_commercial_plot',
          'draft_commercial_storage',
          'draft_commercial_industry',
          'draft_hospitality_details',
          'draft_hospitality_pricing',
          'draft_hospitality_vaastu',
        ]);
        console.log('✅ All drafts cleared');
      } catch (e) {
        console.log('⚠️ Error clearing drafts:', e);
      }
      
      return; // Don't load any drafts
    }

    try {
      // Try loading Office draft first
      const officeDraft = await AsyncStorage.getItem('draft_commercial_office');
      if (officeDraft) {
        const parsed = JSON.parse(officeDraft);
        console.log('📦 Loading Office draft from AsyncStorage:', parsed);

        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.officeKind) setOfficeKinds([parsed.officeKind]);
        if (parsed.retailKind) {
          setRetailKinds([parsed.retailKind]);
          console.log('✅ Retail kind restored from draft:', parsed.retailKind);
        }
        if (parsed.locatedInside) {
          setLocatedInside(parsed.locatedInside);
          console.log('✅ Located inside restored from draft:', parsed.locatedInside);
        }
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Office draft loaded successfully');
        return;
      }

      // Try loading Retail draft
      const retailDraft = await AsyncStorage.getItem('draft_commercial_retail');
      if (retailDraft) {
        const parsed = JSON.parse(retailDraft);
        console.log('📦 Loading Retail draft from AsyncStorage:', parsed);

        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.retailKind) {
          setRetailKinds([parsed.retailKind]);
          console.log('✅ Retail kind restored:', parsed.retailKind);
        }
        if (parsed.locatedInside) {
          setLocatedInside(parsed.locatedInside);
          console.log('✅ Located inside restored:', parsed.locatedInside);
        }
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Retail draft loaded successfully');
        return;
      }

      // Try loading Hospitality draft
      const hospitalityDraft = await AsyncStorage.getItem('draft_commercial_hospitality');
      if (hospitalityDraft) {
        const parsed = JSON.parse(hospitalityDraft);
        console.log('📦 Loading Hospitality draft from AsyncStorage:', parsed);

        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.hospitalityKind) setHospitalityKinds([parsed.hospitalityKind]);
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Hospitality draft loaded successfully');
        return;
      }

      // Try loading Plot draft
      const plotDraft = await AsyncStorage.getItem('draft_commercial_plot');
      if (plotDraft) {
        const parsed = JSON.parse(plotDraft);
        console.log('📦 Loading Plot draft from AsyncStorage:', parsed);

        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.plotKind) {
          setPlotKinds([parsed.plotKind]);
          console.log('✅ Plot kind restored from draft:', parsed.plotKind);
        }
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Plot draft loaded successfully');
        return;
      }

      // Try loading Storage draft
      // Try loading Storage draft
const storageDraft = await AsyncStorage.getItem('draft_commercial_storage');
if (storageDraft) {
  const parsed = JSON.parse(storageDraft);
  console.log('📦 Loading Storage draft from AsyncStorage:', parsed);

  if (parsed.selectedType) setSelectedType(parsed.selectedType);
  if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
  
  // ✅ Support both old 'storageKind' and new 'storageType' fields
  const storageTypeValue = parsed.storageType || parsed.storageKind;
  if (storageTypeValue) {
    // ✅ Reverse map back to Telugu/Hindi for UI display
    const reverseMap = {
      'Warehouse': t('storage_warehouse'),
      'Cold Storage': t('storage_cold_storage')
    };
    const displayValue = reverseMap[storageTypeValue] || storageTypeValue;
    setStorageKinds([displayValue]);
    console.log('✅ Storage type restored:', displayValue);
  }
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Storage draft loaded successfully');
      }

      // Try loading Industry draft
      const industryDraft = await AsyncStorage.getItem('draft_commercial_industry');
      if (industryDraft) {
        const parsed = JSON.parse(industryDraft);
        console.log('📦 Loading Industry draft from AsyncStorage:', parsed);

        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.propertyTitle) setPropertyTitle(parsed.propertyTitle);
        if (parsed.industryKind) setIndustryKinds([parsed.industryKind]);
        if (parsed.images) setImages(parsed.images);
        if (parsed.neighborhoodArea) {
          setNeighborhoodArea(parsed.neighborhoodArea);
          setArea(parsed.neighborhoodArea);
        }
        if (parsed.area) {
          setArea(parsed.area);
        }

        console.log('✅ Industry draft loaded successfully');
      }
    } catch (e) {
      console.log('⚠️ Failed to load draft:', e);
    }
  };

  loadDraft();
}, []); // ✅ Only run on mount

  // ✅ Auto-save index.jsx state changes
useEffect(() => {
  const saveDraft = async () => {
    if (!selectedType) return;

    // ✅ CONVERT storage type if present
    let storageTypeValue = undefined;
    if (storageKinds.length > 0) {
      const storageTypeMap = {
        'వేర్‌హౌస్': 'Warehouse',
        'गोदाम': 'Warehouse',
        'కోల్డ్ స్టోరేజ్': 'Cold Storage',
        'कोल्ड स्टोरेज': 'Cold Storage'
      };
      const raw = storageKinds[0];
      storageTypeValue = storageTypeMap[raw] || raw;
    }

    const draftData = {
      selectedType,
      propertyTitle,
      images,
      officeKind: officeKinds.length > 0 ? officeKinds[0] : undefined,
      retailKind: retailKinds.length > 0 ? retailKinds[0] : undefined,
      hospitalityKind: HospitalityKinds.length > 0 ? HospitalityKinds[0] : undefined,
      storageType: storageTypeValue, // ✅ CHANGED from storageKind to storageType
        plotKind: plotKinds.length > 0 ? plotKinds[0] : undefined,
        industryKind: industryKinds.length > 0 ? industryKinds[0] : undefined,
        locatedInside: locatedInside || undefined,
        area: area || neighborhoodArea || undefined,
        timestamp: new Date().toISOString(),
      };

      const storageKey = selectedType === 'Office'
        ? 'draft_commercial_office'
        : selectedType === 'Hospitality'
          ? 'draft_commercial_hospitality'
          : selectedType === 'Retail'
            ? 'draft_commercial_retail'
            : selectedType === 'Storage'
              ? 'draft_commercial_storage'
              : selectedType === 'Plot/Land'
                ? 'draft_commercial_plot'
                : selectedType === 'Industry'
                  ? 'draft_commercial_industry'
                  : null;

      if (storageKey) {
        try {
          await AsyncStorage.setItem(storageKey, JSON.stringify(draftData));
          console.log(`💾 ${selectedType} index draft auto-saved`);
        } catch (e) {
          console.log('⚠️ Failed to auto-save index draft:', e);
        }
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [selectedType, propertyTitle, images, officeKinds, retailKinds,
    HospitalityKinds, storageKinds, plotKinds, industryKinds, locatedInside, area, neighborhoodArea]);

  /* ---------- IMAGE HANDLERS ---------- */
  const takePhoto = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getCameraPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          t('permission_required'),
          t('camera_permission_message')
        );
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const pickFromGallery = async () => {
    setPickerAlertVisible(false);
    let permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          t('permission_required'),
          t('gallery_permission_message')
        );
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const pickImage = () => {
    setPickerAlertVisible(true);
  };

  const handleOpenPlayStore = () => {
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.google.android.street";
    Linking.openURL(playStoreLink).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- NEXT HANDLER ---------- */
  const handleNext = async () => {
    if (!selectedType) {
      Alert.alert(t('alert_select_property_type'), t('alert_select_property_type_message'));
      return;
    }

    const base = "/home/screens/UploadScreens/CommercialUpload/Components";

    const commonParams = {
      commercialBaseDetails: JSON.stringify({
        subType: selectedType,
        propertyTitle,
      }),
      images: JSON.stringify(images),
    };

    switch (selectedType) {
      case "Office":
        if (!officeKinds.length) {
          Alert.alert(t('alert_office_type_required'), t('alert_select_office_kind'));
          return;
        }

        const draftData = {
          selectedType,
          propertyTitle,
          images: images,
          officeKind: officeKinds.length > 0 ? officeKinds[0] : undefined,
          retailKind: retailKinds.length > 0 ? retailKinds[0] : undefined,
          hospitalityKind: HospitalityKinds.length > 0 ? HospitalityKinds[0] : undefined,
          storageKind: storageKinds.length > 0 ? storageKinds[0] : undefined,
          plotKind: plotKinds.length > 0 ? plotKinds[0] : undefined,
          locatedInside: locatedInside || undefined,
          area: area || neighborhoodArea || undefined,
          timestamp: new Date().toISOString(),
        };

        try {
          await AsyncStorage.setItem('draft_commercial_office', JSON.stringify(draftData));
          console.log('✅ Draft saved to AsyncStorage');
        } catch (e) {
          console.log('⚠️ Failed to save draft:', e);
        }

        router.push({
          pathname: `${base}/Office`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Office",
              officeKind: officeKinds[0],
              propertyTitle,
            }),
          },
        });
        break;

    case "Retail":
  // ✅ ADD VALIDATION
  if (!retailKinds.length) {
    Alert.alert(
      t('alert_retail_type_required') || 'Retail Type Required',
      t('alert_select_retail_kind') || 'Please select shop or showroom type'
    );
    return;
  }

  if (!locatedInside) {
    Alert.alert(
      t('alert_located_inside_required') || 'Located Inside Required',
      t('alert_select_located_inside') || 'Please select where the property is located'
    );
    return;
  }

  const retailDraftData = {
    selectedType: "Retail",
    propertyTitle,
    retailKind: retailKinds[0],
    locatedInside: locatedInside,
    images,
    area: area || neighborhoodArea,
    timestamp: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem('draft_commercial_retail', JSON.stringify(retailDraftData));
    console.log('✅ Retail draft saved to AsyncStorage');
  } catch (e) {
    console.log('⚠️ Failed to save Retail draft:', e);
  }

  router.push({
    pathname: `${base}/Retail`,
    params: {
      ...commonParams,
      commercialBaseDetails: JSON.stringify({
        subType: "Retail",
        retailKind: retailKinds[0],
        locatedInside: locatedInside,
        propertyTitle,
      }),
    },
  });
  break;

      case "Plot/Land":
        router.push({
          pathname: `${base}/Plot`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Plot/Land",
              plotKind: plotKinds.length > 0 ? plotKinds[0] : undefined,
              propertyTitle,
            }),
            area: area || neighborhoodArea,
          },
        });
        break;

    case "Storage":
  if (!storageKinds.length) {
    Alert.alert(t('alert_storage_type_required'), t('alert_select_storage_type'));
    return;
  }

  // ✅ CONVERT Telugu/Hindi to English
  const storageTypeMap = {
    'వేర్‌హౌస్': 'Warehouse',
    'गोदाम': 'Warehouse',
    'కోల్డ్ స్టోరేజ్': 'Cold Storage',
    'कोल्ड स्टोरेज': 'Cold Storage'
  };

  const rawStorageType = storageKinds[0];
  const convertedStorageType = storageTypeMap[rawStorageType] || rawStorageType;

  console.log('🔄 Storage Type Conversion in index.jsx:', {
    raw: rawStorageType,
    converted: convertedStorageType
  });

  const storageDraftData = {
    selectedType: "Storage",
    propertyTitle,
    storageType: convertedStorageType, // ✅ CHANGED from storageKind
    images,
    area: area || neighborhoodArea,
    timestamp: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem('draft_commercial_storage', JSON.stringify(storageDraftData));
    console.log('✅ Storage draft saved to AsyncStorage with English type');
  } catch (e) {
    console.log('⚠️ Failed to save Storage draft:', e);
  }

  router.push({
    pathname: `${base}/Storage`,
    params: {
      ...commonParams,
      commercialBaseDetails: JSON.stringify({
        subType: "Storage",
        storageType: convertedStorageType, // ✅ USE CONVERTED VALUE
        propertyTitle,
      }),
    },
  });
  break;


      case "Industry":
        if (!industryKinds.length) {
          Alert.alert(t('alert_industry_type_required'), t('alert_select_industry_type'));
          return;
        }

        const industryDraftData = {
          selectedType: "Industry",
          propertyTitle,
          industryKind: industryKinds[0],
          images,
          area: area || neighborhoodArea,
          timestamp: new Date().toISOString(),
        };

        try {
          await AsyncStorage.setItem('draft_commercial_industry', JSON.stringify(industryDraftData));
          console.log('✅ Industry draft saved to AsyncStorage');
        } catch (e) {
          console.log('⚠️ Failed to save Industry draft:', e);
        }

        router.push({
          pathname: `${base}/Industry`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Industry",
              industryKind: industryKinds[0],
              propertyTitle,
            }),
          },
        });
        break;

      case "Hospitality":
        if (!HospitalityKinds.length) {
          Alert.alert(t('alert_hospitality_type_required'), t('alert_select_hospitality_type'));
          return;
        }

        const hospitalityDraftData = {
          subType: "Hospitality",
          hospitalityType: HospitalityKinds[0],
          propertyTitle,
          images,
          neighborhoodArea: neighborhoodArea || area,
          area: area || neighborhoodArea,
          timestamp: new Date().toISOString(),
        };

        try {
          await AsyncStorage.setItem('draft_commercial_hospitality', JSON.stringify(hospitalityDraftData));
          console.log('✅ Hospitality draft saved to AsyncStorage');
        } catch (e) {
          console.log('⚠️ Failed to save Hospitality draft:', e);
        }

        router.push({
          pathname: `${base}/Hospitality`,
          params: {
            ...commonParams,
            commercialBaseDetails: JSON.stringify({
              subType: "Hospitality",
              hospitalityType: HospitalityKinds[0],
              propertyTitle,
            }),
          },
        });
        break;

      case "Other":
        router.push({
          pathname: `${base}/Other`,
          params: commonParams,
        });
        break;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TopAlert
        visible={alertVisible}
        onHide={() => setAlertVisible(false)}
      />

      <HowTo360Modal
        visible={isHowto360ModalVisible}
        onClose={() => setIsHowto360ModalVisible(false)}
        onOpenPlayStore={handleOpenPlayStore}
      />

      <PhotoUploadGuide
        visible={isPhotoGuideModalVisible}
        onClose={() => setIsPhotoGuideModalVisible(false)}
      />

      <CustomPickerAlert
        visible={pickerAlertVisible}
        onClose={() => setPickerAlertVisible(false)}
        onCameraPress={takePhoto}
        onGalleryPress={pickFromGallery}
      />

      <View className="flex-row items-center mt-12 mb-4 ml-4">
        <TouchableOpacity
          onPress={() =>
            router.push("/home/screens/UploadScreens/AddScreen")
          }
          className="p-2"
        >
          <Image
            source={require("../../../../../assets/arrow.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <View className="ml-2">
          <Text className="text-[16px] font-semibold">
            {t('upload_property_title')}
          </Text>
          <Text className="text-[12px] text-[#00000066]">
            {t('upload_property_subtitle')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- IMAGE UPLOAD ---------- */}
        <PropertyImageUpload
          images={images}
          onPickImage={pickImage}
          onRemoveImage={removeImage}
          onViewGuidelines={() => setIsPhotoGuideModalVisible(true)}
          onWatchTutorial={() => setIsHowto360ModalVisible(true)}
        />

        {/* ---------- BASIC DETAILS ---------- */}
        <View
          className="bg-white rounded-lg p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#0000001A" }}
        >
          <Text className="text-[16px] font-bold mb-5">{t('basic_details_title')}</Text>

          <Text className="text-[15px] text-[#00000099] mb-2">
            {t('property_title_label')}
          </Text>
          <TextInput
            placeholder={t('property_title_placeholder')}
            value={propertyTitle}
            onChangeText={setPropertyTitle}
            className="rounded-md p-3 mb-3"
            style={{
              borderWidth: 1,
              borderColor: "#0000001A",
              height: 50,
              backgroundColor: "#D9D9D91C",
            }}
          />

          <Text className="text-[15px] text-[#00000099] font-bold mb-2">
            {t('property_type_label')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setVisible(visible === "propertyType" ? null : "propertyType")
            }
            className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
          >
            <Text>{t('commercial_label')}</Text>
            <Ionicons name="chevron-down" size={20} />
          </TouchableOpacity>

          <Text className="text-[15px] text-[#00000099] font-bold mt-4 mb-2">
            {t('select_property_type')}
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {typePills.map((p) => (
              <PillButton
                key={p.key}
                label={p.label}
                selected={selectedType === p.key}
                onPress={() => setSelectedType(p.key)}
              />
            ))}
          </View>

          {selectedType === "Office" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('office_kind_question')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {officeKindPills.map((p) => (
                  <PillButton
                    key={p}
                    label={p}
                    selected={officeKinds.includes(p)}
                    onPress={() => setOfficeKinds([p])}
                  />
                ))}
              </View>
            </>
          )}

          {selectedType === "Industry" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('industry_kind_question')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {industryKindPills.map((p) => (
                  <PillButton
                    key={p}
                    label={p}
                    selected={industryKinds.includes(p)}
                    onPress={() => setIndustryKinds([p])}
                  />
                ))}
              </View>
            </>
          )}

          {selectedType === "Retail" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('retail_kind_question')}
              </Text>

              <View className="flex-row flex-wrap mb-2">
                {retailTypeOptions.map((type) => (
                  <PillButton
                    key={type}
                    label={type}
                    selected={retailKinds.includes(type)}
                    onPress={() => setRetailKinds([type])}
                  />
                ))}
              </View>

              {/* Located Inside */}
              <View className="mb-4">
                <Text className="text-[15px] text-[#00000099] mb-3">
                  {t('retail_located_inside')}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setVisible(visible === "locatedInside" ? null : "locatedInside")
                  }
                  className="bg-[#D9D9D91C] rounded-lg p-3 flex-row justify-between items-center border border-gray-300"
                >
                  <Text className="text-gray-800">
                    {locatedInside || t('retail_select_located_inside')}
                  </Text>
                  <Ionicons name="chevron-down" size={22} color="#888" />
                </TouchableOpacity>

                {visible === "locatedInside" && (
                  <View
                    className="bg-white rounded-lg shadow-lg mt-2"
                    style={{ borderWidth: 1, borderColor: "#0000001A" }}
                  >
                    {locatedInsideOptions.map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setLocatedInside(item);
                          setVisible(null);
                        }}
                        className={`p-4 border-b border-gray-200 ${locatedInside === item ? "bg-green-500" : "bg-white"}`}
                      >
                        <Text
                          className={`${locatedInside === item ? "text-white" : "text-gray-800"}`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          {selectedType === "Plot/Land" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('plot_kind_question')}
              </Text>

              <View className="flex-row flex-wrap mb-2">
                {plotKindPills.map((type) => (
                  <PillButton
                    key={type}
                    label={type}
                    selected={plotKinds.includes(type)}
                    onPress={() => setPlotKinds([type])}
                  />
                ))}
              </View>
            </>
          )}

          {selectedType === "Hospitality" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('hospitality_kind_question')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {hospitalityKindPills.map((p) => (
                  <PillButton
                    key={p}
                    label={p}
                    selected={HospitalityKinds.includes(p)}
                    onPress={() => setHospitalityKinds([p])}
                  />
                ))}
              </View>
            </>
          )}

          {selectedType === "Storage" && (
            <>
              <Text className="text-[15px] text-[#00000099] font-bold mb-2">
                {t('storage_kind_question')}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {storageKindPills.map((p) => (
                  <PillButton
                    key={p}
                    label={p}
                    selected={storageKinds.includes(p)}
                    onPress={() => setStorageKinds([p])}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {selectedType === "Other" && <Other />}
      </ScrollView>

      <View className="border-t border-gray-200 bg-white">
        <View className="flex-row justify-end mt-4 space-x-3 mx-3 mb-12">
          <TouchableOpacity
            className="px-10 py-3 rounded-lg bg-gray-200 mx-3"
          >
            <Text className="font-semibold">{t('button_cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-8 py-3 rounded-lg bg-green-500"
            onPress={handleNext}
          >
            <Text className="text-white font-semibold">{t('button_next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}