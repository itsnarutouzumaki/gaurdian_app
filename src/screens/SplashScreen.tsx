import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useApp } from "../app-context";
import {
  ActionButton,
  AppText,
  Page,
  SchoolMark,
  Spacer,
} from "../components/UI";
import { C } from "../theme";
import { styles } from "./SplashScreen.styles";

export function SplashScreen() {
  const { school, media, navigate } = useApp();
  return (
    <Page scroll={false} contentStyle={styles.pageContent}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <Image
            source={{ uri: media.coverImage }}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, styles.heroImage]}
            accessible={false}
          />
          <View style={styles.brandBlock}>
            <SchoolMark size={78} style={styles.logoMark} />
            <AppText
              size={23}
              color="#FFFFFF"
              weight="bold"
              align="center"
              style={styles.schoolName}
            >
              {school.name}
            </AppText>
            <AppText
              size={13}
              color="#EAF3FF"
              align="center"
              style={styles.tagline}
            >
              {school.tagline}
            </AppText>
          </View>
          <View style={styles.sheet}>
            <AppText size={24} weight="bold" align="center">
              A brighter school journey
            </AppText>
            <AppText
              size={13}
              color={C.muted}
              align="center"
              style={styles.sheetCopy}
            >
              Stay close to your child’s attendance, results and school life.
            </AppText>
            <Spacer size={22} />
            <ActionButton
              title="Get Started"
              icon="→"
              onPress={() => navigate("Login")}
            />
            <Spacer size={12} />
            <ActionButton
              title="Explore School"
              variant="outline"
              onPress={() => navigate("SchoolDetails")}
            />
            <AppText
              size={10}
              color={C.muted}
              align="center"
              style={styles.demoNote}
            >
              DEMO BUILD · Sample school data
            </AppText>
          </View>
        </View>
      </View>
    </Page>
  );
}
