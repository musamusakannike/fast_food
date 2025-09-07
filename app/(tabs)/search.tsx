import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import CartButton from "@/components/CartButton";
import cn from "clsx"
import MenuCard from "@/components/MenuCard";
import { MenuItem, Category } from "@/type";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const { data, refetch, loading } = useAppwrite<MenuItem[], { category: string; query: string; limit?: number }>({
    fn: getMenu,
    params: {
      category: (category as string) || "",
      query: (query as string) || "",
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite<Category[], Record<string, string | number>>({
    fn: getCategories,
  });

  useEffect(() => {
    refetch({ category: (category as string) || "", query: (query as string) || "", limit: 6 });
  }, [category, query, refetch]);

  useEffect(() => {
    console.log("categories: ", JSON.stringify(categories, null, 2));
  }, [categories]);

  // console.log(JSON.stringify(data, null, 6));
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList<MenuItem>
        data={data || []}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? "mt-10" : "mt-0")}>
              <MenuCard item={item} />
            </View>
          );
        }}
        keyExtractor={item => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    FInd your favourite food
                  </Text>
                </View>
              </View>
              <CartButton />
            </View>
            <SearchBar />
            <Filter categories={categories || []} />
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results found</Text>}
      />
    </SafeAreaView>
  );
};

export default Search;
