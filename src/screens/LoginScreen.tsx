import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  Page,
  SchoolMark,
} from "../components/UI";
import { C } from "../theme";
import { loginGuardian } from "../services/auth-api";
import { loadGuardianAppData } from "../services/guardian-data/load-guardian-app-data";
import { styles } from "./LoginScreen.styles";

export function LoginScreen() {
  const Alert = useAppAlert();
  const { school, navigate, signIn, goBack, showToast } = useApp();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <Page title="Welcome back" subtitle={school.name} onBack={goBack}>
      <View style={styles.header}>
        <SchoolMark size={88} style={styles.logoMark} />
        <AppText size={22} weight="bold" style={styles.title}>
          Login to your account
        </AppText>
        <AppText
          size={12}
          color={C.muted}
          align="center"
          style={styles.subtitle}
        >
          Sign in with your registered mobile number.
        </AppText>
      </View>
      <Card padding={18}>
        <Field
          label="Mobile number"
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          required
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          required
        />
        <Pressable
          onPress={() => navigate("ForgotPassword")}
          style={styles.forgotButton}
        >
          <AppText size={12} color={C.primary} weight="semibold">
            Forgot password?
          </AppText>
        </Pressable>
        <ActionButton
          title="Login"
          loading={submitting}
          disabled={submitting}
          onPress={async () => {
            if (!mobile.trim() || !password.trim()) {
              Alert.alert(
                "Required fields",
                "Enter your mobile number and password.",
              );
              return;
            }
            setSubmitting(true);
            try {
              const result = await loginGuardian({
                phone: mobile.trim(),
                password,
              });
              if (result.passwordChangeRequired) {
                navigate("ChangePassword", {
                  passwordChangeToken: result.accessToken,
                });
                return;
              }
              const guardianData = await loadGuardianAppData();
              signIn(guardianData);
            } catch (error) {
              showToast({
                title: "Unable to sign in",
                message: error instanceof Error ? error.message : "Please try again.",
                tone: "error",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Card>
      <View style={styles.signupRow}>
        <AppText size={12} color={C.muted}>
          New to {school.name}?
        </AppText>
        <Pressable onPress={() => navigate("SignUp")}>
          <AppText size={12} color={C.primary} weight="bold">
            Create account
          </AppText>
        </Pressable>
      </View>
    </Page>
  );
}
