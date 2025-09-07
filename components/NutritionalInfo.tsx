import { View, Text } from "react-native";
import React from "react";

interface NutritionalInfoProps {
  calories: number;
  protein: number;
  rating: number;
}

const NutritionalInfo = ({ calories, protein, rating }: NutritionalInfoProps) => {
  return (
    <View className="bg-white rounded-2xl p-6 mx-6 mt-4 shadow-md shadow-black/5">
      <Text className="h3-bold text-dark-100 mb-4">Nutritional Information</Text>
      
      <View className="flex-row items-center justify-around">
        <View className="flex-1 items-center">
          <View className="bg-primary/10 rounded-full size-16 flex-center mb-2">
            <Text className="paragraph-bold text-primary">{calories}</Text>
          </View>
          <Text className="body-medium text-gray-100">Calories</Text>
        </View>
        
        <View className="flex-1 items-center">
          <View className="bg-success/10 rounded-full size-16 flex-center mb-2">
            <Text className="paragraph-bold text-success">{protein}g</Text>
          </View>
          <Text className="body-medium text-gray-100">Protein</Text>
        </View>
        
        <View className="flex-1 items-center">
          <View className="bg-yellow-500/10 rounded-full size-16 flex-center mb-2">
            <Text className="paragraph-bold text-yellow-500">⭐ {rating}</Text>
          </View>
          <Text className="body-medium text-gray-100">Rating</Text>
        </View>
      </View>
    </View>
  );
};

export default NutritionalInfo;
