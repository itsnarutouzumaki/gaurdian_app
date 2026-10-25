import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  InfoBanner,
  Page,
  Photo,
  SchoolMark,
  SectionTitle,
  Spacer,
} from "../components/UI";
import { Chip } from "../components/UI";
import { getTeacher } from "../lib/selectors";
import { C } from "../theme";
import {
  SCHOOL_DETAILS_TABS,
  TEACHER_DIRECTORY_FILTERS,
  TEACHER_PROFILE_TABS,
} from "../data/screen-options";

export function SchoolDetailsScreen() {
  const {
    school,
    navigate,
    goBack,
    setSelectedTeacherId,
    currentRoute,
    teachers,
  } = useApp();
  const [tab, setTab] = useState(
    (currentRoute.params?.tab as string) || "About",
  );
  return (
    <Page
      title="About Our School"
      subtitle="Learn about the school community"
      onBack={goBack}
    >
      <Photo uri={school.heroPhotoUrl} height={190} radius={19} />
      <Card padding={14}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <SchoolMark emoji={school.logoEmoji} size={48} />
          <View style={{ flex: 1 }}>
            <AppText size={15} weight="bold">
              {school.name}
            </AppText>
            <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
              {school.tagline}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 0, marginTop: 15 }}>
          {[
            { label: "Established", value: String(school.established) },
            { label: "Location", value: school.shortLocation },
            { label: "Grades", value: school.grades },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                paddingHorizontal: 7,
                alignItems: "center",
                borderRightWidth: item.label === "Grades" ? 0 : 1,
                borderRightColor: C.border,
              }}
            >
              <AppText size={12} weight="bold" align="center">
                {item.value}
              </AppText>
              <AppText
                size={9}
                color={C.muted}
                align="center"
                style={{ marginTop: 3 }}
              >
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {SCHOOL_DETAILS_TABS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={tab === item}
            onPress={() => setTab(item)}
          />
        ))}
      </ScrollView>
      {tab === "Photos" ? (
        <>
          <SectionTitle
            title="Campus gallery"
            subtitle={`${school.photos.length} school photos`}
          />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9 }}>
            {school.photos.map((uri: string, index: number) => (
              <Pressable
                key={uri}
                onPress={() =>
                  Alert.alert(
                    "School photo",
                    `Campus photo ${index + 1}. In production this opens the full-screen photo viewer.`,
                  )
                }
                style={{ width: "48.5%" }}
              >
                <Photo uri={uri} height={122} radius={13} />
                <AppText size={10} color={C.muted} style={{ marginTop: 5 }}>
                  Campus photo {index + 1}
                </AppText>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
      {tab === "Videos" ? (
        <>
          <SectionTitle
            title="School videos"
            subtitle="Highlights shared by the school"
          />
          {school.videos.map((video: any) => (
            <Card key={video.id} padding={11}>
              <Pressable
                onPress={() =>
                  Linking.openURL(video.url).catch(() =>
                    Alert.alert("Video link", video.url),
                  )
                }
              >
                <Photo uri={video.thumbnailUrl} height={145} radius={13} />
                <View
                  style={{
                    position: "absolute",
                    top: 47,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 47,
                      height: 47,
                      borderRadius: 24,
                      backgroundColor: "rgba(4,50,113,0.88)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText size={22} color="#fff">
                      ▶
                    </AppText>
                  </View>
                </View>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <AppText size={13} weight="bold">
                  {video.title}
                </AppText>
                <Badge label={video.duration} tone="gray" />
              </View>
              <AppText size={10} color={C.muted} style={{ marginTop: 4 }}>
                Tap to open the linked video outside the app.
              </AppText>
            </Card>
          ))}
        </>
      ) : null}
      {tab === "About" ? (
        <>
          <Card padding={15}>
            <AppText size={17} weight="bold">
              About the school
            </AppText>
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 8, lineHeight: 20 }}
            >
              {school.about}
            </AppText>
            <Divider space={14} />
            <AppText size={13} weight="bold">
              Our mission
            </AppText>
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 5, lineHeight: 19 }}
            >
              {school.mission}
            </AppText>
          </Card>
          <Card padding={14}>
            <SectionTitle title="Campus facilities" />
            {school.facilities.map((item: string, index: number) => (
              <View
                key={item}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 8,
                    backgroundColor: C.blueSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText size={12} color={C.primary}>
                    {index + 1}
                  </AppText>
                </View>
                <AppText size={12}>{item}</AppText>
              </View>
            ))}
          </Card>
          <Card padding={14}>
            <SectionTitle title="School contact" />
            <AppText size={12} color={C.muted} style={{ marginTop: 6 }}>
              {school.address}
            </AppText>
            <AppText size={12} color={C.primary} style={{ marginTop: 7 }}>
              {school.phone}
            </AppText>
            <AppText size={12} color={C.primary} style={{ marginTop: 4 }}>
              {school.email}
            </AppText>
          </Card>
        </>
      ) : null}
      {tab === "Teachers" ? (
        <>
          <SectionTitle
            title="Meet our teachers"
            subtitle="Browse teacher profiles by subject and qualification"
          />
          <ActionButton
            title="View all teachers"
            icon="♙"
            onPress={() => navigate("TeachersDirectory")}
          />
          <View style={{ gap: 8 }}>
            {teachers.slice(0, 4).map((teacher: any) => (
              <TeacherListRow
                key={teacher.id}
                teacher={teacher}
                onPress={() => {
                  setSelectedTeacherId(teacher.id);
                  navigate("TeacherProfile");
                }}
              />
            ))}
          </View>
        </>
      ) : null}
      <ActionButton
        title="More about the school"
        variant="outline"
        icon="→"
        onPress={() => setTab(tab === "About" ? "Photos" : "About")}
        style={{ marginTop: 4 }}
      />
    </Page>
  );
}

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
      <View
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AppText size={17} color={C.muted}>
          ⌕
        </AppText>
        <View style={{ flex: 1 }}>
          <SearchInput query={query} setQuery={setQuery} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
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
          <AppText size={12} color={C.muted} style={{ marginTop: 5 }}>
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
      style={{
        fontSize: 13,
        color: C.text,
        paddingVertical: 12,
        paddingHorizontal: 8,
      }}
    />
  );
}
function TeacherListRow({
  teacher,
  onPress,
}: {
  teacher: any;
  onPress: () => void;
}) {
  return (
    <Card padding={12} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
        <Avatar name={teacher.name} uri={teacher.photoUrl} size={54} />
        <View style={{ flex: 1 }}>
          <AppText size={13} weight="bold">
            {teacher.name}
          </AppText>
          <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
            {teacher.subjects.join(", ")} Teacher
          </AppText>
          <AppText size={10} color={C.primary} style={{ marginTop: 4 }}>
            {teacher.highestDegree}
          </AppText>
          <AppText size={10} color={C.muted} style={{ marginTop: 2 }}>
            {teacher.experienceYears}+ years experience
          </AppText>
        </View>
        <AppText size={22} color={C.muted}>
          ›
        </AppText>
      </View>
    </Card>
  );
}

