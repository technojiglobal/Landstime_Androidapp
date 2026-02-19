// Frontend/app/home/screens/Sidebar/PrivacyPolicy.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    content: [
      "We, at Landstime Pvt Ltd, and affiliates are committed to respecting your online privacy and recognize your need for appropriate protection and management of any personally identifiable information you share with us.",
      "This Privacy Policy (\"Policy\") governs our website available at landstime.com and our mobile application (collectively, the \"Platform\"). The Policy describes how Landstime Pvt Ltd (hereinafter referred to as the \"Company\") collects, uses, discloses and transfers personal data of users while browsing the Platform or availing specific services therein.",
      "This Policy describes how we process personal data of all users of our Platform or Services, including buyers, renters, owners, dealers, brokers, and website visitors.",
      "\"Personal Data\" means any data about an individual who is identifiable by or in relation to such data.",
      "By providing your consent to this Policy, either on the Platform or through other means, or accessing the Platform and Services, you consent to the Company's processing of your Personal Data in accordance with this Policy.",
    ],
  },
  {
    id: "1",
    title: "1. Personal Data We Collect",
    content: [
      "We collect the following types of Personal Data about you when you access our Platform or Services:",
      "A. Information you give us:",
      "We collect information you provide to us directly when you use our Platforms (like when you sign-up/register an account, or post a property listing).",
      "• Personal Details: This includes your name, contact information (like addresses, e-mail addresses, phone number), and login information.",
      "• Property Details: This includes the details of the property such as nature of property (commercial, residential, etc.), location details, property profile, photographs, pricing details and amenities.",
      "• Identification Documents: This includes any information that helps us identify and verify you (such as Aadhaar, voter id, driver's license, PAN, passport, etc.) or your property.",
      "• Payment Information: We use third-party payment service providers to process your payments.",
      "• Communications Details: This includes records of your calls, emails, messages or your communications related to any feedback, comments, queries, or customer support.",
      "• Voice Recordings: Where you choose to include voiceovers in your property listings and property videos.",
      "B. Information we collect when you use our Platforms:",
      "• Usage data: Data collected about you when you access the Platform, such as your search queries, account settings, times at which you access the Platforms.",
      "• Technical data: Data about the devices, software and technology you use such as hardware model, operating system, IP address, preferred languages, unique device identifiers.",
      "• General or approximate location data: General location data, such as your city, region, or country.",
      "• Communication data: When you communicate with the Platform or use the Platform to communicate with other members.",
      "• Cookies data: We use cookies or other similar technologies to recognise your device, remember you and support the continuity of your experience.",
      "• Purchase or transactional data: Transactional details, such as details about your purchase orders and the payments to and from your accounts with us.",
      "C. Information we receive from other sources:",
      "We may receive information about you from third parties, such as advertising and marketing partners. We may collect your information through property campaigns and publicly available sources.",
    ],
  },
  {
    id: "2",
    title: "2. How We Use Your Personal Data",
    content: [
      "The Platform may process your Personal Data for the following purposes:",
      "A. Provision of the Platform and Services: We use your Personal Data to provide the Services and access to Platform, and to enable you to use the various features of the Platforms — for account creation, onboarding, registration, property listing, and for giving visibility into your profile to other users.",
      "B. Our marketing activities: We may use Personal Data to provide you marketing and promotional material and notify you of discounts and offers, about our Platform and Services.",
      "C. Third-party marketing activities: Based on your expression of interest, we may share your Personal Data with third-parties (like banks, NBFCs, banking agents, etc.) so that they can contact you for their own promotional/marketing purposes.",
      "D. For Platform and Service improvement: We may use Personal Data to improve our Platform and its content, to ideate, develop and provide new or better Platform features or Services.",
      "E. For fraud prevention: We may use Personal Data for identifying suspicious users or property listings, for verifying users and property listings, for ensuring network security.",
      "F. For troubleshooting and recovery: We may use your Personal Data to troubleshoot issues or problems with the Platform or Services.",
      "G. Analytics Operations: We may collect and use analytics information together with your Personal Data to build a broader profile of our users.",
      "H. Legal Obligation: In some cases, the Company will need to collect Personal Data to comply with any legal obligation.",
      "I. For communicating with you: We use your personal data to respond to your queries, comments, or feedback, resolve issues faced by you on a Platform.",
      "J. For grievance redressal: We may use your Personal Data to address your grievances and to respond to your complaints.",
    ],
  },
  {
    id: "3",
    title: "3. Cookies",
    content: [
      "Some of our web pages utilize \"Cookies\" and other tracking technologies. A Cookie is a small text file that may be used to collect information about web-site activity.",
      "Most browsers allow you to control cookies, including whether or not to accept them and how to remove them. You may set most browsers to notify you if you receive a cookie, or you may choose to block cookies with your browser.",
      "Tracking technologies may record information such as Internet domain and host names, Internet protocol (IP) addresses, browser software and operating system types, clickstream patterns, and dates and times that our site is accessed.",
    ],
  },
  {
    id: "4",
    title: "4. Who We Share Your Personal Data With",
    content: [
      "The Company may disclose Personal Data only for the purposes explained in this Privacy Policy, with the following third parties:",
      "• Service Providers: The Company may disclose Personal Data with service providers, vendors, consultants, agents, or others who assist the Company in operating the Platform or providing the Services.",
      "• Other Platform users: The Company may share your information with other users of the Platform, such as owners, renters, brokers, dealers, to establish connectivity with such other users.",
      "• Banking Partners: The Company may share your Personal Data with participating banks, NBFCs, their employees or agents, based on your expression of interest regarding home loans.",
      "• Legal Purpose: The Company shares personal data when required by law, such as responding to subpoenas, court orders, or legal process.",
      "• Corporate Restructuring: The Company may share personal data with another Company pursuant to any corporate re-organisation, amalgamation or restructuring.",
      "• Other Third Parties: The Company may share your Personal Data with other third parties, on a need-to-know basis, such as accountants, lawyers, auditors, etc.",
    ],
  },
  {
    id: "5",
    title: "5. Your Rights",
    content: [
      "If you wish to access, verify, correct, complete, update or erase any of your Personal Data collected through the Platforms or Services, you may write to us at feedback@landstime.com.",
      "You may withdraw your consent for any or all processing of your Personal Data by contacting services@landstime.com. Do note however, that the Company reserves the right to refuse to provide you access to the Platform and Services in circumstances where such Personal Data is essential.",
      "We (or our service providers or partners) may communicate with you through voice calls, text messages, emails, Platform notifications, or other means.",
    ],
  },
  {
    id: "6",
    title: "6. Storage and Protection of Personal Data",
    content: [
      "Our Company is located in India. We store and process your personal data in India. However, we may transfer your personal data to our service providers or partners in other parts of the world.",
      "The security and confidentiality of your personal data is important to us and Company has invested significant resources to protect the safekeeping and confidentiality of your Personal Data.",
      "The Company has physical, electronic, and procedural safeguards that comply with the laws prevalent in India to protect Personal Data and take appropriate security measures to protect against unauthorized access.",
    ],
  },
  {
    id: "7",
    title: "7. Retention of Personal Data",
    content: [
      "Your personal data is processed and retained to enable your access or use of the Platform and Services. We will keep your Personal Data as long as it is necessary to provide you Services on the Platform.",
      "To ensure compliance with applicable laws or other legal obligations, or to exercise our legal rights, we may need to retain information even after you have requested us to erase your personal data, terminated your account with us, or stopped using the Platform.",
    ],
  },
  {
    id: "8",
    title: "8. Third Party Websites, Apps and Services",
    content: [
      "The Platform may contain links to third party websites, apps, or services, such as websites of our partners. This Privacy Policy does not apply to collection, use, storage, sharing, etc. by third parties when you visit or interact with those websites.",
      "We have no responsibility or liability for the content, activities and services relating to those linked websites, and for data collection, use, storage, sharing, etc. by third parties.",
    ],
  },
  {
    id: "9",
    title: "9. Children",
    content: [
      "The Platform is not intended for use by children under 18 years of age. Any use of Platform by a child under the age of 18 years must be under parental supervision.",
      "We do not knowingly collect any information about, or market to, children, minors or anyone under the age of 18. If you are less than 18 years of age, please do not provide any information to us on this Platform.",
    ],
  },
  {
    id: "10",
    title: "10. Changes to This Privacy Policy",
    content: [
      "The Platform reserves the right to update, change or modify this Policy at any time. The Policy shall come to effect from the date of such update, change or modification.",
    ],
  },
  {
    id: "11",
    title: "11. Grievance Redressal",
    content: [
      "Questions, concerns or complaints related to the processing of your Personal Data may be made to the Grievance Officer appointed by the Company.",
      "Grievance Officer: Apurv Sud",
      "Company: Landstime Pvt Limited (landstime.com)",
      "Address: Flat no. G1, Rajkamal Enclave, Prasanthi nagar, Visakhapatnam",
      "Email: privacy@landstime.com",
    ],
  },
];

