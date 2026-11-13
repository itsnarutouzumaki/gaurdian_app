import React, { useState } from "react";
import { View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Card,
  Field,
  InfoBanner,
  Page,
} from "../components/UI";
import { C } from "../theme";
import { updateGuardianProfile } from "../services/guardian-actions";
import { styles } from "./EditProfileScreen.styles";

export function EditProfileScreen() {
  const Alert = useAppAlert();
  const {
    guardian,
    setGuardian,
    replace,
    goBack,
    showToast,
    refreshData,
  } = useApp();
  const [name, setName] = useState(guardian.fullName);
  const [address, setAddress] = useState(guardian.address || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const fullName = name.trim();
    if (!fullName) {
      Alert.alert("Name required", "Enter your full name before saving.");
      return;
    }

    setSaving(true);
    try {
      await updateGuardianProfile({ fullName, address: address.trim() });
      setGuardian((current) => ({
        ...current,
        fullName,
        address: address.trim(),
      }));
    } catch (error) {
      console.error("Guardian profile update failed.", error);
      showToast({
        title: "Profile not updated",
        message:
          error instanceof Error ? error.message : "Unable to update your profile.",
        tone: "error",
      });
      setSaving(false);
      return;
    }

    try {
      await refreshData();
    } catch (error) {
      console.error("Unable to refresh data after a profile update.", error);
    }
    setSaving(false);
    showToast({
      title: "Profile updated",
      message: "Your changes were saved to the school account.",
      tone: "success",
      action: { label: "Done", onPress: () => replace("MyProfile") },
    });
  };

  return (
    <Page
      title="Edit Profile"
      subtitle="Keep your account details up to date"
      onBack={goBack}
    >
      <Card padding={16}>
        <View style={styles.photoSection}>
          <Avatar name={name || guardian.fullName} uri={guardian.profilePhotoUrl} size={92} border />
        </View>
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          required
        />
        <Field
          label="Mobile number"
          value={guardian.mobileNumber}
          editable={false}
          placeholder="Not provided"
        />
        <Field
          label="Email address"
          value={guardian.email}
          editable={false}
          placeholder="Not provided"
          keyboardType="email-address"
        />
        <Field
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address (optional)"
          multiline
        />
        <InfoBanner
          title="Account contact details"
          message="To change your mobile number or email, contact the school office."
        />
        <ActionButton
          title="Save Changes"
          loading={saving}
          disabled={saving}
          onPress={save}
          style={styles.save}
        />
      </Card>
    </Page>
  );
}
