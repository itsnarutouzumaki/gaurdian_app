import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  Pressable,
  View,
} from "react-native";
import { AppText, Photo } from "./UI";
import { C, R } from "../theme";
import { styles } from "./SchoolPhotoCarousel.styles";

type SchoolPhotoCarouselProps = {
  photos?: readonly string[];
  fallbackUri?: string | null;
  height?: number;
  radius?: number;
};

type CarouselSlide = { key: string; uri: string };

export function SchoolPhotoCarousel({
  photos,
  fallbackUri,
  height = 190,
  radius = R.lg,
}: SchoolPhotoCarouselProps) {
  const listRef = useRef<FlatList<CarouselSlide>>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const imageUris = useMemo(() => {
    const uniqueUris = new Set<string>();
    const candidates = [...(photos ?? []), ...(fallbackUri ? [fallbackUri] : [])];
    for (const uri of candidates) {
      if (uri.trim()) uniqueUris.add(uri);
    }
    return [...uniqueUris];
  }, [photos, fallbackUri]);
  const imageSetKey = JSON.stringify(imageUris);
  const slides = useMemo<CarouselSlide[]>(() => {
    if (imageUris.length < 2) {
      return imageUris.map((uri) => ({ key: `photo:${uri}`, uri }));
    }
    return [
      {
        key: `before:${imageUris[imageUris.length - 1]}`,
        uri: imageUris[imageUris.length - 1],
      },
      ...imageUris.map((uri) => ({ key: `photo:${uri}`, uri })),
      { key: `after:${imageUris[0]}`, uri: imageUris[0] },
    ];
  }, [imageUris]);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageSetKey]);

  useEffect(() => {
    if (width > 0 && imageUris.length > 1) {
      listRef.current?.scrollToOffset({ offset: width, animated: false });
    }
  }, [width, imageSetKey, imageUris.length]);

  const onLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<CarouselSlide>) => (
    <View style={{ width }}>
      <Photo uri={item.uri} height={height} radius={radius} />
    </View>
  );

  const onMomentumScrollEnd = (offsetX: number) => {
    if (width <= 0 || imageUris.length < 2) return;

    const physicalIndex = Math.round(offsetX / width);
    if (physicalIndex === 0) {
      listRef.current?.scrollToOffset({
        offset: imageUris.length * width,
        animated: false,
      });
      setActiveIndex(imageUris.length - 1);
    } else if (physicalIndex === imageUris.length + 1) {
      listRef.current?.scrollToOffset({ offset: width, animated: false });
      setActiveIndex(0);
    } else {
      setActiveIndex(physicalIndex - 1);
    }
  };

  const scrollToImage = (index: number) => {
    if (index < 0 || index >= imageUris.length) return;
    setActiveIndex(index);
    listRef.current?.scrollToOffset({
      offset: (imageUris.length > 1 ? index + 1 : index) * width,
      animated: true,
    });
  };

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { height, borderRadius: radius }]}
    >
      {imageUris.length === 0 ? (
        <View style={styles.empty}>
          <AppText size={12} color={C.muted}>
            No school photos available
          </AppText>
        </View>
      ) : width > 0 ? (
        <>
          <FlatList
            key={imageSetKey}
            ref={listRef}
            data={slides}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            initialScrollIndex={imageUris.length > 1 ? 1 : 0}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={imageUris.length > 1}
            nestedScrollEnabled
            bounces={false}
            onMomentumScrollEnd={(event) =>
              onMomentumScrollEnd(event.nativeEvent.contentOffset.x)
            }
          />
          {imageUris.length > 1 ? (
            <View style={styles.pagination}>
              {imageUris.map((uri, index) => (
                <Pressable
                  key={uri}
                  accessibilityRole="button"
                  accessibilityLabel={`Show school photo ${index + 1}`}
                  accessibilityState={{ selected: activeIndex === index }}
                  onPress={() => scrollToImage(index)}
                  style={styles.dotButton}
                >
                  <View
                    style={[
                      styles.dot,
                      activeIndex === index
                        ? styles.activeDot
                        : styles.inactiveDot,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
