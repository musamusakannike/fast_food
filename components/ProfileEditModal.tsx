import {
  View,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { User } from "@/type";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updates: { name: string }) => Promise<void>;
  isLoading?: boolean;
}

const ProfileEditModal = ({
  visible,
  onClose,
  user,
  onSave,
  isLoading = false,
}: ProfileEditModalProps) => {
  const [form, setForm] = useState({
    name: user?.name || "",
  });

  // Reset form when user changes or modal opens
  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
      });
    }
  }, [user, visible]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      await onSave({
        name: form.name.trim(),
      });
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };


  const hasChanges = () => {
    return form.name !== (user?.name || "");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl p-6 min-h-[400px]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="h3-bold text-dark-100">Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="paragraph-semibold text-gray-100">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View className="gap-6">
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            
            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="body-medium text-gray-100 mb-1">Email Address</Text>
              <Text className="paragraph-medium text-dark-100">
                {user?.email || "No email set"}
              </Text>
              <Text className="body-regular text-gray-100 mt-1">
                To change your email, use the "Change Email" option in your profile.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-8 gap-3">
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              isLoading={isLoading}
              style={!hasChanges() ? "bg-gray-100" : ""}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileEditModal;
