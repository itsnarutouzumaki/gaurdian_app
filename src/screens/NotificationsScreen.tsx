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
  const styleFor = (type: string): [string, string, string] => {
    if (type === "request") return [C.successSoft, C.success, "↗"];
    if (type === "complaint") return [C.orangeSoft, C.orange, "!"];
    if (type === "fee") return [C.purpleSoft, C.purple, "₹"];
    if (type === "result") return [C.blueSoft, C.primary, "▤"];
    return [C.blueSoft, C.primary, "i"];
  };
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
      <View style={{ flexDirection: "row", gap: 7 }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 11,
              }}
            >
              <View
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 14,
                  backgroundColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText size={19} weight="bold" color={color}>
                  {icon}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <AppText
                    size={13}
                    weight={item.read ? "semibold" : "bold"}
                    style={{ flex: 1 }}
                  >
                    {item.title}
                  </AppText>
                  {!item.read ? (
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: C.primary,
                      }}
                    />
                  ) : null}
                </View>
                <AppText
                  size={11}
                  color={C.muted}
                  style={{ marginTop: 4, lineHeight: 17 }}
                >
                  {item.message}
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
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
            style={{ marginTop: 4 }}
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
