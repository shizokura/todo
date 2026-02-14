import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, FONT_SIZES } from '../../../constants/theme';
import { Reminder } from '../../../models/types';
import { formatDateTime } from '../../../utils/dateUtils';

interface ReminderListProps {
  reminders: Reminder[];
  onRemove: (reminderId: string) => void;
  onSnooze?: (reminderId: string) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onRemove,
  onSnooze,
}) => {
  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = timestamp - now;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return 'Passed';
    }
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `In ${minutes} min`;
    if (hours < 24) return `In ${hours}h`;
    return `In ${days}d`;
  };

  if (reminders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="notifications-none" size={48} color={COLORS.text.disabled} />
        <Text style={styles.emptyText}>No reminders set</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reminders.map((reminder) => {
        const isActive = reminder.isActive && reminder.reminderTime > Date.now();

        return (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={styles.reminderContent}>
              <View style={styles.iconContainer}>
                <Icon
                  name="notifications-active"
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.text.disabled}
                />
              </View>
              
              <View style={styles.reminderDetails}>
                <Text style={[styles.reminderTime, !isActive && styles.reminderTimeInactive]}>
                  {getRelativeTime(reminder.reminderTime)}
                </Text>
                <Text style={styles.reminderDateTime}>
                  {formatDateTime(reminder.reminderTime)}
                </Text>
                {reminder.recurringRule && (
                  <View style={styles.recurringBadge}>
                    <Icon name="repeat" size={12} color={COLORS.text.inverse} />
                    <Text style={styles.recurringBadgeText}>Recurring</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.reminderActions}>
              {isActive && onSnooze && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onSnooze(reminder.id)}
                  hitSlop={8}
                  accessibilityLabel="Snooze reminder"
                >
                  <Icon name="snooze" size={20} color={COLORS.info} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onRemove(reminder.id)}
                hitSlop={8}
                accessibilityLabel="Remove reminder"
              >
                <Icon name="close" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
    borderWidth: 1,
    borderColor: COLORS.text.disabled,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTime: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  reminderTimeInactive: {
    color: COLORS.text.disabled,
  },
  reminderDateTime: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    borderRadius: 12,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  recurringBadgeText: {
    fontSize: 10,
    color: COLORS.text.inverse,
    marginLeft: 2,
    fontWeight: '600',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.background.default}50`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: `${COLORS.error}10`,
  },
});

export default ReminderList;
