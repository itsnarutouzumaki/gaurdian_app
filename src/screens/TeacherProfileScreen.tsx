import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  Page,
  SectionTitle,
} from "../components/UI";
import { Chip } from "../components/UI";
import { getTeacher } from "../lib/selectors";
import { TEACHER_PROFILE_TABS } from "../data/screen-options";
import { C } from "../theme";
import { styles } from "./TeacherProfileScreen.styles";

export function TeacherProfileScreen() {
  const Alert = useAppAlert();
  const { teachers, selectedTeacherId, goBack, school } = useApp();
  const teacher = getTeacher(teachers, selectedTeacherId);
  const [tab, setTab] = useState("About");
  return (
    <Page
      title="Teacher Profile"
      subtitle="Professional profile"
      onBack={goBack}
    >
      <View style={styles.hero}>
        <AppText size={64} color="rgba(255,255,255,0.14)">
          ✦
        </AppText>
        <View style={styles.heroBottom} />
      </View>
      <View style={styles.identity}>
        <Avatar name={teacher.name} uri={teacher.photoUrl} size={112} border />
        <AppText size={21} weight="bold" style={styles.name}>
          {teacher.name}
        </AppText>
        <AppText
          size={12}
          color={C.primary}
          weight="semibold"
          style={styles.designation}
        >
          {teacher.designation}
        </AppText>
        <AppText size={11} color={C.muted} style={styles.subjects}>
          {teacher.subjects.join(" · ")}
        </AppText>
      </View>
      <View style={styles.stats}>
        {[
          { value: `${teacher.experienceYears}+`, label: "Years teaching" },
          {
            value: String(teacher.qualifications.length),
            label: "Qualifications",
          },
          { value: String(teacher.classes.length), label: "Classes taught" },
        ].map((item) => (
          <View key={item.label} style={styles.stat}>
            <AppText size={19} color={C.primary} weight="bold">
              {item.value}
            </AppText>
            <AppText size={9} color={C.muted}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {TEACHER_PROFILE_TABS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={tab === item}
            onPress={() => setTab(item)}
          />
        ))}
      </ScrollView>
      {tab === "About" ? (
        <>
          <Card padding={14}>
            <AppText size={14} weight="bold">
              About
            </AppText>
            <AppText size={12} color={C.muted} style={styles.about}>
              {teacher.about}
            </AppText>
            <Divider space={13} />
            <AppText size={12} weight="bold">
              Teaching specialization
            </AppText>
            <AppText size={12} color={C.muted} style={styles.specialization}>
              {teacher.specialization}
            </AppText>
          </Card>
          <Card padding={14}>
            <SectionTitle title="Contact and availability" />
            <ContactRow label="School email" value={teacher.email} />
            <ContactRow label="School phone" value={teacher.phone} />
            <ContactRow label="Office hours" value={teacher.officeHours} />
            <ContactRow
              label="Languages"
              value={teacher.languages.join(", ")}
            />
            <ContactRow
              label="Classes taught"
              value={teacher.classes.join(", ")}
            />
          </Card>
        </>
      ) : null}
      {tab === "Qualifications" ? (
        <Card padding={14}>
          <SectionTitle title="Education and qualifications" />
          {teacher.qualifications.map((item) => (
            <View key={item.degree} style={styles.qualification}>
              <View style={styles.qualificationIcon}>
                <AppText size={18} color={C.primary}>
                  ▤
                </AppText>
              </View>
              <View style={styles.qualificationContent}>
                <AppText size={13} weight="bold">
                  {item.degree}
                </AppText>
                <AppText size={11} color={C.muted} style={styles.institution}>
                  {item.institution}
                </AppText>
                <AppText size={10} color={C.muted} style={styles.year}>
                  Completed {item.year}
                </AppText>
              </View>
            </View>
          ))}
        </Card>
      ) : null}
      {tab === "Experience" ? (
        <>
          <Card padding={14}>
            <SectionTitle title="Professional experience" />
            <AppText
              size={24}
              color={C.primary}
              weight="bold"
              style={styles.experienceYears}
            >
              {teacher.experienceYears}+ years
            </AppText>
            <AppText size={12} color={C.muted} style={styles.experienceCopy}>
              Teaching and student mentorship
            </AppText>
            <Divider space={12} />
            <AppText size={12} weight="bold">
              Subjects
            </AppText>
            <View style={styles.subjectBadges}>
              {teacher.subjects.map((item) => (
                <Badge key={item} label={item} tone="blue" />
              ))}
            </View>
            <AppText size={12} weight="bold" style={styles.classesLabel}>
              Classes
            </AppText>
            <View style={styles.classBadges}>
              {teacher.classes.map((item) => (
                <Badge key={item} label={item} tone="purple" />
              ))}
            </View>
          </Card>
          {teacher.awards.length ? (
            <Card padding={14}>
              <SectionTitle title="Recognition" />
              {teacher.awards.map((item) => (
                <View key={item} style={styles.award}>
                  <AppText size={18} color={C.warning}>
                    ✦
                  </AppText>
                  <AppText size={12}>{item}</AppText>
                </View>
              ))}
            </Card>
          ) : null}
        </>
      ) : null}
      <ActionButton
        title="Contact through school"
        icon="✉"
        onPress={() =>
          Alert.alert(
            "Contact teacher",
            `Please contact ${school.name} through the school office. Teacher contact details are mock data in this UI-only build.`,
          )
        }
      />
    </Page>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.contactRow}>
      <AppText size={11} color={C.muted} style={styles.contactLabel}>
        {label}
      </AppText>
      <AppText size={11} weight="medium" style={styles.contactValue}>
        {value}
      </AppText>
    </View>
  );
}
