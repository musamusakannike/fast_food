import { View, Text, Image } from "react-native";
import React from "react";
import { ProfileFieldProps } from "@/type";

const ProfileField = ({ label, value, icon }: ProfileFieldProps) => {
  return (
    <View className="profile-field">
      <View className="profile-field__icon">
        <Image
          source={icon}
          className="size-6"
          resizeMode="contain"
          tintColor="#FE8C00"
        />
      </View>
      <View className="flex-1">
        <Text className="body-medium text-gray-100 mb-1">{label}</Text>
        <Text className="paragraph-semibold text-dark-100">{value}</Text>
      </View>
    </View>
  );
};

export default ProfileField;
