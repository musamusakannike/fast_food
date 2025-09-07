import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import useAuthStore from "@/store/auth.store";
import ProfileField from "@/components/ProfileField";
import ProfileEditModal from "@/components/ProfileEditModal";
import EmailChangeModal from "@/components/EmailChangeModal";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import {SafeAreaView} from "react-native-safe-area-context";

const Profile = () => {
  const { user, logout, updateUser, updateUserEmail } = useAuthStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [emailChangeModalVisible, setEmailChangeModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (updates: {
    name: string;
  }) => {
    setIsUpdating(true);
    try {
      await updateUser(updates);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
      throw error; // Re-throw to handle in modal
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateEmail = async (newEmail: string, currentPassword: string) => {
    setIsUpdatingEmail(true);
    try {
      await updateUserEmail(newEmail, currentPassword);
      Alert.alert("Success", "Email updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update email");
      throw error; // Re-throw to handle in modal
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              router.replace("/(auth)/sign-in");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to logout");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="paragraph-medium text-gray-100">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="bg-white px-6 pt-4 pb-8">
          <Text className="h1-bold text-dark-100 text-center mb-8">
            My Profile
          </Text>

          {/* Avatar Section */}
          <View className="items-center mb-6">
            <View className="profile-avatar">
              <Image
                source={user.avatar ? { uri: user.avatar } : images.avatar}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="profile-edit"
                onPress={handleEditProfile}
              >
                <Image
                  source={images.pencil}
                  className="size-4"
                  resizeMode="contain"
                  tintColor="white"
                />
              </TouchableOpacity>
            </View>
            <Text className="h3-bold text-dark-100 mt-4">
              {user.name || "User"}
            </Text>
            <Text className="paragraph-medium text-gray-100">
              {user.email || "No email"}
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View className="bg-white mx-6 rounded-2xl p-6 mt-4 shadow-md shadow-black/5">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="h3-bold text-dark-100">Personal Information</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Text className="paragraph-semibold text-primary">Edit</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            <ProfileField
              label="Full Name"
              value={user.name || "Not provided"}
              icon={images.person}
            />
            <View className="profile-field">
              <View className="profile-field__icon">
                <Image
                  source={images.envelope}
                  className="size-6"
                  resizeMode="contain"
                  tintColor="#FE8C00"
                />
              </View>
              <View className="flex-1">
                <Text className="body-medium text-gray-100 mb-1">Email Address</Text>
                <Text className="paragraph-semibold text-dark-100">{user.email || "Not provided"}</Text>
              </View>
              <TouchableOpacity onPress={() => setEmailChangeModalVisible(true)}>
                <Text className="body-medium text-primary">Change</Text>
              </TouchableOpacity>
            </View>
            <ProfileField
              label="Member Since"
              value={new Date(user.$createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              icon={images.clock}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-2xl p-6 shadow-md shadow-black/5">
            <Text className="h3-bold text-dark-100 mb-4">Account Actions</Text>
            
            <View className="gap-4">
              <CustomButton
                title="Edit Profile"
                onPress={handleEditProfile}
                leftIcon={
                  <Image
                    source={images.pencil}
                    className="size-5 mr-2"
                    resizeMode="contain"
                    tintColor="white"
                  />
                }
                style="bg-primary"
              />
              
              <CustomButton
                title="Logout"
                onPress={handleLogout}
                isLoading={isLoggingOut}
                leftIcon={
                  !isLoggingOut ? (
                    <Image
                      source={images.logout}
                      className="size-5 mr-2"
                      resizeMode="contain"
                      tintColor="white"
                    />
                  ) : null
                }
                style="bg-error"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        user={user}
        onSave={handleUpdateProfile}
        isLoading={isUpdating}
      />

      {/* Email Change Modal */}
      <EmailChangeModal
        visible={emailChangeModalVisible}
        onClose={() => setEmailChangeModalVisible(false)}
        user={user}
        onSave={handleUpdateEmail}
        isLoading={isUpdatingEmail}
      />
    </SafeAreaView>
  );
};

export default Profile;
