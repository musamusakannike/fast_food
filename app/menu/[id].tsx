import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { getMenuItem } from "@/lib/appwrite";
import { CartCustomization, MenuItem } from "@/type";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import QuantitySelector from "@/components/QuantitySelector";
import CustomizationSelector from "@/components/CustomizationSelector";
import NutritionalInfo from "@/components/NutritionalInfo";

interface MenuItemWithCustomizations extends MenuItem {
  availableCustomizations: any[];
}

const MenuDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCartStore();
  
  const [menuItem, setMenuItem] = useState<MenuItemWithCustomizations | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartCustomization[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const item = await getMenuItem(id);
      setMenuItem(item as unknown as MenuItemWithCustomizations);
    } catch (error: any) {
      console.error("Error fetching menu item:", error);
      Alert.alert("Error", "Failed to load menu item details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizationToggle = (customization: CartCustomization) => {
    setSelectedCustomizations((prev) => {
      const isSelected = prev.some((item) => item.id === customization.id);
      
      if (isSelected) {
        // Remove customization
        return prev.filter((item) => item.id !== customization.id);
      } else {
        // Add customization
        return [...prev, customization];
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!menuItem) return 0;
    
    const basePrice = menuItem.price * quantity;
    const customizationsPrice = selectedCustomizations.reduce(
      (total, customization) => total + customization.price * quantity,
      0
    );
    
    return basePrice + customizationsPrice;
  };

  const handleAddToCart = async () => {
    if (!menuItem) return;
    
    setIsAddingToCart(true);
    try {
      // Add each quantity as a separate cart operation
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: menuItem.$id,
          name: menuItem.name,
          price: menuItem.price,
          image_url: menuItem.image_url,
          customizations: selectedCustomizations,
        });
      }
      
      Alert.alert("Success", `${quantity} ${menuItem.name}(s) added to cart!`);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text className="paragraph-medium text-gray-100 mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!menuItem) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="paragraph-medium text-gray-100">Menu item not found</Text>
      </SafeAreaView>
    );
  }

  // Group customizations by type
  const toppings = menuItem.availableCustomizations.filter((c) => c.type === "topping");
  const sides = menuItem.availableCustomizations.filter((c) => c.type === "side");

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="relative">
          <View className="bg-white px-6 pt-4 pb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-4 left-6 z-10 bg-white rounded-full p-2 shadow-md"
            >
              <Image
                source={images.arrowBack}
                className="size-6"
                resizeMode="contain"
                tintColor="#181C2E"
              />
            </TouchableOpacity>
            
            {/* Hero Image */}
            <View className="items-center mt-8 mb-6">
              <Image
                source={{ uri: menuItem.image_url }}
                className="size-64"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Item Details */}
        <View className="bg-white mx-6 rounded-2xl p-6 mt-4 shadow-md shadow-black/5">
          <Text className="h1-bold text-dark-100 mb-2">{menuItem.name}</Text>
          <Text className="paragraph-medium text-gray-100 mb-4 leading-6">
            {menuItem.description}
          </Text>
          <Text className="h3-bold text-primary">${menuItem.price.toFixed(2)}</Text>
        </View>

        {/* Nutritional Info */}
        <NutritionalInfo
          calories={menuItem.calories}
          protein={menuItem.protein}
          rating={menuItem.rating}
        />

        {/* Quantity Selector */}
        <View className="bg-white mx-6 rounded-2xl p-6 mt-4 shadow-md shadow-black/5">
          <View className="flex-row items-center justify-between">
            <Text className="h3-bold text-dark-100">Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity(prev => prev + 1)}
              onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
            />
          </View>
        </View>

        {/* Customizations */}
        {toppings.length > 0 && (
          <CustomizationSelector
            title="Add Toppings"
            customizations={toppings}
            selectedCustomizations={selectedCustomizations}
            onCustomizationToggle={handleCustomizationToggle}
          />
        )}

        {sides.length > 0 && (
          <CustomizationSelector
            title="Add Sides"
            customizations={sides}
            selectedCustomizations={selectedCustomizations}
            onCustomizationToggle={handleCustomizationToggle}
          />
        )}
      </ScrollView>

      {/* Bottom Section - Add to Cart */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="h3-bold text-dark-100">Total</Text>
          <Text className="h3-bold text-primary">
            ${calculateTotalPrice().toFixed(2)}
          </Text>
        </View>
        
        <CustomButton
          title={`Add ${quantity} to Cart`}
          onPress={handleAddToCart}
          isLoading={isAddingToCart}
          leftIcon={
            !isAddingToCart ? (
              <Image
                source={images.bag}
                className="size-5 mr-2"
                resizeMode="contain"
                tintColor="white"
              />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MenuDetails;
