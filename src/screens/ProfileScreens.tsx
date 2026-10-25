import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  Field,
  InfoBanner,
  Page,
  SectionTitle,
  Spacer,
} from "../components/UI";
import { isProfileComplete, dateLabel } from "../lib/format";
import { C } from "../theme";
import mock from "../data/mock-data.json";
import {
  PROFILE_MENU_OPTIONS,
  SAMPLE_PROFILE_PHOTOS,
} from "../data/screen-options";

export function MyProfileScreen() {
  const { guardian, school, navigate, setLogoutDialogVisible } = useApp();
  return (
    <Page title="My Profile" subtitle="Account and preferences">
      <Card padding={16}>
        <View style={{ alignItems: "center" }}>
          <Avatar
            name={guardian.fullName}
            uri={guardian.profilePhotoUrl}
            size={84}
            border
          />
          <AppText size={19} weight="bold" style={{ marginTop: 11 }}>
            {guardian.fullName || "Guardian profile"}
          </AppText>
          <AppText size={12} color={C.muted} style={{ marginTop: 4 }}>
            {guardian.email || "Email not available"}
          </AppText>
          <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
            {guardian.mobileNumber || "Mobile number not available"}
          </AppText>
          <View style={{ marginTop: 10 }}>
            <Badge
              label={
                isProfileComplete(guardian)
                  ? "Profile complete"
                  : "Profile incomplete"
              }
              tone={isProfileComplete(guardian) ? "green" : "orange"}
            />
          </View>
        </View>
        {!isProfileComplete(guardian) ? (
          <InfoBanner
            title="Complete your profile"
            message="Your full name, mobile number, email and photo are required before you can request access to another child."
            tone="orange"
          />
        ) : null}
      </Card>
      <Card padding={7}>
        {PROFILE_MENU_OPTIONS.map((option, index) => (
          <View key={option.title}>
            <Pressable
              onPress={() => navigate(option.target)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 7,
              }}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 14,
                  backgroundColor: option.backgroundColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText size={22} color={option.color} weight="semibold">
                  {option.icon}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText size={13} weight="semibold">
                  {option.title}
                </AppText>
                <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
                  {option.detail}
                </AppText>
              </View>
              <AppText size={23} color={C.muted}>
                ›
              </AppText>
            </Pressable>
            {index < PROFILE_MENU_OPTIONS.length - 1 ? (
              <Divider space={1} />
            ) : null}
          </View>
        ))}
        <Divider space={1} />
        <Pressable
          onPress={() => setLogoutDialogVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 13,
            paddingHorizontal: 7,
          }}
        >
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 14,
              backgroundColor: C.dangerSoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText size={21} color={C.danger}>
              ⇥
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText size={13} weight="semibold" color={C.danger}>
              Logout
            </AppText>
            <AppText size={10} color={C.muted} style={{ marginTop: 3 }}>
              Sign out of this guardian session
            </AppText>
          </View>
          <AppText size={23} color={C.muted}>
            ›
          </AppText>
        </Pressable>
      </Card>
      <AppText size={10} color={C.muted} align="center">
        {school.name} · Demo UI 1.0.0
      </AppText>
    </Page>
  );
}

