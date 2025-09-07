import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { Category } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import cn from "clsx";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "");

  const handlePress = (id: string) => {
    setActive(id);
    if (id === "all") {
      router.setParams({ category: undefined });
    } else {
      router.setParams({ category: id });
    }
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "all", name: "All" }, ...categories]
    : [{ $id: "all", name: "All" }];
  return (
    <FlatList
      data={filterData}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={
              Platform.OS === "android"
                ? { elevation: 5, shadowColor: "#878787" }
                : {}
            }
            key={item.$id}
            onPress={() => handlePress(item.$id)}
            className={cn(
              "filter",
              active === item.$id ? "bg-amber-500" : "bg-white"
            )}
          >
            <Text className={cn("body-medium", active === item.$id ? "text-white" : "text-gray-200")}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default Filter;
