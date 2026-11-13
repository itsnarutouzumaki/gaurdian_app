import React from "react";
import { View } from "react-native";
import { useApp } from "../app-context";
import { getSchoolConfiguration } from "../config/schoolConfig";
import { AppText, Card, Divider, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import { styles } from "./TermsConditionsScreen.styles";

export function TermsConditionsScreen() {
  const { goBack, school, language } = useApp();
  const sections = getSchoolConfiguration().guardianContent.termsSections[language];
  return (
    <Page
      title="Terms & Conditions"
      subtitle="Conditions for using the guardian app"
      onBack={goBack}
    >
      <InfoBanner
        title="Using the guardian app"
        message="Use this app only to access school information and student records you are authorized to view."
      />
      <Card padding={15}>
        <AppText size={17} weight="bold">
          {school.name}
        </AppText>
        <AppText size={11} color={C.muted} style={styles.intro}>
          Please read these conditions before using the guardian application.
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
