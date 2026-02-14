import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, FONT_SIZES } from '../../../constants/theme';
import ReminderList from './ReminderList';
import { Reminder } from '../../../models/types';

interface ReminderPickerProps {
  taskId: string;
  taskTitle: string;
  reminders: Reminder[];
  onAddReminder: (reminderTime: Date) => void;
  onRemoveReminder: (reminderId: string) => void;
  maxReminders?: number;
}

const ReminderPicker: React.FC<ReminderPickerProps> = ({
  taskId,
  taskTitle,
  reminders,
  onAddReminder,
  onRemoveReminder,
  maxReminders = 5,
}) => {
  const [showPresetButtons, setShowPresetButtons] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState(new Date());

  const canAddMore = reminders.length < maxReminders;

  const handlePresetClick = (minutes: number) => {
    const reminderTime = new Date();
    reminderTime.setMinutes(reminderTime.getMinutes() + minutes);
    onAddReminder(reminderTime);
    setShowPresetButtons(false);
  };

  const handleCustomTime = () => {
    onAddReminder(customTime);
    setShowCustomTime(false);
  };

  const presets = [
    { label: '5 min before', minutes: 5 },
    { label: '15 min before', minutes: 15 },
    { label: '1 hour before', minutes: 60 },
    { label: '1 day before', minutes: 1440 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="notifications" size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.headerTitle}>Reminders</Text>
            <Text style={styles.headerSubtitle}>
              {reminders.length}/{maxReminders} reminders set
            </Text>
          </View>
        </View>

        {canAddMore && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowPresetButtons(!showPresetButtons)}
            activeOpacity={0.7}
            accessibilityLabel="Add reminder"
          >
            <Icon name="add" size={24} color={COLORS.text.inverse} />
          </TouchableOpacity>
        )}
      </View>

      {showPresetButtons && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetsContainer}
          contentContainerStyle={styles.presetsContent}
        >
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.minutes}
              style={styles.presetButton}
              onPress={() => handlePresetClick(preset.minutes)}
              activeOpacity={0.7}
            >
              <Icon name="schedule" size={20} color={COLORS.primary} />
              <Text style={styles.presetText}>{preset.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setShowPresetButtons(false);
              setShowCustomTime(true);
            }}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={20} color={COLORS.primary} />
            <Text style={styles.presetText}>Custom</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {reminders.length > 0 && (
        <ReminderList
          reminders={reminders}
          onRemove={onRemoveReminder}
        />
      )}

      {!canAddMore && reminders.length > 0 && (
        <View style={styles.maxRemindersWarning}>
          <Icon name="info" size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Maximum {maxReminders} reminders reached
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsContainer: {
    marginBottom: SPACING.md,
  },
  presetsContent: {
    paddingRight: SPACING.md,
    gap: SPACING.sm,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  presetText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  maxRemindersWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}20`,
    padding: SPACING.sm,
    borderRadius: 6,
    marginTop: SPACING.sm,
  },
  warningText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.warning,
    marginLeft: SPACING.xs,
  },
});

export default ReminderPicker;
