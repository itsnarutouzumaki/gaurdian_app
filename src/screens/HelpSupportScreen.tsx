import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useApp } from "../app-context";
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
import mock from "../data/mock-data.json";
import type { HelpTopic } from "../types";
import { styles } from "./HelpSupportScreen.styles";

export function HelpSupportScreen() {
  const { navigate, goBack, school } = useApp();
  const topics: HelpTopic[] = mock.helpTopics;
  const [opened, setOpened] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const filtered = topics.filter((item) =>
    `${item.title} ${item.body}`.toLowerCase().includes(query.toLowerCase()),
  );
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
        <View style={styles.contactRow}>
          <ActionButton
            title="Call school"
            icon="☎"
            variant="secondary"
            onPress={() => Alert.alert("School phone", school.phone)}
            style={styles.contactButton}
          />
          <ActionButton
            title="Email school"
            icon="✉"
            variant="outline"
            onPress={() => Alert.alert("School email", school.email)}
            style={styles.contactButton}
          />
        </View>
      </Card>
      <SectionTitle title="Frequently asked questions" />
      {filtered.map((topic) => (
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
