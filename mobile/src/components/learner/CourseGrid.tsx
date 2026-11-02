import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { hitSlop, palette, radii, spacing, typography } from '@/theme/tokens';
import {
  calculateColumnWidth,
  calculateColumns,
} from '@/utils/responsive';
import {
  formatDuration,
  formatLevel,
  formatRating,
  getCourseCategory,
} from '@/utils/course';
import type { Course } from '@/types';

export interface CourseGridProps {
  courses: Course[];
  width: number;
  minColumnWidth?: number;
  gutter?: number;
  maxColumns?: number;
  onSelect?: (course: Course) => void;
  testID?: string;
  /** Stable id for the first card, used by the E2E journey. */
  firstCardTestID?: string;
}

/**
 * Responsive grid. The column count is derived from the available width via the
 * pure `calculateColumns` helper, so it adapts from phone to tablet without a
 * second layout implementation.
 */
export function CourseGrid({
  courses,
  width,
  minColumnWidth = 160,
  gutter = 12,
  maxColumns = 4,
  onSelect,
  testID = 'course-grid',
  firstCardTestID,
}: CourseGridProps) {
  const columns = calculateColumns(width, minColumnWidth, gutter, maxColumns);
  const columnWidth = calculateColumnWidth(width, columns, gutter);

  const rows = useMemo(() => {
    const chunked: Course[][] = [];
    for (let i = 0; i < courses.length; i += columns) {
      chunked.push(courses.slice(i, i + columns));
    }
    return chunked;
  }, [courses, columns]);

  return (
    <View style={styles.grid} testID={testID}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row} testID={`${testID}-row-${rowIndex}`}>
          {row.map((course, columnIndex) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${course.title} by ${course.instructor.name}, ${formatLevel(
                course.level
              )}, rated ${formatRating(course.rating)}`}
              hitSlop={hitSlop}
              key={course.id}
              onPress={() => onSelect?.(course)}
              style={[
                styles.card,
                { width: columnWidth, marginRight: gutter },
              ]}
              testID={
                rowIndex === 0 && columnIndex === 0 && firstCardTestID
                  ? firstCardTestID
                  : `${testID}-card-${course.id}`
              }>
              <View style={styles.thumbWrap}>
                <Image
                  accessibilityIgnoresInvertColors
                  source={{ uri: course.thumbnailUrl }}
                  style={[styles.thumb, { height: columnWidth * 0.62 }]}
                />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryLabel}>
                    {getCourseCategory(course).label}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.cardTitle}>
                  {course.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={styles.cardInstructor}
                  testID={`${testID}-instructor-${course.id}`}>
                  {course.instructor.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Text
                    style={styles.rating}
                    testID={`${testID}-rating-${course.id}`}>
                    ★ {formatRating(course.rating)}
                  </Text>
                  <Text style={styles.ratingCount}>
                    ({course.enrolledCount.toLocaleString()})
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.cardMeta}>
                  {formatLevel(course.level)} · {formatDuration(course.durationMinutes)}
                </Text>
              </View>
            </Pressable>
          ))}
          {row.length < columns ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  thumbWrap: {
    backgroundColor: palette.surfaceMuted,
  },
  thumb: {
    width: '100%',
    backgroundColor: palette.surfaceMuted,
  },
  categoryBadge: {
    position: 'absolute',
    left: spacing.xs,
    top: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(11, 16, 32, 0.82)',
  },
  categoryLabel: {
    ...typography.caption,
    color: palette.textPrimary,
  },
  cardBody: {
    padding: spacing.sm,
    gap: spacing.xxs,
  },
  cardTitle: {
    ...typography.label,
    color: palette.textPrimary,
  },
  cardInstructor: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  rating: {
    ...typography.caption,
    color: palette.warning,
  },
  ratingCount: {
    ...typography.caption,
    color: palette.textMuted,
  },
  cardMeta: {
    ...typography.caption,
    color: palette.textMuted,
  },
  spacer: {
    flex: 1,
  },
});

export default CourseGrid;
