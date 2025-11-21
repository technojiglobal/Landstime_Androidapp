// src/components/ContactForm.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import {useRouter} from "expo-router"
export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agent, setAgent] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [viewEnabled, setViewEnabled] = useState(false);

  useEffect(() => {
    const ready = name && phone && agent && accepted;
    setViewEnabled(!!ready);
  }, [name, phone, agent, accepted]);

  const handleChangeNumber = () => setPhone("");
  const router=useRouter();
  // ✅ Allow only numeric input (0–9)
  const handlePhoneChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ""); // strip non-digits
    setPhone(numericText);
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      {/* 🟩 Top Box */}
      <View className="w-[412px] h-[215px] rounded-b-[30px] bg-[#22C55E33] mt-10 items-start justify-center px-5">
        <Text className="ml-8 text-[19px] text-[#4E4E4E] font-medium">
          Please share your details to contact {"\n"}
          the Owner
        </Text>
      </View>

      {/* 👤 Owner Card */}
      <View className="absolute top-[200px] w-[371px] h-[100px] bg-white border border-[#0000001A] rounded-[10px] flex-row items-center px-4">
        <View className="w-12 h-12 rounded-full bg-[#E6F8EF] items-center justify-center">
          <Text className="text-green-600 font-semibold">US</Text>
        </View>

        <View className="ml-3">
          <View className="flex-row items-center">
            <Text className="text-[14px] text-[#000000CC] font-semibold">Uma Shankar</Text>
            <View className="ml-2 w-[48px] h-[16px] bg-white border border-[#0000001A] rounded-[6px] items-center justify-center">
              <Text className="text-[9px] text-[#00000099]">Owner</Text>
            </View>
          </View>
          <Text className="text-[14px] text-[#00000052] mt-1">
            UmaHomes | +91-7xxxxxxxx44
          </Text>
        </View>
      </View>

      {/* 🧾 Form Section */}
      <View className="absolute top-[323px] w-[371px]">
        {/* Name box */}
        <View className="bg-white w-[371px] h-[72px] rounded-[8px] border border-[#0000001A] px-3 py-2 mb-4">
          <Text className="text-[14px] text-[#00000099]">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#00000052"
            className="text-[14px] text-[#000000CC] mt-1"
          />
        </View>

        {/* Phone box */}
        <View className="bg-[#F4F7F5] w-[371px] h-[72px] rounded-[8px] border border-[#0000001A] px-3 py-2">
          <Text className="text-[14px] text-[#00000099]">Phone Number</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-[14px] text-[#000000CC] mr-2">+91</Text>
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange} // ✅ numeric only
              keyboardType="numeric" // ensures numeric keypad
              placeholder="Enter number"
              placeholderTextColor="#00000052"
              className="flex-1 text-[14px] text-[#000000CC]"
              maxLength={10} // optional: restrict to 10 digits
            />
            {/* ✅ Use a gray lock explicitly (no emoji color) 
            <Text className="text-[#808080] text-[18px]">🔒</Text>*/}
          </View>
        </View>

        {/* Change Number link */}
        <TouchableOpacity onPress={handleChangeNumber} activeOpacity={0.7}>
          <Text className="text-[13px] text-green-600 mt-2">Change Number</Text>
        </TouchableOpacity>

        {/* Agent Yes/No */}
        <Text className="text-[14px] text-black mt-3 mb-2">
          Are you a Real Estate Agent
        </Text>
        <View className="flex-row space-x-3">
          {["yes", "no"].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setAgent(opt)}
              className={`w-[84px] h-[34px] rounded-[8px] items-center justify-center border border-[#0000001A] mx-2 ${
                agent === opt ? "bg-[#22C55E1A]" : "bg-white"
              }`}
            >
              <Text className="text-[14px] text-[#000000CC] capitalize">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Checkbox */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity
            onPress={() => setAccepted(!accepted)}
            className={`w-5 h-5 rounded-[4px] border ${
              accepted ? "bg-[#22C55E] border-[#22C55E]" : "border-[#C0C0C0]"
            } items-center justify-center`}
          >
            {accepted && <Text className="text-white text-[12px] font-bold">✓</Text>}
          </TouchableOpacity>
          <Text className="ml-3 text-[#000000CC] text-[14px]">
            I agree to{" "}
            <Text className="text-[#22C55E] font-semibold">Terms & Conditions</Text> and{" "}
            <Text className="text-[#22C55E] font-semibold">Privacy Policy</Text>
          </Text>
        </View>

        {/* View Contact Button */}
        <TouchableOpacity
          disabled={!viewEnabled}
          className={`h-12 rounded-[8px] items-center justify-center mt-6 border border-[#0000001A] ${
            viewEnabled ? "bg-[#22C55E]" : "bg-white"
          }`}
          onPress={() => router.push("/home/screens/Commercial/ViewContact")}
        >
          <Text
            className={`text-[20px] font-semibold ${
              viewEnabled ? "text-white" : "text-[#00000099]"
            }`}
          >
            View Contact
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
