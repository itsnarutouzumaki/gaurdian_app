import React, { useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { useApp, useAppAlert } from "../app-context";
import {
  ActionButton,
  AppText,
  Badge,
  Card,
  Divider,
  InfoBanner,
  Page,
  Photo,
  SchoolMark,
  SectionTitle,
} from "../components/UI";
import { Chip } from "../components/UI";
import { TeacherListRow } from "../components/TeacherListRow";
import { SchoolPhotoCarousel } from "../components/SchoolPhotoCarousel";
import { SCHOOL_DETAILS_TABS } from "../data/screen-options";
import { C } from "../theme";
import { styles } from "./SchoolDetailsScreen.styles";

export function SchoolDetailsScreen() {
  const Alert = useAppAlert();
  const {
    school,
    media,
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
      <SchoolPhotoCarousel
        photos={media.photos}
        fallbackUri={media.coverImage}
        height={190}
        radius={20}
      />
      <Card padding={14}>
        <View style={styles.schoolHeader}>
          <SchoolMark size={48} />
          <View style={styles.flex}>
            <AppText size={15} weight="bold">
              {school.name}
            </AppText>
            <AppText size={11} color={C.muted} style={styles.tagline}>
              {school.tagline}
            </AppText>
          </View>
        </View>
        <View style={styles.stats}>
          {[
            ...(school.established
              ? [{ label: "Established", value: String(school.established) }]
              : []),
            { label: "Location", value: school.shortLocation },
            { label: "Grades", value: school.grades },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.stat,
                item.label === "Grades" && styles.lastStat,
              ]}
            >
              <AppText size={12} weight="bold" align="center">
                {item.value}
              </AppText>
              <AppText
                size={9}
                color={C.muted}
                align="center"
                style={styles.statLabel}
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
        contentContainerStyle={styles.tabsContent}
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
            subtitle={`${media.photos.length} school photos`}
          />
          <View style={styles.photoGrid}>
            {media.photos.map((uri: string, index: number) => (
              <Pressable
                key={uri}
                onPress={() =>
                  Alert.alert(
                    "School photo",
                    `Campus photo ${index + 1}.`,
                  )
                }
                style={styles.photoCard}
              >
                <Photo uri={uri} height={122} radius={13} />
                <AppText size={10} color={C.muted} style={styles.photoCaption}>
                  Campus photo {index + 1}
                </AppText>
              </Pressable>
            ))}
          </View>
          {media.photos.length === 0 ? (
            <InfoBanner
              title="No school photos yet"
              message="School photos aren't available right now."
            />
          ) : null}
        </>
      ) : null}
      {tab === "Videos" ? (
        <>
          <SectionTitle
            title="School videos"
            subtitle="Highlights shared by the school"
          />
          {media.videos.map((video) => (
            <Card key={video.id} padding={11}>
              <Pressable
                onPress={() =>
                  Linking.openURL(video.url).catch(() =>
                    Alert.alert("Video link", video.url),
                  )
                }
              >
                <Photo uri={video.thumbnailUrl} height={145} radius={13} />
                <View style={styles.videoOverlay}>
                  <View style={styles.playButton}>
                    <AppText size={22} color="#fff">
                      ▶
                    </AppText>
                  </View>
                </View>
              </Pressable>
              <View style={styles.videoMeta}>
                <AppText size={13} weight="bold">
                  {video.title}
                </AppText>
                <Badge label={video.duration} tone="gray" />
              </View>
              <AppText size={10} color={C.muted} style={styles.videoCopy}>
                Tap to watch the video.
              </AppText>
            </Card>
          ))}
          {media.videos.length === 0 ? (
            <InfoBanner
              title="No school videos yet"
              message="School videos aren't available right now."
            />
          ) : null}
        </>
      ) : null}
      {tab === "About" ? (
        <>
          <Card padding={15}>
            <AppText size={17} weight="bold">
              About the school
            </AppText>
            <AppText size={12} color={C.muted} style={styles.about}>
              {school.about}
            </AppText>
            <Divider space={14} />
            <AppText size={13} weight="bold">
              Our mission
            </AppText>
            <AppText size={12} color={C.muted} style={styles.mission}>
              {school.mission}
            </AppText>
          </Card>
          {school.facilities.length > 0 ? (
            <Card padding={14}>
              <SectionTitle title="Campus facilities" />
              {school.facilities.map((item: string, index: number) => (
                <View key={item} style={styles.facility}>
                  <View style={styles.facilityIcon}>
                    <AppText size={12} color={C.primary}>
                      {index + 1}
                    </AppText>
                  </View>
                  <AppText size={12}>{item}</AppText>
                </View>
              ))}
            </Card>
          ) : null}
          {school.address || school.phone || school.email || school.website ? (
            <Card padding={14}>
              <SectionTitle title="School contact" />
              {school.address ? (
                <AppText size={12} color={C.muted} style={styles.address}>
                  {school.address}
                </AppText>
              ) : null}
              {school.phone ? (
                <AppText size={12} color={C.primary} style={styles.phone}>
                  {school.phone}
                </AppText>
              ) : null}
              {school.email ? (
                <AppText size={12} color={C.primary} style={styles.email}>
                  {school.email}
                </AppText>
              ) : null}
              {school.website ? (
                <AppText size={12} color={C.primary} style={styles.email}>
                  {school.website}
                </AppText>
              ) : null}
            </Card>
          ) : (
            <InfoBanner
              title="School contact details unavailable"
              message="School contact information has not been added yet."
            />
          )}
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
          <View style={styles.teacherList}>
            {teachers.slice(0, 4).map((teacher) => (
              <TeacherListRow
                key={teacher.id}
                teacher={teacher}
                onPress={() => {
                  setSelectedTeacherId(teacher.id);
                  navigate("TeacherProfile");
                }}
              />
            ))}
            {teachers.length === 0 ? (
              <InfoBanner
                title="No teacher profiles available"
                message="Teacher details are not available yet."
              />
            ) : null}
          </View>
        </>
      ) : null}
      <ActionButton
        title="More about the school"
        variant="outline"
        icon="→"
        onPress={() => setTab(tab === "About" ? "Photos" : "About")}
        style={styles.moreButton}
      />
    </Page>
  );
}
