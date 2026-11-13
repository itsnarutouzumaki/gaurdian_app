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
import {
  markAllGuardianNotificationsRead,
  markGuardianNotificationRead,
} from "../services/guardian-actions";
import { styles } from "./NotificationsScreen.styles";

export function NotificationsScreen() {
  const {
    notifications,
    children,
    navigate,
    setSelectedChildId,
    refreshData,
    showToast,
  } = useApp();
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const [updating, setUpdating] = useState(false);
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
            disabled={updating}
            onPress={async () => {
              setUpdating(true);
              let markedRead = false;
              try {
                await markAllGuardianNotificationsRead();
                markedRead = true;
              } catch (error) {
                console.error("Unable to mark all notifications as read.", error);
                showToast({
                  title: "Notifications not updated",
                  message:
                    error instanceof Error
                      ? error.message
                      : "Unable to update notifications.",
                  tone: "error",
                });
                setUpdating(false);
                return;
              }
              try {
                await refreshData();
              } catch (error) {
                console.error("Unable to refresh notifications after marking them read.", error);
                showToast({
                  title: markedRead ? "Notifications marked read" : "Notifications not updated",
                  message:
                    error instanceof Error
                      ? error.message
                      : "The latest notification status could not be loaded.",
                  tone: "info",
                });
              } finally {
                setUpdating(false);
              }
            }}
          >
            <AppText size={10} color="#FFFFFF" weight="semibold">
              {updating ? "Updating…" : "Mark all read"}
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
          message="Tap a notification to mark it as read."
        />
      ) : null}
      <SectionTitle
        title="Recent activity"
        subtitle="Updates for your account"
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
            onPress={async () => {
              if (!item.read) {
                try {
                  await markGuardianNotificationRead(item.id);
                } catch (error) {
                  console.error("Unable to mark notification as read.", error);
                  showToast({
                    title: "Notification not updated",
                    message:
                      error instanceof Error
                        ? error.message
                        : "Unable to update this notification.",
                    tone: "error",
                  });
                  if (item.childId && child) {
                    setSelectedChildId(child.id);
                    navigate(getNotificationTarget(item.title));
                  }
                  return;
                }
                try {
                  await refreshData();
                } catch (error) {
                  console.error("Unable to refresh after marking a notification as read.", error);
                  showToast({
                    title: "Notification marked read",
                    message:
                      error instanceof Error
                        ? error.message
                        : "The latest notification status could not be loaded.",
                    tone: "info",
                  });
                }
              }
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
    </Page>
  );
}
