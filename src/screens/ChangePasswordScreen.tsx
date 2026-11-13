import React, { useState } from "react";
import { View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import { ActionButton, AppText, Card, Field, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import { changeRequiredPassword } from "../services/auth-api";
import { getUtf8ByteLength } from "../lib/utf8-byte-length";
import { styles } from "./ChangePasswordScreen.styles";

export function ChangePasswordScreen() {
  const Alert = useAppAlert();
  const { currentRoute, goBack, resetTo } = useApp();
  const passwordChangeToken = currentRoute.params?.passwordChangeToken;
  const isRequiredChange = typeof passwordChangeToken === "string";
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <Page
      title="Change Password"
      subtitle="Choose a strong new password"
      onBack={goBack}
    >
      <Card padding={16}>
        {isRequiredChange ? (
          <InfoBanner
            title="Password update required"
            message="Choose a new password to finish signing in. You will sign in again after it is updated."
          />
        ) : (
          <Field
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            placeholder="Enter current password"
            secureTextEntry
            required
          />
        )}
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
          title={isRequiredChange ? "Set new password" : "Update Password"}
          loading={submitting}
          disabled={submitting || !isRequiredChange}
          onPress={async () => {
            if ((!isRequiredChange && !current) || !next || !confirm)
              return Alert.alert(
                "Required fields",
                "Fill in all password fields.",
              );
            if (next.length < 8)
              return Alert.alert(
                "Password too short",
                "Use at least 8 characters.",
              );
            if (getUtf8ByteLength(next) > 72)
              return Alert.alert(
                "Check password",
                "Password is too long. Use fewer characters.",
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
            if (!isRequiredChange || typeof passwordChangeToken !== "string") {
              Alert.alert(
                "Not available yet",
                "Password changes are not available right now.",
              );
              return;
            }
            setSubmitting(true);
            try {
              await changeRequiredPassword({
                accessToken: passwordChangeToken,
                newPassword: next,
              });
              Alert.alert(
                "Password updated",
                "Sign in again with your new password.",
                [{ text: "Continue", onPress: () => resetTo("Login") }],
              );
            } catch (error) {
              console.error("Required password change failed.", error);
              Alert.alert(
                "Unable to update password",
                error instanceof Error ? error.message : "Please try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Card>
      {!isRequiredChange ? (
        <InfoBanner
          title="Not available yet"
          message="Password changes are not available right now."
        />
      ) : null}
    </Page>
  );
}
