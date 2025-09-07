import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { CartCustomization } from "@/type";

interface Customization {
  $id: string;
  name: string;
  price: number;
  type: string;
}

interface CustomizationSelectorProps {
  title: string;
  customizations: Customization[];
  selectedCustomizations: CartCustomization[];
  onCustomizationToggle: (customization: CartCustomization) => void;
}

const CustomizationSelector = ({
  title,
  customizations,
  selectedCustomizations,
  onCustomizationToggle,
}: CustomizationSelectorProps) => {
  const isSelected = (customization: Customization) => {
    return selectedCustomizations.some((selected) => selected.id === customization.$id);
  };

  const renderCustomization = ({ item }: { item: Customization }) => {
    const selected = isSelected(item);
    
    return (
      <TouchableOpacity
        onPress={() => onCustomizationToggle({
          id: item.$id,
          name: item.name,
          price: item.price,
          type: item.type,
        })}
        className={`bg-white rounded-2xl p-4 mb-3 shadow-md shadow-black/5 ${
          selected ? "border-2 border-primary" : "border border-gray-100"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="paragraph-semibold text-dark-100 mb-1">
              {item.name}
            </Text>
            <Text className="body-regular text-gray-100">
              +${item.price.toFixed(2)}
            </Text>
          </View>
          
          <View
            className={`size-6 rounded-full border-2 flex-center ${
              selected
                ? "bg-primary border-primary"
                : "border-gray-200 bg-transparent"
            }`}
          >
            {selected && (
              <View className="size-2 bg-white rounded-full" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (customizations.length === 0) return null;

  return (
    <View className="mx-6 mt-4">
      <Text className="h3-bold text-dark-100 mb-4">{title}</Text>
      <FlatList
        data={customizations}
        renderItem={renderCustomization}
        keyExtractor={(item) => item.$id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CustomizationSelector;
