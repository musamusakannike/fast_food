import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { images } from "@/constants";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query || "");

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text) router.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    router.setParams({ query });
  };

  return (
    <View className="searchbar">
      <TextInput
        placeholder="Search..."
        className="p-5 flex-1"
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor={"#A0A0A0"}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity
        onPress={() => router.setParams({ query })}
        className="pr-5"
      >
        <Image
          source={images.search}
          tintColor={"#5D5F6D"}
          className="size-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
