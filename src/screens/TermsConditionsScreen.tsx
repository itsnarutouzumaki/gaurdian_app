import React from "react";
import { View } from "react-native";
import { useApp } from "../app-context";
import { AppText, Card, Divider, InfoBanner, Page } from "../components/UI";
import { C } from "../theme";
import mock from "../data/mock-data.json";
import type { PolicySection } from "../types";
import { styles } from "./TermsConditionsScreen.styles";

export function TermsConditionsScreen() {
  const { goBack, school } = useApp();
  const sections: PolicySection[] = mock.termsSections;
  return (
    <Page
      title="Terms & Conditions"
      subtitle="Demo policy · Last updated 24 October 2026"
      onBack={goBack}
    >
      <InfoBanner
        title="Illustrative terms"
        message="These sample terms are for UI testing. The school must approve production legal terms before release."
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
