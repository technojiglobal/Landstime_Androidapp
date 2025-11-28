import { Image } from "react-native";

export const fetchChats = async () => {
  return [
    {
      id: "1",
      name: "Jagadeesh",
      role: "Property Owner",
      lastMessage: "Thanks for your interest in the Surya Apartments",
      time: "8:23 PM",
      unreadCount: 3,
      image: Image.resolveAssetSource(
        require("../../assets/profile.jpg")
      ).uri,
      online: true,
    },
    {
      id: "2",
      name: "Rajendra",
      role: "Property Owner",
      lastMessage: "I have great properties",
      time: "01:15 PM",
      unreadCount: 0,
      image: Image.resolveAssetSource(
        require("../../assets/profile.png")
      ).uri,
      online: false,
    },
  ];
};

export const fetchChatMessages = async (chatId) => {
  return [
    {
      id: "m1",
      sender: "other",
      text:
        "Heyy! It's been a while since we had a proper chat. How’s everything going with you? 😊 Been up to anything new or interesting lately?",
    },
    { id: "m2", sender: "me", text: "I'm good, how about you?" },
    {
      id: "m3",
      sender: "other",
      text: "I'm doing good, thanks! How about you?",
    },
    { id: "m4", sender: "other", text: "All okay! How are you?" },
  ];
};
