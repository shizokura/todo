import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { TaskPriority } from '../../../models/types';
import { useTheme } from '../../../utils/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  const theme = useTheme();

  const priorities: { value: TaskPriority; label: string; icon: string; color: string }[] = [
    { value: 'high', label: 'High', icon: 'flag', color: theme.priority.high },
    { value: 'medium', label: 'Medium', icon: 'flag', color: theme.priority.medium },
    { value: 'low', label: 'Low', icon: 'flag', color: theme.priority.low },
    { value: 'none', label: 'None', icon: 'flag', color: theme.priority.none },
  ];

  const getIconStyle = (priority: TaskPriority) => {
    if (priority === 'none') {
      return { color: theme.text.disabled };
    }
    if (priority === 'low') {
      return { color: theme.priority.low };
    }
    if (priority === 'medium') {
      return { color: theme.priority.medium };
    }
    return { color: theme.priority.high };
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Priority</Text>

      <View style={styles.priorityOptions}>
        {priorities.map((priority) => {
          const isSelected = priority.value === value;
          const iconStyle = getIconStyle(priority.value);

          return (
          <TouchableOpacity
            key={priority.value}
            style={[
              styles.priorityButton,
              { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
              isSelected && {
                backgroundColor: priority.color,
                borderColor: priority.color,
              },
            ]}
            onPress={() => onChange(priority.value)}
            activeOpacity={0.7}
            accessibilityLabel={`${priority.label} priority`}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Icon
              name={priority.icon}
              size={20}
              color={isSelected ? theme.text.inverse : iconStyle.color}
            />
            <Text
              style={[
                styles.priorityButtonText,
                { color: theme.text.primary },
                isSelected && { color: theme.text.inverse },
              ]}
            >
              {priority.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    marginBottom: SPACING.xs,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    minHeight: 44,
  },
  priorityButtonText: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});

export default PrioritySelector;