export function TeacherProfileScreen() {
  const { teachers, selectedTeacherId, goBack, school } = useApp();
  const teacher = getTeacher(teachers, selectedTeacherId);
  const [tab, setTab] = useState("About");
  return (
    <Page
      title="Teacher Profile"
      subtitle="Professional profile"
      onBack={goBack}
    >
      <View
        style={{
          height: 138,
          borderRadius: 19,
          backgroundColor: C.primaryDark,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText size={64} color="rgba(255,255,255,0.14)">
          ✦
        </AppText>
        <View
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            height: 35,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: -69 }}>
        <Avatar name={teacher.name} uri={teacher.photoUrl} size={112} border />
        <AppText size={21} weight="bold" style={{ marginTop: 10 }}>
          {teacher.name}
        </AppText>
        <AppText
          size={12}
          color={C.primary}
          weight="semibold"
          style={{ marginTop: 3 }}
        >
          {teacher.designation}
        </AppText>
        <AppText size={11} color={C.muted} style={{ marginTop: 4 }}>
          {teacher.subjects.join(" · ")}
        </AppText>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
        {[
          { value: `${teacher.experienceYears}+`, label: "Years teaching" },
          {
            value: String(teacher.qualifications.length),
            label: "Qualifications",
          },
          { value: String(teacher.classes.length), label: "Classes taught" },
        ].map((item) => (
          <View
            key={item.label}
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 13,
              paddingVertical: 12,
            }}
          >
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
        contentContainerStyle={{ paddingRight: 8 }}
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
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 7, lineHeight: 20 }}
            >
              {teacher.about}
            </AppText>
            <Divider space={13} />
            <AppText size={12} weight="bold">
              Teaching specialization
            </AppText>
            <AppText
              size={12}
              color={C.muted}
              style={{ marginTop: 5, lineHeight: 19 }}
            >
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
          {teacher.qualifications.map((item: any, index: number) => (
            <View
              key={item.degree}
              style={{ flexDirection: "row", gap: 10, marginTop: 12 }}
            >
              <View
                style={{
                  width: 37,
                  height: 37,
                  borderRadius: 12,
                  backgroundColor: C.blueSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText size={18} color={C.primary}>
                  ▤
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText size={13} weight="bold">
                  {item.degree}
                </AppText>
                <AppText size={11} color={C.muted} style={{ marginTop: 3 }}>
                  {item.institution}
                </AppText>
                <AppText size={10} color={C.muted} style={{ marginTop: 2 }}>
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
              style={{ marginTop: 10 }}
            >
              {teacher.experienceYears}+ years
            </AppText>
            <AppText size={12} color={C.muted} style={{ marginTop: 4 }}>
              Teaching and student mentorship
            </AppText>
            <Divider space={12} />
            <AppText size={12} weight="bold">
              Subjects
            </AppText>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 7,
                marginTop: 8,
              }}
            >
              {teacher.subjects.map((item: string) => (
                <Badge key={item} label={item} tone="blue" />
              ))}
            </View>
            <AppText size={12} weight="bold" style={{ marginTop: 15 }}>
              Classes
            </AppText>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 7,
                marginTop: 8,
              }}
            >
              {teacher.classes.map((item: string) => (
                <Badge key={item} label={item} tone="purple" />
              ))}
            </View>
          </Card>
          {teacher.awards.length ? (
            <Card padding={14}>
              <SectionTitle title="Recognition" />
              {teacher.awards.map((item: string) => (
                <View
                  key={item}
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
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
    <View style={{ flexDirection: "row", gap: 9, marginTop: 10 }}>
      <AppText size={11} color={C.muted} style={{ width: 100 }}>
        {label}
      </AppText>
      <AppText size={11} weight="medium" style={{ flex: 1 }}>
        {value}
      </AppText>
    </View>
  );
}
