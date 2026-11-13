import React, { useState } from "react";
import { View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import { getSchoolConfiguration } from "../config/schoolConfig";
import {
  ActionButton,
  AppText,
  Card,
  Field,
  InfoBanner,
  Page,
  SectionTitle,
} from "../components/UI";
import { C } from "../theme";
import { styles } from "./HelpSupportScreen.styles";

export function HelpSupportScreen() {
  const Alert = useAppAlert();
  const { navigate, goBack, school, language } = useApp();
  const topics = getSchoolConfiguration().guardianContent.helpTopics[language];
  const [opened, setOpened] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  return (
    <Page
      title="Help & Support"
      subtitle="Find answers or contact the school"
      onBack={goBack}
    >
      <Card padding={14}>
        <Field
          label="Search help topics"
          value={query}
          onChangeText={setQuery}
          placeholder="Search FAQs..."
        />
        {school.phone || school.email ? (
          <View style={styles.contactRow}>
            {school.phone ? (
              <ActionButton
                title="Call school"
                icon="☎"
                variant="secondary"
                onPress={() => Alert.alert("School phone", school.phone)}
                style={styles.contactButton}
              />
            ) : null}
            {school.email ? (
              <ActionButton
                title="Email school"
                icon="✉"
                variant="outline"
                onPress={() => Alert.alert("School email", school.email)}
                style={styles.contactButton}
              />
            ) : null}
          </View>
        ) : (
          <AppText size={11} color={C.muted} style={styles.contactRow}>
            School contact details are not available.
          </AppText>
        )}
      </Card>
      <SectionTitle title="Frequently asked questions" />
      {topics
        .filter((topic) =>
          `${topic.title} ${topic.body}`.toLowerCase().includes(query.toLowerCase()),
        )
        .map((topic) => (
          <Card
            key={topic.id}
            padding={13}
            onPress={() => setOpened(opened === topic.id ? null : topic.id)}
          >
            <View style={styles.topicRow}>
              <View style={styles.topicIcon}>
                <AppText color={C.primary} weight="bold">
                  i
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={13} weight="semibold">
                  {topic.title}
                </AppText>
              </View>
              <AppText size={19} color={C.muted}>
                {opened === topic.id ? "−" : "+"}
              </AppText>
            </View>
            {opened === topic.id ? (
              <AppText size={12} color={C.muted} style={styles.answer}>
                {topic.body}
              </AppText>
            ) : null}
          </Card>
        ))}
      <Card padding={14}>
        <AppText size={13} weight="bold">
          Need more help?
        </AppText>
        <AppText size={12} color={C.muted} style={styles.helpCopy}>
          For student-specific concerns, raise a complaint from the child
          dashboard so the school can see which child the issue relates to.
        </AppText>
        <ActionButton
          title="Raise a complaint"
          onPress={() => navigate("RaiseComplaint")}
          style={styles.complaintButton}
        />
      </Card>
    </Page>
  );
}