export function EditProfileScreen() {
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
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <AppText size={12} weight="semibold" style={{ marginBottom: 9 }}>
            Profile photo{" "}
            <AppText size={12} color={C.danger}>
              *
            </AppText>
          </AppText>
          <Pressable onPress={choosePhoto}>
            <Avatar
              name={name || guardian.fullName}
              uri={photo}
              size={92}
              border
            />
            <View
              style={{
                position: "absolute",
                right: -1,
                bottom: 1,
                width: 29,
                height: 29,
                borderRadius: 15,
                backgroundColor: C.primary,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <AppText size={13} color="#fff">
                ✎
              </AppText>
            </View>
          </Pressable>
          <Pressable onPress={choosePhoto} style={{ marginTop: 9 }}>
            <AppText size={12} color={C.primary} weight="semibold">
              Change profile picture
            </AppText>
          </Pressable>
          {!photo ? (
            <AppText size={11} color={C.danger} style={{ marginTop: 6 }}>
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
          style={{ marginTop: 12, marginBottom: 8 }}
        >
          Or choose a sample portrait for testing
        </AppText>
        <View
          style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}
        >
          {SAMPLE_PROFILE_PHOTOS.map((uri, index) => (
            <Pressable
              key={uri}
              onPress={() => setPhoto(uri)}
              style={{
                borderWidth: photo === uri ? 2 : 1,
                borderColor: photo === uri ? C.primary : C.border,
                borderRadius: 40,
                padding: 3,
              }}
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
              message:
                "Your name and profile photo have been saved for this session.",
              tone: "success",
            });
            Alert.alert(
              "Profile updated",
              "Your profile details have been updated in this demo.",
              [{ text: "Done", onPress: () => replace("MyProfile") }],
            );
          }}
          style={{ marginTop: 18 }}
        />
        <AppText
          size={10}
          color={C.muted}
          align="center"
          style={{ marginTop: 9 }}
        >
          School: {school.name}
        </AppText>
      </Card>
    </Page>
  );
}

export function ChangePasswordScreen() {
  const { goBack, showToast } = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <Page
      title="Change Password"
      subtitle="Choose a strong new password"
      onBack={goBack}
    >
      <Card padding={16}>
        <Field
          label="Current password"
          value={current}
          onChangeText={setCurrent}
          placeholder="Enter current password"
          secureTextEntry
          required
        />
        <Field
          label="New password"
          value={next}
          onChangeText={setNext}
          placeholder="At least 8 characters"
          secureTextEntry
          required
        />
        <Field
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Re-enter new password"
          secureTextEntry
          required
        />
        <View
          style={{
            backgroundColor: C.bg,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <AppText size={11} weight="semibold">
            Password tips
          </AppText>
          <AppText size={11} color={C.muted} style={{ marginTop: 5 }}>
            • Use 8 or more characters
          </AppText>
          <AppText size={11} color={C.muted}>
            • Combine letters, numbers and symbols
          </AppText>
          <AppText size={11} color={C.muted}>
            • Avoid reusing an old password
          </AppText>
        </View>
        <ActionButton
          title="Update Password"
          onPress={() => {
            if (!current || !next || !confirm)
              return Alert.alert(
                "Required fields",
                "Fill in all password fields.",
              );
            if (next.length < 8)
              return Alert.alert(
                "Password too short",
                "Use at least 8 characters.",
              );
            if (next === current)
              return Alert.alert(
                "Choose a new password",
                "Your new password must be different from the current password.",
              );
            if (next !== confirm)
              return Alert.alert(
                "Passwords do not match",
                "Confirm the new password correctly.",
              );
            showToast({
              title: "Password updated (demo)",
              message: "No real account password was changed.",
              tone: "success",
            });
            Alert.alert(
              "Demo only",
              "Password validation passed. Connect authentication before enabling real password changes.",
              [{ text: "Done", onPress: goBack }],
            );
          }}
        />
      </Card>
      <InfoBanner
        title="Frontend-only behavior"
        message="Password validation works locally, but no real password is changed until authentication APIs are connected."
      />
    </Page>
  );
}

export function HelpSupportScreen() {
  const { navigate, goBack, school } = useApp();
  const topics = (mock as any).helpTopics;
  const [opened, setOpened] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const filtered = topics.filter((item: any) =>
    `${item.title} ${item.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Page
      title="Help & Support"
      subtitle="Find answers or contact the school"
      onBack={goBack}
    >
      <Card padding={14}>
        <Field
          label="Search help topics"
          value={query}
          onChangeText={setQuery}
          placeholder="Search FAQs..."
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ActionButton
            title="Call school"
            icon="☎"
            variant="secondary"
            onPress={() => Alert.alert("School phone", school.phone)}
            style={{ flex: 1 }}
          />
          <ActionButton
            title="Email school"
            icon="✉"
            variant="outline"
            onPress={() => Alert.alert("School email", school.email)}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
      <SectionTitle title="Frequently asked questions" />
      {filtered.map((topic: any) => (
        <Card
          key={topic.id}
          padding={13}
          onPress={() => setOpened(opened === topic.id ? null : topic.id)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                backgroundColor: C.blueSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText color={C.primary} weight="bold">
                i
              </AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText size={13} weight="semibold">
                {topic.title}
              </AppText>
            </View>
            <AppText size={19} color={C.muted}>
              {opened === topic.id ? "−" : "+"}
            </AppText>
          </View>
          {opened === topic.id ? (
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 11, lineHeight: 19 }}
            >
              {topic.body}
            </AppText>
          ) : null}
        </Card>
      ))}
      <Card padding={14}>
        <AppText size={13} weight="bold">
          Need more help?
        </AppText>
        <AppText size={12} color={C.muted} style={{ marginTop: 5 }}>
          For student-specific concerns, raise a complaint from the child
          dashboard so the school can see which child the issue relates to.
        </AppText>
        <ActionButton
          title="Raise a complaint"
          onPress={() => navigate("RaiseComplaint")}
          style={{ marginTop: 12 }}
        />
      </Card>
    </Page>
  );
}

export function TermsConditionsScreen() {
  const { goBack, school } = useApp();
  const sections = (mock as any).termsSections;
  return (
    <Page
      title="Terms & Conditions"
      subtitle="Demo policy · Last updated 24 October 2026"
      onBack={goBack}
    >
      <InfoBanner
        title="Illustrative terms"
        message="These sample terms are for UI testing. The school must approve production legal terms before release."
      />
      <Card padding={15}>
        <AppText size={17} weight="bold">
          {school.name}
        </AppText>
        <AppText
          size={11}
          color={C.muted}
          style={{ marginTop: 4, marginBottom: 15 }}
        >
          Please read these conditions before using the guardian application.
        </AppText>
        {sections.map((section: any, index: number) => (
          <View key={section.title} style={{ marginBottom: 14 }}>
            <AppText size={13} weight="bold">
              {section.title}
            </AppText>
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 5, lineHeight: 19 }}
            >
              {section.body}
            </AppText>
            {index < sections.length - 1 ? <Divider space={12} /> : null}
          </View>
        ))}
      </Card>
    </Page>
  );
}

export function PrivacyPolicyScreen() {
  const { goBack, school } = useApp();
  const sections = (mock as any).privacySections;
  return (
    <Page
      title="Privacy Policy"
      subtitle="Demo policy · Last updated 24 October 2026"
      onBack={goBack}
    >
      <InfoBanner
        title="Protecting student information matters"
        message="Student records are sensitive. This sample policy does not replace a school-approved privacy and security review."
        tone="blue"
      />
      <Card padding={15}>
        <AppText size={17} weight="bold">
          {school.name}
        </AppText>
        <AppText
          size={11}
          color={C.muted}
          style={{ marginTop: 4, marginBottom: 15 }}
        >
          This policy explains the intended approach for information handled by
          the guardian app.
        </AppText>
        {sections.map((section: any, index: number) => (
          <View key={section.title} style={{ marginBottom: 14 }}>
            <AppText size={13} weight="bold">
              {section.title}
            </AppText>
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 5, lineHeight: 19 }}
            >
              {section.body}
            </AppText>
            {index < sections.length - 1 ? <Divider space={12} /> : null}
          </View>
        ))}
      </Card>
    </Page>
  );
}
