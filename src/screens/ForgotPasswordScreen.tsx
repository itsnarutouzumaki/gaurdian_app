import React, { useState } from "react";
import { useApp, useAppAlert } from "../app-context";
import { ActionButton, AppText, Card, Field, Page } from "../components/UI";
import { C } from "../theme";
import {
  confirmGuardianPasswordReset,
  requestGuardianPasswordReset,
} from "../services/auth-api";
import { getUtf8ByteLength } from "../lib/utf8-byte-length";
import { styles } from "./ForgotPasswordScreen.styles";

export function ForgotPasswordScreen() {
  const Alert = useAppAlert();
  const { navigate, goBack } = useApp();
  const [mobile, setMobile] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"request" | "confirm" | null>(
    null,
  );
  return (
    <Page
      title="Reset password"
      subtitle="Recover your guardian account"
      onBack={goBack}
    >
      <Card padding={18}>
        <AppText size={21} weight="bold">
          Forgot your password?
        </AppText>
        <AppText size={12} color={C.muted} style={styles.intro}>
          Enter the mobile number registered to your guardian account.
        </AppText>
        <Field
          label="Registered mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          required
        />
        {!challengeId ? (
          <ActionButton
            title="Send reset code"
            loading={loadingAction === "request"}
            disabled={loadingAction !== null}
            onPress={async () => {
              if (!mobile.trim()) {
                Alert.alert("Required", "Enter your registered mobile number.");
                return;
              }
              setLoadingAction("request");
              try {
                const result = await requestGuardianPasswordReset(mobile.trim());
                setChallengeId(result.challengeId);
                Alert.alert(
                  "Check your messages",
                  result.message,
                );
              } catch (error) {
                console.error("Guardian password-reset request failed.", error);
                Alert.alert(
                  "Unable to request reset",
                  error instanceof Error ? error.message : "Please try again.",
                );
              } finally {
                setLoadingAction(null);
              }
            }}
          />
        ) : (
          <>
            <Field
              label="Verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              placeholder="6-digit code"
              required
            />
            <Field
              label="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 8 characters"
              required
            />
            <Field
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter new password"
              required
            />
            <ActionButton
              title="Reset password"
              loading={loadingAction === "confirm"}
              disabled={loadingAction !== null}
              onPress={async () => {
                if (!/^\d{6}$/.test(verificationCode.trim())) {
                  Alert.alert("Check code", "Enter the 6-digit verification code.");
                  return;
                }
                if (password.length < 8) {
                  Alert.alert("Weak password", "Use at least 8 characters.");
                  return;
                }
                if (getUtf8ByteLength(password) > 72) {
                  Alert.alert(
                    "Password too long",
                    "Password is too long. Use fewer characters.",
                  );
                  return;
                }
                if (password !== confirmPassword) {
                  Alert.alert("Passwords do not match", "Confirm the new password.");
                  return;
                }
                setLoadingAction("confirm");
                try {
                  await confirmGuardianPasswordReset({
                    challengeId,
                    verificationCode: verificationCode.trim(),
                    newPassword: password,
                  });
                  Alert.alert(
                    "Password updated",
                    "You can now sign in with your new password.",
                    [{ text: "Continue", onPress: () => navigate("Login") }],
                  );
                } catch (error) {
                  console.error("Guardian password reset failed.", error);
                  Alert.alert(
                    "Unable to reset password",
                    error instanceof Error ? error.message : "Please try again.",
                  );
                } finally {
                  setLoadingAction(null);
                }
              }}
            />
          </>
        )}
      </Card>
    </Page>
  );
}
