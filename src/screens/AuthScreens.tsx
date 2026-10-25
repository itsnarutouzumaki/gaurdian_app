import React, { useState } from "react";
import { Alert, ImageBackground, Pressable, View } from "react-native";
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

export function SplashScreen() {
  const { school, navigate } = useApp();
  return (
    <Page scroll={false} contentStyle={{ padding: 0, flex: 1, gap: 0 }}>
      <View style={{ flex: 1, backgroundColor: C.primaryDark }}>
        <ImageBackground
          source={{ uri: school.heroPhotoUrl }}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: "space-between" }}
          imageStyle={{ opacity: 0.72 }}
        >
          <View
            style={{
              alignItems: "center",
              paddingTop: 72,
              paddingHorizontal: 24,
            }}
          >
            <View
              style={{
                width: 78,
                height: 78,
                borderRadius: 26,
                borderWidth: 2,
                borderColor: "#EBCB75",
                backgroundColor: "rgba(3,38,87,0.82)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText size={42} color="#F0D47F">
                {school.logoEmoji || "✦"}
              </AppText>
            </View>
            <AppText
              size={23}
              color="#FFFFFF"
              weight="bold"
              align="center"
              style={{ marginTop: 18 }}
            >
              {school.name}
            </AppText>
            <AppText
              size={13}
              color="#EAF3FF"
              align="center"
              style={{ marginTop: 7 }}
            >
              {school.tagline}
            </AppText>
          </View>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 34,
              borderTopRightRadius: 34,
              paddingHorizontal: 24,
              paddingTop: 30,
              paddingBottom: 32,
            }}
          >
            <AppText size={24} weight="bold" align="center">
              A brighter school journey
            </AppText>
            <AppText
              size={13}
              color={C.muted}
              align="center"
              style={{ marginTop: 9 }}
            >
              Stay close to your child’s attendance, results and school life.
            </AppText>
            <Spacer size={22} />
            <ActionButton
              title="Get Started"
              icon="→"
              onPress={() => navigate("Login")}
            />
            <Spacer size={12} />
            <ActionButton
              title="Explore School"
              variant="outline"
              onPress={() => navigate("SchoolDetails")}
            />
            <AppText
              size={10}
              color={C.muted}
              align="center"
              style={{ marginTop: 14 }}
            >
              DEMO BUILD · Sample school data
            </AppText>
          </View>
        </ImageBackground>
      </View>
    </Page>
  );
}

export function LoginScreen() {
  const { school, navigate, signIn, goBack } = useApp();
  const [mobile, setMobile] = useState("9876543210");
  const [password, setPassword] = useState("Demo@123");
  return (
    <Page title="Welcome back" subtitle={school.name} onBack={goBack}>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 8 }}>
        <View
          style={{
            width: 66,
            height: 66,
            borderRadius: 22,
            backgroundColor: C.primaryDark,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText size={34} color="#F3D780">
            {school.logoEmoji || "✦"}
          </AppText>
        </View>
        <AppText size={22} weight="bold" style={{ marginTop: 14 }}>
          Login to your account
        </AppText>
        <AppText
          size={12}
          color={C.muted}
          align="center"
          style={{ marginTop: 5 }}
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
          style={{ alignSelf: "flex-end", marginTop: -3, marginBottom: 16 }}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
            gap: 12,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <AppText size={11} color={C.muted}>
            OR
          </AppText>
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          marginTop: 7,
        }}
      >
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
function InfoDemo() {
  return (
    <View
      style={{
        marginTop: 3,
        padding: 12,
        borderRadius: 12,
        backgroundColor: C.blueSoft,
      }}
    >
      <AppText size={11} color={C.primary} weight="semibold">
        Demo credentials are prefilled
      </AppText>
      <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
        No real authentication or backend is used. Any non-empty mobile number
        and password will open the sample app.
      </AppText>
    </View>
  );
}

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
        <AppText
          size={12}
          color={C.muted}
          style={{ marginTop: 4, marginBottom: 18 }}
        >
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
          style={{ alignSelf: "center", paddingTop: 15 }}
        >
          <AppText size={12} color={C.primary} weight="semibold">
            Already have an account? Login
          </AppText>
        </Pressable>
      </Card>
    </Page>
  );
}

export function ForgotPasswordScreen() {
  const { navigate, goBack } = useApp();
  const [mobile, setMobile] = useState("");
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
        <AppText
          size={12}
          color={C.muted}
          style={{ marginTop: 6, marginBottom: 20 }}
        >
          Enter the mobile number registered with the school. This demo will
          show a confirmation only.
        </AppText>
        <Field
          label="Registered mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          required
        />
        <ActionButton
          title="Send reset code"
          onPress={() => {
            if (!mobile.trim())
              return Alert.alert(
                "Required",
                "Enter your registered mobile number.",
              );
            Alert.alert(
              "Demo only",
              "A reset code would be sent here when authentication is connected.",
            );
          }}
        />
      </Card>
    </Page>
  );
}
