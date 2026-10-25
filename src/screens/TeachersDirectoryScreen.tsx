import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useApp } from "../app-context";
import { AppText, Card, InfoBanner, Page } from "../components/UI";
import { Chip } from "../components/UI";
import { TeacherListRow } from "../components/TeacherListRow";
import { TEACHER_DIRECTORY_FILTERS } from "../data/screen-options";
import { C } from "../theme";
import { styles } from "./TeachersDirectoryScreen.styles";

export function TeachersDirectoryScreen() {
  const { teachers, goBack, setSelectedTeacherId, navigate } = useApp();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const visible = teachers.filter(
    (teacher) =>
      teacher.isActive !== false &&
      `${teacher.name} ${teacher.subjects.join(" ")} ${teacher.highestDegree}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (subject === "All" || teacher.subjects.includes(subject)),
  );
  const activeCount = teachers.filter(
    (teacher) => teacher.isActive !== false,
  ).length;
  return (
    <Page
      title="Our Teachers"
      subtitle={`${activeCount} current faculty profiles`}
      onBack={goBack}
    >
      <View style={styles.searchBox}>
        <AppText size={17} color={C.muted}>
          ⌕
        </AppText>
        <View style={styles.searchInputWrap}>
          <SearchInput query={query} setQuery={setQuery} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {TEACHER_DIRECTORY_FILTERS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={subject === item}
            onPress={() => setSubject(item)}
          />
        ))}
      </ScrollView>
      <InfoBanner
        title="Faculty directory"
        message="The directory shows public professional information such as name, subject, highest qualification and teaching experience. Personal home addresses are not displayed."
      />
      {visible.map((teacher) => (
        <TeacherListRow
          key={teacher.id}
          teacher={teacher}
          onPress={() => {
            setSelectedTeacherId(teacher.id);
            navigate("TeacherProfile");
          }}
        />
      ))}
      {visible.length === 0 ? (
        <Card padding={18}>
          <AppText size={13} weight="semibold">
            No teachers found
          </AppText>
          <AppText size={12} color={C.muted} style={styles.noResults}>
            Try a different name, degree or subject.
          </AppText>
        </Card>
      ) : null}
    </Page>
  );
}

function SearchInput({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="Search teachers or qualifications"
      placeholderTextColor="#9AA7B8"
      autoCapitalize="none"
      style={styles.searchInput}
    />
  );
}
