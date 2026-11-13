import React, { useState } from "react";
import { Pressable } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  Page,
  Spacer,
} from "../components/UI";
import { C } from "../theme";
import {
  registerGuardian,
  requestGuardianSignupCode,
} from "../services/auth-api";
import { getUtf8ByteLength } from "../lib/utf8-byte-length";
import { styles } from "./SignUpScreen.styles";

export function SignUpScreen() {
  const Alert = useAppAlert();
  const { school, navigate, goBack } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [loadingAction, setLoadingAction] = useState<"code" | "signup" | null>(
    null,
  );
  return (
    <Page title="Create account" subtitle={school.name} onBack={goBack}>
      <Card padding={18}>
        <AppText size={20} weight="bold">
          Join your school community
        </AppText>
        <AppText size={12} color={C.muted} style={styles.intro}>
          Verify your phone number to create an account. You can add your child
          after signing up.
        </AppText>
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="As per school records"
          required
        />
        <Field
          label="Mobile number"
          value={mobile}
          onChangeText={(value) => {
            setMobile(value);
            setChallengeId("");
            setVerificationCode("");
          }}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          required
        />
        <ActionButton
          title={challengeId ? "Send code again" : "Send verification code"}
          variant="outline"
          loading={loadingAction === "code"}
          disabled={loadingAction !== null}
          onPress={async () => {
            if (!mobile.trim()) {
              Alert.alert("Mobile number required", "Enter your mobile number first.");
              return;
            }
            setLoadingAction("code");
            try {
              const result = await requestGuardianSignupCode(mobile.trim());
              setChallengeId(result.challengeId);
              setVerificationCode("");
              Alert.alert("Verification code sent", "Enter the code sent to your phone.");
            } catch (error) {
              console.error("Guardian signup code request failed.", error);
              Alert.alert(
                "Unable to send code",
                error instanceof Error ? error.message : "Please try again.",
              );
            } finally {
              setLoadingAction(null);
            }
          }}
        />
        {challengeId ? (
          <Field
            label="Verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="6-digit code"
            keyboardType="number-pad"
            required
          />
        ) : null}
        <Field
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          secureTextEntry
          required
        />
        <Field
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Re-enter password"
          secureTextEntry
          required
        />
        <Spacer size={16} />
        <ActionButton
          title="Create account"
          loading={loadingAction === "signup"}
          disabled={loadingAction !== null || !challengeId}
          onPress={async () => {
            if (
              !name.trim() ||
              !mobile.trim() ||
              !password ||
              !confirm ||
              !verificationCode.trim()
            )
              return Alert.alert(
                "Complete the form",
                "Enter your name, mobile number, password, and verification code.",
              );
            if (email.trim() && !/^\S+@\S+\.\S+$/.test(email))
              return Alert.alert("Check email", "Enter a valid email address.");
            if (password.length < 8)
              return Alert.alert("Weak password", "Use at least 8 characters.");
            if (getUtf8ByteLength(password) > 72)
              return Alert.alert(
                "Password too long",
                "Password is too long. Use fewer characters.",
              );
            if (password !== confirm)
              return Alert.alert(
                "Passwords do not match",
                "Confirm your password again.",
              );
            setLoadingAction("signup");
            try {
              await registerGuardian({
                fullName: name.trim(),
                phone: mobile.trim(),
                ...(email.trim() ? { email: email.trim() } : {}),
                password,
                challengeId,
                verificationCode: verificationCode.trim(),
              });
              Alert.alert(
                "Account created",
                "Your guardian account is ready. Sign in to continue.",
                [{ text: "Continue", onPress: () => navigate("Login") }],
              );
            } catch (error) {
              console.error("Guardian registration failed.", error);
              Alert.alert(
                "Unable to create account",
                error instanceof Error ? error.message : "Please try again.",
              );
            } finally {
              setLoadingAction(null);
            }
          }}
        />
        <Pressable
          onPress={() => navigate("Login")}
          style={styles.loginLink}
        >
          <AppText size={12} color={C.primary} weight="semibold">
            Already have an account? Login
          </AppText>
        </Pressable>
      </Card>
    </Page>
  );
}
