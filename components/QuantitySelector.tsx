import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  style?: string;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  style = "",
}: QuantitySelectorProps) => {
  return (
    <View className={`flex-row items-center ${style}`}>
      <TouchableOpacity
        onPress={onDecrease}
        className="cart-item__actions bg-gray-100"
        disabled={quantity <= 1}
      >
        <Image
          source={images.minus}
          className="size-3"
          resizeMode="contain"
          tintColor={quantity <= 1 ? "#888" : "#FE8C00"}
        />
      </TouchableOpacity>

      <Text className="paragraph-semibold text-dark-100 mx-4">
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={onIncrease}
        className="cart-item__actions bg-primary/10"
      >
        <Image
          source={images.plus}
          className="size-3"
          resizeMode="contain"
          tintColor="#FE8C00"
        />
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
