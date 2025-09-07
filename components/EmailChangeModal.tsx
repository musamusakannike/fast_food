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

interface EmailChangeModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (newEmail: string, currentPassword: string) => Promise<void>;
  isLoading?: boolean;
}

const EmailChangeModal = ({
  visible,
  onClose,
  user,
  onSave,
  isLoading = false,
}: EmailChangeModalProps) => {
  const [form, setForm] = useState({
    newEmail: user?.email || "",
    currentPassword: "",
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) {
      setForm({
        newEmail: user?.email || "",
        currentPassword: "",
      });
    }
  }, [user, visible]);

  const handleSave = async () => {
    if (!form.newEmail.trim() || !form.currentPassword.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!isValidEmail(form.newEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (form.newEmail === user?.email) {
      Alert.alert("Error", "New email must be different from current email");
      return;
    }

    try {
      await onSave(form.newEmail.trim(), form.currentPassword);
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update email");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        <View className="bg-white rounded-t-3xl p-6 min-h-[450px]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="h3-bold text-dark-100">Change Email</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="paragraph-semibold text-gray-100">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-primary/10 rounded-lg p-4 mb-6">
            <Text className="paragraph-medium text-dark-100">
              To change your email address, you'll need to enter your current password for security verification.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-6">
            <View>
              <Text className="body-medium text-gray-100 mb-2">Current Email</Text>
              <View className="bg-gray-50 rounded-lg p-3">
                <Text className="paragraph-medium text-gray-100">
                  {user?.email || "No email set"}
                </Text>
              </View>
            </View>

            <CustomInput
              label="New Email Address"
              placeholder="Enter new email address"
              value={form.newEmail}
              onChangeText={(text) => setForm({ ...form, newEmail: text })}
              keyboardType="email-address"
            />

            <CustomInput
              label="Current Password"
              placeholder="Enter your current password"
              value={form.currentPassword}
              onChangeText={(text) => setForm({ ...form, currentPassword: text })}
              secureTextEntry={true}
            />
          </View>

          {/* Actions */}
          <View className="mt-8">
            <CustomButton
              title="Update Email"
              onPress={handleSave}
              isLoading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EmailChangeModal;
