// Frontend/app/home/screens/Sidebar/TermsAndConditions.jsx

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
    id: "I",
    title: "I. Defined Terms",
    content: [
      "Unless otherwise specified, the capitalized words shall have the meanings as defined herein below:",
      "\"Agreement\" refers to the completed application form, its attachments, and these Terms. It shall be deemed to have been executed at Visakhapatnam.",
      "\"Landstime\" refers to Landstime Realty Services Pvt Limited, a company incorporated under the Companies Act, 1956, having its registered office at Flat no. G1 Rajkamal Enclave, Prasanthi nagar, Visakhapatnam.",
      "\"Date of Commencement\" is the date indicating the acceptance of the application by the User to the Services.",
      "\"Date of Termination\" is the date of expiry mentioned in the notice or/and the letter of termination.",
      "\"Landstime.com\" is defined as the internet website or mobile application of the Landstime at www.landstime.com.",
      "\"My Subscriptions\" refers to the section providing descriptions and details of the Services availed by the User.",
      "\"Registration Data\" is the database of all the particulars and information supplied by the User on initial application and subscription.",
      "\"User / You\" includes any Subscriber, Advertiser, Browser, or Visitor either an individual or a juristic personality.",
      "\"Confidential Information\" shall mean any and all non-public, proprietary, technical, financial, strategic, commercial, operational or business-related information.",
    ],
  },
  {
    id: "II",
    title: "II. Services",
    content: [
      "Landstime provides various internet-based Services through its platform, including:",
      "• Posting property listings and User profiles for sale, rent, or related Service.",
      "• Searching for properties via Landstime.com and its associated links.",
      "• Placing print advertisements in group publications through the platform.",
      "• Posting online advertisements.",
      "• Sending promotional messages via email or SMS.",
      "• Other Services as mentioned on Site or as stated in these Terms.",
      "Services may be purchased through available payment options and are subject to applicable policies, including subscription fees, refunds, and cancellations.",
    ],
  },
  {
    id: "III",
    title: "III. Eligibility",
    content: [
      "You represent and warrant that you are at least 18 years of age and competent to enter into a valid and binding contract apart from being capable of entering, performing and adhering to these Terms. Minors, i.e., individuals under the age of 18 years, are not eligible to use the Services.",
    ],
  },
  {
    id: "IV",
    title: "IV. Subscription Fees",
    content: [
      "The applicable Subscription Fees shall be as specified on the \"My Subscriptions\" page or as notified by Landstime from time to time.",
      "Subscription Fee liability shall commence from the Date of Commencement.",
      "Users accessing or posting property listings for purchase purposes are exempt from this clause, unless otherwise notified by Landstime.",
    ],
  },
  {
    id: "V",
    title: "V. Payment & Refund",
    content: [
      "For all Services, 50% of the total order value shall be considered as activation/administration charges. The remaining 50% may be refundable on a pro-rata basis upon cancellation.",
      "Users are required to pay the Subscription Fees within the time period specified in the invoice(s) issued by Landstime.",
      "Any delay by the User in making payments will attract interest on the outstanding amount from the due date until the date of full payment.",
      "All payments made through the iOS application are strictly non-refundable.",
      "For Owner's Services: The subscription fee is non-refundable. However, if the property is not linked to the purchased package, 50% of the order amount shall be forfeited as activation charges.",
    ],
  },
  {
    id: "VI",
    title: "VI. Charge Back Policy",
    content: [
      "Payment for Services shall be made on a 100% advance basis.",
      "Once subscribed, payments are non-refundable and shall be appropriated by Landstime.",
      "Refunds, if any, are at the sole discretion of Landstime.",
      "Landstime does not guarantee the accuracy or timeliness of refunds to User bank accounts/cards, due to the involvement of multiple entities and system limitations.",
    ],
  },
  {
    id: "VII",
    title: "VII. Cancellation",
    content: [
      "Landstime reserves the sole and absolute right to refuse, cancel, or withhold the publication of any content on its platform without prior notice. In such cases, applicable cancellation charges shall apply.",
      "Payments made online for Platinum Listing Packages are strictly non-refundable and non-cancellable.",
    ],
  },
  {
    id: "VIII",
    title: "VIII. Security",
    content: [
      "Transactions on the Site are encrypted and secure. Credit/debit card details are handled solely by authorized payment gateways and not stored by Landstime.",
      "Users must safeguard their usernames and passwords, including changing the password periodically and refraining from sharing it with third parties.",
      "Access to Services must be through the credentials of the User.",
      "Loss or theft of login credentials must be reported immediately via email, WhatsApp or other means of communication.",
      "Landstime shall not be liable for any fraudulent transactions or unauthorized deductions from the User bank account.",
    ],
  },
  {
    id: "IX",
    title: "IX. Obligations and Representations of User",
    content: [
      "User to provide accurate, complete, and correct Registration Data at the time of application for the Services.",
      "User acknowledge that all data entered on the Site is subject to verification by Landstime.",
      "User to comply with all instructions or notices issued by Landstime for Services usage.",
      "User shall be responsible for all information retrieved, stored, or transmitted via the Services.",
      "User shall maintain confidentiality of their login credentials and all activities performed under their account.",
      "User acknowledges that listings may take up to 48 hours to reflect on the Site.",
      "User has consented to Landstime use, storage, and commercial exploitation of submitted data subject to the provisions of Digital Personal Data Protection Act, 2023.",
    ],
  },
  {
    id: "X",
    title: "X. Prohibited Actions",
    content: [
      "User shall not permit unauthorized persons to access or use the Services, nor shall they resell, sublicense, assign, or commercially exploit the Services.",
      "The Services must only be used for its intended and subscribed purpose and in compliance with applicable Indian laws.",
      "Users are prohibited from posting, transmitting, or storing content that is defamatory, obscene, pornographic, abusive, threatening, harassing, or racially objectionable.",
      "Content that endangers India's sovereignty, security, unity, or promotes incitement of cognizable offences is strictly prohibited.",
      "Uploading or transmitting viruses, malware, or malicious code; attempting unauthorized access to systems or networks is strictly prohibited.",
      "Violation of these Terms may result in suspension, deactivation, or blacklisting of the User account.",
    ],
  },
  {
    id: "XI",
    title: "XI. Intellectual Property Rights",
    content: [
      "All intellectual property rights in the Site, Services, property listings, User data, and all related content remain the sole and exclusive property of Landstime.",
      "Any content contributed by a User shall automatically vest in Landstime. Reproduction or reuse of such content elsewhere constitutes infringement.",
      "All trademarks, logos, and brand elements displayed on the Site are owned by or licensed to Landstime. No right or license is granted to any User.",
      "Users are granted a limited, non-transferable, non-exclusive, and revocable license to access and use the Services, strictly in accordance with these Terms.",
    ],
  },
  {
    id: "XII",
    title: "XII. Confidentiality",
    content: [
      "The User acknowledges and agrees that, in the course of using Landstime platform or Services, you may receive or gain access to certain non-public, sensitive, or proprietary information relating to Landstime.",
      "You agree not to use any such information for your own benefit or for the benefit of any third party, except as strictly necessary for your use of the platform.",
      "These confidentiality obligations shall survive the termination or expiration of your access to or use of the platform and Services.",
    ],
  },
  {
    id: "XIII-XIV",
    title: "XIII. Amendments & XIV. Services Modification",
    content: [
      "The right to amend, vary, or modify the Terms shall rest exclusively with Landstime.",
      "Any such changes or updates will be posted on the Site. Users are advised to visit the Site regularly to review the latest Terms.",
      "Landstime reserves the right, at its sole discretion, to add, modify, suspend, or discontinue any aspect of the Services at any time.",
      "Landstime shall not be liable to the User or to any third party for any direct or indirect loss arising from the modification, suspension, or discontinuation of the Services.",
    ],
  },
  {
    id: "XV",
    title: "XV. Third Party Links",
    content: [
      "The Site may display or link to content, Services, advertisements, or goods provided by third-party websites or platforms.",
      "Hyperlinks and references to third-party websites are provided solely for User convenience and do not imply endorsement by Landstime.",
      "Landstime makes no warranties regarding third-party content, Services, or goods.",
      "Landstime functions only as a digital platform for listing and advertising and does not hold possession, control, or ownership over any third-party goods or Services.",
    ],
  },
  {
    id: "XVI-XVII",
    title: "XVI. Termination & XVII. Suspension",
    content: [
      "User may request suspension of the Services by submitting a written request to Landstime. Landstime shall have up to 30 (thirty) days from the date of receiving such request to review and respond.",
      "Landstime reserves the right to immediately terminate your access without prior notice if it has reasonable grounds to believe you have violated these Terms.",
      "In the event of termination, any fees or amounts paid by you shall be forfeited and shall not be refundable under any circumstances.",
      "If any monies payable by the User to Landstime are not paid on the due date, Landstime may suspend the Services provided to the User.",
    ],
  },
  {
    id: "XIX",
    title: "XIX. Violation of Terms",
    content: [
      "In the event of a violation of the Terms, Landstime, at its sole discretion, may pursue any of its legal remedies, including immediate deletion of any offending material.",
      "Landstime may pursue violators under applicable criminal and/or civil laws as per the relevant Acts, Rules, and regulations of the land.",
      "Landstime reserves the right to refuse Services to any User at any time and to remove any listings or advertisements for any reason, without prior notice.",
    ],
  },
  {
    id: "XXI",
    title: "XXI. Disclaimer",
    content: [
      "Landstime does not warrant, guarantee, or represent that the Services will meet your specific requirements or be uninterrupted, timely, secure, or error-free.",
      "Landstime makes no warranties regarding the accuracy, reliability, or quality of information obtained through the Site.",
      "Landstime operates as an intermediary under Section 2(w) of the Information Technology Act, 2000.",
      "Property descriptions and other content on the Site are for marketing purposes only. It is the sole responsibility of buyers/tenants and agents to verify accuracy.",
      "Value estimates provided on the Site are for informational purposes only and should not be relied upon for commercial decisions.",
    ],
  },
  {
    id: "XXII",
    title: "XXII. Limitation of Liability",
    content: [
      "Neither Landstime nor its group companies, directors, officers, or employees shall be liable for any direct, indirect, incidental, special, consequential, or exemplary damages.",
      "Landstime's total cumulative liability shall not exceed the amount paid by the User to Landstime related to the cause of action.",
      "Landstime accepts no responsibility for any shortage, failure, or non-fulfilment of the Services on the Site due to technical failure or any other reason.",
    ],
  },
  {
    id: "XXIII",
    title: "XXIII. Indemnity",
    content: [
      "User hereby agrees to indemnify, hold harmless, and settle any third-party lawsuit or proceeding brought against Landstime or any of its directors, employees, or Key Managerial Personnel in relation to User's use of the Services.",
    ],
  },
  {
    id: "XXIV",
    title: "XXIV. Grievance Redressal",
    content: [
      "Any complaints, abuse, or concerns with regard to content, comments, or breach of these Terms shall be immediately reported to the designated Grievance Officer.",
      "Website: www.landstime.com",
      "Address: Landstime Realty Services Pvt Limited, Rajkamal Enclave, Flat no.1, Prasanthi nagar, Vizag, India",
      "Email: grievance@landstime.com",
    ],
  },
  {
    id: "XXVIII",
    title: "XXVIII. Governing Law and Jurisdiction",
    content: [
      "There is no agency, partnership, joint venture, employer-employee, or franchisor-franchisee relationship between Landstime and any User.",
      "Any claim or cause of action arising out of or related to the use of the Services must be filed within 30 days after such claim or cause of action arose.",
      "The Agreement and any dispute shall be governed by the laws of India, and the parties submit to the exclusive jurisdiction of the courts at Visakhapatnam.",
    ],
  },
  {
    id: "XXIX",
    title: "XXIX. Acknowledgment and Acceptance",
    content: [
      "The Terms appearing above constitute the entire agreement between the User and Landstime and supersede all previous arrangements between the parties.",
      "It is our constant endeavour to make the Site an enjoyable and effective experience for all our Users. If you observe any material or behaviour that may violate Terms, please write to us.",
    ],
  },
];

export default function TermsAndConditions() {
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
            <Ionicons name="document-text" size={32} color="#fff" />
          </View>
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Terms & Conditions
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Landstime Realty Services Pvt Limited
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
          These General Terms & Conditions constitute a legally binding agreement between you and Landstime regarding your use of the platform. By using the Site, you shall be contracting with Landstime.
        </Text>
        <Text style={{ fontSize: 13, color: "#166534", lineHeight: 20, marginTop: 8 }}>
          Landstime reserves the right to amend or modify these Terms without any prior notice. Such modifications shall become effective immediately upon being posted on the Site.
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
            Last updated: 2024 • For queries, contact grievance@landstime.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}