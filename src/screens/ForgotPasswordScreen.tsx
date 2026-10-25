import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../app-context";
import { ActionButton, AppText, Card, Field, Page } from "../components/UI";
import { C } from "../theme";
import { styles } from "./ForgotPasswordScreen.styles";

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
        <AppText size={12} color={C.muted} style={styles.intro}>
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
