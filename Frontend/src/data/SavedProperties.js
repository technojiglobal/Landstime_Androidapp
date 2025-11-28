// src/api/savedProperties.js
export const fetchSavedProperties = async () => {
  return [
    {
      id: "1",
      title: "Green Valley Site",
      subtitle: "Residential Plot Development",
      location: "Near Steel Plant",
      rating: 4,
      reviews: 124,
      price: "15L - 45L",
      image: require("../../assets/Flat1.jpg"),
    },
    {
      id: "2",
      title: "Sai Enclave",
      subtitle: "Premium Resort",
      location: "Gajuwaka Main Road",
      rating: 4,
      reviews: 89,
      price: "22L - 45L",
      image: require("../../assets/Flat2.jpg"),
    },
  ];
};
