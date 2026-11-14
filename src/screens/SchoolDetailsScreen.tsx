import React from "react";
import { Linking } from "react-native";
import { useApp, useAppAlert, useLanguage } from "../app-context";
import { translate } from "../lib/i18n";
import {
  AppText,
  Badge,
  Card,
  InfoBanner,
  Page,
  Photo,
  SchoolMark,
  SectionTitle,
} from "../components/UI";
import { TeacherListRow } from "../components/TeacherListRow";
import { schoolPhotoSources } from "../data/schoolPhotos.generated";
import { SchoolDetailsContent } from "../../../common/components/SchoolDetailsContent";

export function SchoolDetailsScreen() {
  const Alert = useAppAlert();
  const language = useLanguage();
  const {
    school,
    media,
    navigate,
    goBack,
    setSelectedTeacherId,
    currentRoute,
    teachers,
  } = useApp();

  return (
    <SchoolDetailsContent
      school={school}
      schoolLogo={<SchoolMark size={48} />}
      photos={media.photos}
      localPhotos={schoolPhotoSources}
      coverImage={media.coverImage}
      videos={media.videos}
      teachers={teachers}
      initialTab={(currentRoute.params?.tab as "About" | "Photos" | "Videos" | "Teachers") || "About"}
      labels={{
        tabs: { about: "About", photos: "Photos", videos: "Videos", teachers: "Teachers" },
        established: "Established",
        location: "Location",
        grades: "Grades",
        campusGallery: "Campus gallery",
        photoCount: (count) => `${count} school photos`,
        noPhotosTitle: "No school photos yet",
        noPhotosMessage: "School photos aren't available right now.",
        schoolVideos: "School videos",
        videoSubtitle: "Highlights shared by the school",
        noVideosTitle: "No school videos yet",
        noVideosMessage: "School videos aren't available right now.",
        aboutSchool: "About the school",
        mission: "Our mission",
        campusFacilities: "Campus facilities",
        schoolContact: "School contact",
        contactUnavailableTitle: "School contact details unavailable",
        contactUnavailableMessage: "School contact information has not been added yet.",
        meetTeachers: "Meet our teachers",
        teacherSubtitle: "Meet the teachers supporting our school community",
        noTeachersTitle: "No teacher profiles available",
        noTeachersMessage: "Teacher details are not available yet.",
        commitmentTitle: translate("What guides our school", language),
        schoolCommitments: [
          {
            title: translate("Learning", language),
            description: translate("Supporting every student's learning and growth.", language),
          },
          {
            title: translate("Care", language),
            description: translate("Helping every student feel supported at school.", language),
          },
          {
            title: translate("Family partnership", language),
            description: translate("Working together with families to support students.", language),
          },
        ],
        watchVideoHint: "Tap to watch the video.",
        schoolPhoto: "Campus photo",
        noPhotosCarousel: "No school photos available",
      }}
      renderPage={(children) => (
        <Page
          title="About Our School"
          subtitle="Learn about the school community"
          onBack={goBack}
        >
          {children}
        </Page>
      )}
      renderText={({ children, ...props }) => (
        <AppText {...props}>{children}</AppText>
      )}
      renderCard={(children, padding) => (
        <Card padding={padding}>{children}</Card>
      )}
      renderPhoto={(uri, height, radius, width) => (
        <Photo uri={uri} height={height} radius={radius} style={width ? { width } : undefined} />
      )}
      renderSectionTitle={(title, subtitle) => (
        <SectionTitle title={title} subtitle={subtitle} />
      )}
      renderInfoBanner={(title, message) => (
        <InfoBanner title={title} message={message} />
      )}
      renderBadge={(label) => <Badge label={label} tone="gray" />}
      renderTeacher={(teacher, onPress) => (
        <TeacherListRow
          key={teacher.id}
          teacher={teachers.find((record) => record.id === teacher.id)!}
          onPress={onPress}
        />
      )}
      onVideoPress={(url) =>
        Linking.openURL(url).catch(() => Alert.alert("Video link", url))
      }
      onPhotoPress={(index) =>
        Alert.alert("School photo", `Campus photo ${index + 1}.`)
      }
      onTeacherPress={(teacherId) => {
        setSelectedTeacherId(teacherId);
        navigate("TeacherProfile");
      }}
    />
  );
}
