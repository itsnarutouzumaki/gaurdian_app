import React from "react";
import { View } from "react-native";
import { useApp } from "../app-context";
import { AppText, Card, Divider, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import mock from "../data/mock-data.json";
import type { PolicySection } from "../types";
import { styles } from "./PrivacyPolicyScreen.styles";

export function PrivacyPolicyScreen() {
  const { goBack, school } = useApp();
  const sections: PolicySection[] = mock.privacySections;
  return (
    <Page
      title="Privacy Policy"
      subtitle="Demo policy · Last updated 24 October 2026"
      onBack={goBack}
    >
      <InfoBanner
        title="Protecting student information matters"
        message="Student records are sensitive. This sample policy does not replace a school-approved privacy and security review."
        tone="blue"
      />
      <Card padding={15}>
        <AppText size={17} weight="bold">
          {school.name}
        </AppText>
        <AppText size={11} color={C.muted} style={styles.intro}>
          This policy explains the intended approach for information handled by
          the guardian app.
        </AppText>
        {sections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <AppText size={13} weight="bold">
              {section.title}
            </AppText>
            <AppText size={12} color={C.muted} style={styles.body}>
              {section.body}
            </AppText>
            {index < sections.length - 1 ? <Divider space={12} /> : null}
          </View>
        ))}
      </Card>
    </Page>
  );
}
