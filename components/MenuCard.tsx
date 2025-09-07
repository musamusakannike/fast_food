import { Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { MenuItem } from "@/type";
import { Image } from "expo-image";
import { router } from "expo-router";

const MenuCard = ({
  item: { $id, name, price, image_url },
}: {
  item: MenuItem;
}) => {
  const handlePress = () => {
    router.push(`/menu/${$id}`);
  };

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={handlePress}
    >
      <Image
        source={image_url}
        className="size-32 absolute -top-10"
        contentFit="contain"
      />

      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4" numberOfLines={1}>
        From ${price}
      </Text>
      <TouchableOpacity onPress={handlePress}>
        <Text className="paragraph-bold text-primary">View Details →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