export default function PrivacyPolicy() {
  const router = useRouter();
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#15803d",
          paddingTop: 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 15, marginLeft: 8 }}>
            {t("back") || "Back"}
          </Text>
        </TouchableOpacity>

        {/* Icon + Title */}
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
          </View>
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Privacy Policy
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Landstime Pvt Limited
          </Text>
        </View>
      </View>

      {/* Intro Card */}
      <View
        style={{
          margin: 16,
          padding: 14,
          backgroundColor: "#f0fdf4",
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: "#15803d",
        }}
      >
        <Text style={{ fontSize: 13, color: "#166534", lineHeight: 20 }}>
          This Privacy Policy is divided into the following sections: Personal Data we collect • How we use your Personal Data • Who we share your Personal Data with • Data storage and retention • Your rights • Data protection practices • Third party websites • Children • Changes to the policy • How to contact us.
        </Text>
      </View>

      {/* Accordion Sections */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {sections.map((section) => {
          const isOpen = expandedSection === section.id;
          return (
            <View
              key={section.id}
              style={{
                marginBottom: 8,
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: isOpen ? "#15803d" : "#e5e7eb",
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              {/* Accordion Header */}
              <TouchableOpacity
                onPress={() => toggleSection(section.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 14,
                  backgroundColor: isOpen ? "#f0fdf4" : "#fff",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: "600",
                    color: isOpen ? "#15803d" : "#1f2937",
                    marginRight: 8,
                  }}
                >
                  {section.title}
                </Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={isOpen ? "#15803d" : "#9ca3af"}
                />
              </TouchableOpacity>

              {/* Accordion Content */}
              {isOpen && (
                <View
                  style={{
                    padding: 14,
                    paddingTop: 4,
                    backgroundColor: "#fff",
                    borderTopWidth: 1,
                    borderTopColor: "#f3f4f6",
                  }}
                >
                  {section.content.map((para, i) => (
                    <Text
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "#374151",
                        lineHeight: 21,
                        marginBottom: i < section.content.length - 1 ? 10 : 0,
                        fontWeight:
                          para.startsWith("A.") ||
                          para.startsWith("B.") ||
                          para.startsWith("C.") ||
                          para.startsWith("D.") ||
                          para.startsWith("E.") ||
                          para.startsWith("F.") ||
                          para.startsWith("G.") ||
                          para.startsWith("H.") ||
                          para.startsWith("I.") ||
                          para.startsWith("J.")
                            ? "600"
                            : "400",
                      }}
                    >
                      {para}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Footer note */}
        <View
          style={{
            marginTop: 12,
            padding: 14,
            backgroundColor: "#f9fafb",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 18 }}>
            For privacy concerns, contact privacy@landstime.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}