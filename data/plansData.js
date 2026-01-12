// src/data/plansData.js
import diamond from "../assets/diamond.png";
import gold from "../assets/gold.png";
import platinum from "../assets/platinum.png";
export const subscriptionPlans = [
  {
    id: "gold",
    title: "Gold",
    image: gold,
    color: "#FFCC00",
    price: 999,
    period: "month",
    features: [
      "List up to 10 properties",
      "Basic property analytics",
      "Email support",
      "Standard listing visibility",
      "Mobile app access",
      "Property image gallery (10 images)",
      
    ],
  },

  {
    id: "platinum",
    title: "Platinum",
    image: platinum,
    color: "#9EB6FF",
    price: 2999,
    period: "month",
    features: [
      "List up to 25 properties",
      "Advanced property analytics",
      "Premium customer support",
      "High listing visibility",
      "Mobile & Web access",
      "Image gallery (30 images)",
        "Virtual tour Integration",
      "Lead management dashboard",
      "Whatsapp integration",
    ],
  },

  {
    id: "diamond",
    title: "Diamond",
   image: diamond,
    color: "#00C4C4",
    price: 3999,
    period: "month",
    features: [
      "Unlimited property listings",
      "Full analytics suite",
      "24/7 VIP support",
      "Top-tier listing visibility",
      "All device access",
      "Unlimited images",
      "Virtual tour Integration",
      "Lead management dashboard",
      "Whatsapp integration",
      "Custom branding options",
      "API access",
      "Featured listings placement"
    ],
  },
];
