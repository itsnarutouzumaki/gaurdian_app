import React, { useState } from "react";
import { View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import { ActionButton, AppText, Card, Field, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import { styles } from "./ChangePasswordScreen.styles";

export function ChangePasswordScreen() {
  const Alert = useAppAlert();
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
        <View style={styles.tips}>
          <AppText size={11} weight="semibold">
            Password tips
          </AppText>
          <AppText size={11} color={C.muted} style={styles.tip}>
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
