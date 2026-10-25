import React from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  InfoBanner,
  Page,
} from "../components/UI";
import { isProfileComplete } from "../lib/format";
import { C } from "../theme";
import { PROFILE_MENU_OPTIONS } from "../data/screen-options";
import { styles } from "./MyProfileScreen.styles";

export function MyProfileScreen() {
  const { guardian, school, navigate, setLogoutDialogVisible } = useApp();
  return (
    <Page title="My Profile" subtitle="Account and preferences">
      <Card padding={16}>
        <View style={styles.profile}>
          <Avatar
            name={guardian.fullName}
            uri={guardian.profilePhotoUrl}
            size={84}
            border
          />
          <AppText size={19} weight="bold" style={styles.name}>
            {guardian.fullName || "Guardian profile"}
          </AppText>
          <AppText size={12} color={C.muted} style={styles.email}>
            {guardian.email || "Email not available"}
          </AppText>
          <AppText size={11} color={C.muted} style={styles.mobile}>
            {guardian.mobileNumber || "Mobile number not available"}
          </AppText>
          <View style={styles.badge}>
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
              style={styles.menuRow}
            >
              <View
                style={[styles.menuIcon, { backgroundColor: option.backgroundColor }]}
              >
                <AppText size={22} color={option.color} weight="semibold">
                  {option.icon}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={13} weight="semibold">
                  {option.title}
                </AppText>
                <AppText size={10} color={C.muted} style={styles.detail}>
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
          style={styles.logoutRow}
        >
          <View style={styles.logoutIcon}>
            <AppText size={21} color={C.danger}>
              ⇥
            </AppText>
          </View>
          <View style={styles.flex}>
            <AppText size={13} weight="semibold" color={C.danger}>
              Logout
            </AppText>
            <AppText size={10} color={C.muted} style={styles.detail}>
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
