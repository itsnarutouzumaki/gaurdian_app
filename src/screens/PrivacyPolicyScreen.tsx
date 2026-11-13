import React from "react";
import { View } from "react-native";
import { useApp } from "../app-context";
import { getSchoolConfiguration } from "../config/schoolConfig";
import { AppText, Card, Divider, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import { styles } from "./PrivacyPolicyScreen.styles";

export function PrivacyPolicyScreen() {
  const { goBack, school, language } = useApp();
  const sections = getSchoolConfiguration().guardianContent.privacySections[language];
  return (
    <Page
      title="Privacy Policy"
      subtitle="How your information is handled"
      onBack={goBack}
    >
      <InfoBanner
        title="Protecting student information matters"
        message="Student information is available only to accounts authorized by the school."
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
