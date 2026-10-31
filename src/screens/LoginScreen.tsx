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
import { styles } from "./LoginScreen.styles";

export function LoginScreen() {
  const Alert = useAppAlert();
  const { school, navigate, signIn, goBack } = useApp();
  const [mobile, setMobile] = useState("9876543210");
  const [password, setPassword] = useState("Demo@123");
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
          Use the seeded demo guardian profile to explore the app.
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
          onPress={() => {
            if (!mobile.trim() || !password.trim()) {
              Alert.alert(
                "Required fields",
                "Enter your mobile number and password.",
              );
              return;
            }
            signIn();
          }}
        />
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <AppText size={11} color={C.muted}>
            OR
          </AppText>
          <View style={styles.dividerLine} />
        </View>
        <ActionButton
          title="Continue with OTP"
          variant="outline"
          onPress={() =>
            Alert.alert(
              "Demo OTP",
              "For UI testing, use the Login button. OTP delivery is not connected in this frontend-only build.",
            )
          }
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
      <InfoDemo />
    </Page>
  );
}

export function InfoDemo() {
  return (
    <View style={styles.demoBanner}>
      <AppText size={11} color={C.primary} weight="semibold">
        Demo credentials are prefilled
      </AppText>
      <AppText size={11} color={C.muted} style={styles.demoCopy}>
        No real authentication or backend is used. Any non-empty mobile number
        and password will open the sample app.
      </AppText>
    </View>
  );
}
