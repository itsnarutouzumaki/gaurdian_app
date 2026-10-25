import React, { useState } from "react";
import { Alert, Pressable } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  Page,
  Spacer,
} from "../components/UI";
import { C } from "../theme";
import { InfoDemo } from "./LoginScreen";
import { styles } from "./SignUpScreen.styles";

export function SignUpScreen() {
  const { school, navigate, signIn, goBack } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <Page title="Create account" subtitle={school.name} onBack={goBack}>
      <Card padding={18}>
        <AppText size={20} weight="bold">
          Join your school community
        </AppText>
        <AppText size={12} color={C.muted} style={styles.intro}>
          Create a guardian account to request access to your children’s
          records.
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
          onChangeText={setMobile}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          required
        />
        <Field
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          required
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
        <InfoDemo />
        <Spacer size={16} />
        <ActionButton
          title="Create account"
          onPress={() => {
            if (
              !name.trim() ||
              !mobile.trim() ||
              !email.trim() ||
              !password ||
              !confirm
            )
              return Alert.alert(
                "Complete the form",
                "All fields are required in this demo sign-up form.",
              );
            if (!/^\S+@\S+\.\S+$/.test(email))
              return Alert.alert("Check email", "Enter a valid email address.");
            if (password.length < 6)
              return Alert.alert("Weak password", "Use at least 6 characters.");
            if (password !== confirm)
              return Alert.alert(
                "Passwords do not match",
                "Confirm your password again.",
              );
            Alert.alert(
              "Demo account",
              "Account creation is UI-only here. Continue into the seeded guardian experience.",
              [{ text: "Continue", onPress: signIn }],
            );
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
