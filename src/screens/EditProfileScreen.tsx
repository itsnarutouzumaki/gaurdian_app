import React, { useState } from "react";
import { Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Card,
  Field,
  InfoBanner,
  Page,
  RequiredIndicator,
} from "../components/UI";
import { C } from "../theme";
import { SAMPLE_PROFILE_PHOTOS } from "../data/screen-options";
import { styles } from "./EditProfileScreen.styles";

export function EditProfileScreen() {
  const Alert = useAppAlert();
  const {
    guardian,
    setGuardian,
    navigate,
    replace,
    goBack,
    currentRoute,
    showToast,
    school,
  } = useApp();
  const [name, setName] = useState(guardian.fullName);
  const [address, setAddress] = useState(guardian.address || "");
  const [photo, setPhoto] = useState<string | null>(guardian.profilePhotoUrl);
  const [saving, setSaving] = useState(false);
  const notice = currentRoute.params?.notice as string | undefined;
  const missing =
    (currentRoute.params?.missingFields as string[] | undefined) || [];
  const choosePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Photo permission needed",
          "Allow photo-library access to choose your profile picture.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0])
        setPhoto(result.assets[0].uri);
    } catch {
      Alert.alert(
        "Photo picker unavailable",
        "Use one of the sample portraits below to finish the UI test.",
      );
    }
  };
  return (
    <Page
      title="Edit Profile"
      subtitle="Keep your account details up to date"
      onBack={goBack}
    >
      {notice ? (
        <InfoBanner
          title="Profile completion required"
          message={notice}
          tone="orange"
          icon="!"
        />
      ) : null}
      {missing.length > 0 ? (
        <InfoBanner
          title="Missing required details"
          message={missing.join(", ")}
          tone="red"
          icon="!"
        />
      ) : null}
      <Card padding={16}>
        <View style={styles.photoSection}>
          <AppText size={12} weight="semibold" style={styles.photoLabel}>
            Profile photo
            <RequiredIndicator />
          </AppText>
          <Pressable onPress={choosePhoto}>
            <Avatar
              name={name || guardian.fullName}
              uri={photo}
              size={92}
              border
            />
            <View style={styles.editIcon}>
              <AppText size={13} color="#fff">
                ✎
              </AppText>
            </View>
          </Pressable>
          <Pressable onPress={choosePhoto} style={styles.changePhoto}>
            <AppText size={12} color={C.primary} weight="semibold">
              Change profile picture
            </AppText>
          </Pressable>
          {!photo ? (
            <AppText size={11} color={C.danger} style={styles.requiredNote}>
              A profile photo is required before adding a child.
            </AppText>
          ) : null}
        </View>
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          required
          error={
            name.trim()
              ? ""
              : missing.includes("Full name")
                ? "Please enter your full name."
                : undefined
          }
        />
        <Field
          label="Mobile number"
          value={guardian.mobileNumber}
          editable={false}
          placeholder="Registered mobile number"
          required
          error={
            missing.includes("Mobile number")
              ? "Required. Contact the school office to correct this field."
              : undefined
          }
        />
        <Field
          label="Email address"
          value={guardian.email}
          editable={false}
          placeholder="Registered email"
          keyboardType="email-address"
          required
          error={
            missing.includes("Email address")
              ? "Required. Contact the school office to correct this field."
              : undefined
          }
        />
        <Field
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address (optional)"
          multiline
        />
        <InfoBanner
          title="Some account details are locked"
          message="For account safety, guardian cannot edit mobile number or email in the app. Contact the school office if either is incorrect."
        />
        <AppText
          size={11}
          color={C.muted}
          weight="semibold"
          style={styles.sampleHeading}
        >
          Or choose a sample portrait for testing
        </AppText>
        <View style={styles.samplePhotos}>
          {SAMPLE_PROFILE_PHOTOS.map((uri, index) => (
            <Pressable
              key={uri}
              onPress={() => setPhoto(uri)}
              style={[
                styles.samplePhoto,
                photo === uri && styles.samplePhotoSelected,
              ]}
            >
              <Avatar name={`Demo portrait ${index + 1}`} uri={uri} size={50} />
            </Pressable>
          ))}
        </View>
        <ActionButton
          title="Save Changes"
          loading={saving}
          onPress={() => {
            const validName = Boolean(name.trim());
            const validPhoto = Boolean(photo);
            const validMobile = Boolean(guardian.mobileNumber.trim());
            const validEmail = Boolean(guardian.email.trim());
            if (!validName || !validPhoto || !validMobile || !validEmail) {
              const missed = [
                !validName ? "Full name" : null,
                !validMobile ? "Mobile number" : null,
                !validEmail ? "Email address" : null,
                !validPhoto ? "Profile photo" : null,
              ]
                .filter(Boolean)
                .join(", ");
              Alert.alert(
                "Profile incomplete",
                `Please complete these required fields: ${missed}. If mobile or email is missing, contact the school office.`,
              );
              return;
            }
            setSaving(true);
            setGuardian((prev) => ({
              ...prev,
              fullName: name.trim(),
              profilePhotoUrl: photo,
              address: address.trim(),
              profileComplete: true,
            }));
            setSaving(false);
            showToast({
              title: "Profile updated",
              message: "Your profile details have been updated in this demo.",
              tone: "success",
              action: { label: "Done", onPress: () => replace("MyProfile") },
            });
          }}
          style={styles.save}
        />
        <AppText
          size={10}
          color={C.muted}
          align="center"
          style={styles.schoolNote}
        >
          School: {school.name}
        </AppText>
      </Card>
    </Page>
  );
}
