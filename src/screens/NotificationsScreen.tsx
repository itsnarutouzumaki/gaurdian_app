import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useApp } from "../app-context";
import {
  AppText,
  Badge,
  Card,
  InfoBanner,
  Page,
  SectionTitle,
} from "../components/UI";
import { Chip } from "../components/UI";
import { C } from "../theme";
import {
  NOTIFICATION_FILTERS,
  type NotificationFilter,
} from "../data/screen-options";
import {
  getNotificationAppearance,
  getNotificationTarget,
} from "../lib/notifications";
import { styles } from "./NotificationsScreen.styles";

export function NotificationsScreen() {
  const {
    notifications,
    setNotifications,
    children,
    navigate,
    setSelectedChildId,
  } = useApp();
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const unread = notifications.filter((item) => !item.read).length;
  const visible = useMemo(
    () =>
      notifications.filter(
        (item) =>
          filter === "All" ||
          (filter === "Requests"
            ? item.type === "request"
            : item.type !== "request"),
      ),
    [notifications, filter],
  );
  return (
    <Page
      title="Notifications"
      subtitle={
        unread
          ? `${unread} unread update${unread === 1 ? "" : "s"}`
          : "You’re all caught up"
      }
      right={
        unread > 0 ? (
          <Pressable
            onPress={() =>
              setNotifications((prev) =>
                prev.map((item) => ({ ...item, read: true })),
              )
            }
          >
            <AppText size={10} color="#FFFFFF" weight="semibold">
              Mark all read
            </AppText>
          </Pressable>
        ) : undefined
      }
    >
      <View style={styles.filters}>
        {NOTIFICATION_FILTERS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={filter === item}
            onPress={() => setFilter(item)}
          />
        ))}
      </View>
      {unread > 0 ? (
        <InfoBanner
          title={`${unread} unread notifications`}
          message="Tap a notification to mark it as read. Requests and school updates appear here."
        />
      ) : null}
      <SectionTitle
        title="Recent activity"
        subtitle="Local demo notifications"
      />
      {visible.map((item) => {
        const { backgroundColor, color, icon } = getNotificationAppearance(
          item.type,
        );
        const child = children.find((c) => c.id === item.childId);
        return (
          <Card
            key={item.id}
            padding={12}
            onPress={() => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
              );
              if (item.childId && child) {
                setSelectedChildId(child.id);
                navigate(getNotificationTarget(item.title));
              }
            }}
          >
            <View style={styles.notificationRow}>
              <View
                style={[styles.iconBox, { backgroundColor }]}
              >
                <AppText size={19} weight="bold" color={color}>
                  {icon}
                </AppText>
              </View>
              <View style={styles.flex}>
                <View style={styles.titleRow}>
                  <AppText
                    size={13}
                    weight={item.read ? "semibold" : "bold"}
                    style={styles.title}
                  >
                    {item.title}
                  </AppText>
                  {!item.read ? (
                    <View style={styles.unreadDot} />
                  ) : null}
                </View>
                <AppText
                  size={11}
                  color={C.muted}
                  style={styles.message}
                >
                  {item.message}
                </AppText>
                <View style={styles.metadata}>
                  <AppText size={10} color={C.muted}>
                    {item.dateLabel}
                  </AppText>
                  {child ? (
                    <Badge label={child.fullName.split(" ")[0]} tone="gray" />
                  ) : null}
                </View>
              </View>
              <AppText size={18} color={C.muted}>
                ›
              </AppText>
            </View>
          </Card>
        );
      })}
      {visible.length === 0 ? (
        <Card padding={23}>
          <AppText size={13} weight="semibold" align="center">
            No notifications in this view
          </AppText>
          <AppText
            size={11}
            color={C.muted}
            align="center"
            style={styles.emptyHint}
          >
            Try another filter or check back later.
          </AppText>
        </Card>
      ) : null}
      <AppText size={10} color={C.muted} align="center">
        Notifications in this build are sample data kept in memory.
      </AppText>
    </Page>
  );
}
