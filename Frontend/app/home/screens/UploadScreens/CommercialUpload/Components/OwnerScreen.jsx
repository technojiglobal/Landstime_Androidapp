import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import DocumentUpload from "components/Documentupload";
import OwnerDetails from "components/OwnersDetails";

export default function OwnerScreen() {
    const router = useRouter();

    // State for documents
    const [ownershipDocs, setOwnershipDocs] = useState([]);
    const [identityDocs, setIdentityDocs] = useState([]);

    // State for owner details
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [focusedField, setFocusedField] = useState(null);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (ownershipDocs.length === 0) {
            Alert.alert("Error", "Please upload property ownership documents.");
            return;
        }
        if (identityDocs.length === 0) {
            Alert.alert("Error", "Please upload owner identity documents.");
            return;
        }
        if (!ownerName.trim()) {
            Alert.alert("Error", "Please enter owner name.");
            return;
        }
        if (!phone.trim()) {
            Alert.alert("Error", "Please enter phone number.");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Error", "Please enter email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Implement API call to submit property with owner details
            // For now, just show success and navigate
            Alert.alert("Success", "Property uploaded successfully!", [
                {
                    text: "OK",
                    onPress: () => router.push("/(tabs)/home"),
                },
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to upload property. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-[#F5F6F8]">
            <View className="flex-row items-center mt-3 mb-4">
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/home")}
                            className="p-2"
                            accessibilityRole="button"
                        >
                            <Image
                                source={require("../../../../../../assets/arrow.png")}
                                style={{ width: 20, height: 20, resizeMode: "contain" }}
                            />
                        </TouchableOpacity>
                        <View className="ml-2">
                            <Text className="text-[16px] font-semibold">
                                Upload Your Property
                            </Text>
                            <Text className="text-[12px] text-[#00000066]">
                                Add your property details
                            </Text>
                        </View>
                    </View>
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
                showsVerticalScrollIndicator={false}
            >

                {/* uploads + owner details */}
                <View className="px-4 mt-4 space-y-4">

                    {/* Header */}
                    

                    {/* Document Uploads */}
                    <DocumentUpload
                        title="Property Ownership"
                        subtitle="Verify ownership to publish your property listing securely."
                        files={ownershipDocs}
                        setFiles={setOwnershipDocs}
                        required
                    />

                    <DocumentUpload
                        title="Owner Identity"
                        subtitle="Upload PAN, Aadhaar, Passport or Driver's License"
                        files={identityDocs}
                        setFiles={setIdentityDocs}
                        required
                    />

                    {/* Owner Details */}
                    <OwnerDetails
                        ownerName={ownerName}
                        setOwnerName={setOwnerName}
                        phone={phone}
                        setPhone={setPhone}
                        email={email}
                        setEmail={setEmail}
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                    />

                    {/* Action Buttons */}
                   
                </View>
            </ScrollView>
             <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: 16,
                            gap: 12,
                        }}
                        className="space-x-3 mr-4 mb-3"
                    >
                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#E5E7EB",
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                            }}
                            onPress={() => router.push("/(tabs)/home")}
                        >
                            <Text
                                style={{ color: "black", fontWeight: "600", fontSize: 15 }}
                            >
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
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text
                                style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                            >
                                {isSubmitting ? "Uploading..." : "Upload Property"}
                            </Text>
                        </TouchableOpacity>
                    </View>
        </View>

    );
}