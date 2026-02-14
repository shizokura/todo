import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TimePickerProps {
  value: number | null;
  onChange: (time: number | null) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return 'Select time';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSelectTime = () => {
    const now = new Date();
    const selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      selectedHour,
      selectedMinute,
      0,
      0
    );
    onChange(selectedDate.getTime());
  };

  const handleClear = () => {
    onChange(null);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Due Time</Text>

      <View style={[styles.timeDisplay, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}>
        <Text style={[styles.timeText, { color: theme.text.primary }]}>{formatTime(value)}</Text>
        {value && (
          <TouchableOpacity onPress={handleClear} hitSlop={8}>
            <Icon name="close" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {!value && (
        <View style={styles.timePickerContainer}>
          <View style={styles.timeColumn}>
            <Text style={[styles.timeColumnLabel, { color: theme.text.secondary }]}>Hour</Text>
            <View style={styles.timeOptions}>
              {hours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.timeOption,
                    { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                    selectedHour === hour && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedHour(hour)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      { color: theme.text.primary },
                      selectedHour === hour && { color: theme.text.inverse },
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.timeColumn}>
            <Text style={[styles.timeColumnLabel, { color: theme.text.secondary }]}>Minute</Text>
            <View style={styles.timeOptions}>
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={minute}
                  style={[
                    styles.timeOption,
                    { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                    selectedMinute === minute && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedMinute(minute)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      { color: theme.text.primary },
                      selectedMinute === minute && { color: theme.text.inverse },
                    ]}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {!value && (
        <TouchableOpacity
          style={[styles.setTimeButton, { backgroundColor: theme.primary }]}
          onPress={handleSelectTime}
        >
          <Text style={[styles.setTimeButtonText, { color: theme.text.inverse }]}>Set Time</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  timeText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
  },
  timePickerContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  timeColumn: {
    flex: 1,
  },
  timeColumnLabel: {
    fontSize: FONT_SIZES.small,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  timeOption: {
    flex: 1,
    minWidth: 40,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: FONT_SIZES.small,
  },
  setTimeButton: {
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  setTimeButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
});

export default TimePicker;
