import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';

interface ReminderPresetButtonsProps {
  onPresetPress: (minutes: number) => void;
}

const ReminderPresetButtons: React.FC<ReminderPresetButtonsProps> = ({
  onPresetPress,
}) => {
  const theme = useTheme();

  const presets = [
    { label: '5 min', minutes: 5, icon: 'schedule' },
    { label: '15 min', minutes: 15, icon: 'schedule' },
    { label: '1 hour', minutes: 60, icon: 'access-time' },
    { label: '1 day', minutes: 1440, icon: 'event' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Quick Reminders</Text>
      <View style={styles.presets}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.minutes}
            style={[styles.presetButton, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}
            onPress={() => onPresetPress(preset.minutes)}
            activeOpacity={0.7}
            accessibilityLabel={`Set reminder ${preset.label} before due date`}
          >
            <Icon name={preset.icon} size={20} color={theme.primary} />
            <Text style={[styles.presetText, { color: theme.text.primary }]}>{preset.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: SPACING.sm,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 100,
  },
  presetText: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});

export default ReminderPresetButtons;
