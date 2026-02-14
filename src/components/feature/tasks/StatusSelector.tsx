import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING, FONT_SIZES, TASK_STATUS_COLORS } from '../../../constants/theme';
import { TaskStatus } from '../../../models/types';
import { useTheme } from '../../../utils/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StatusSelectorProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange }) => {
  const theme = useTheme();

  const statuses: { value: TaskStatus; label: string; icon: string }[] = [
    { value: 'incomplete', label: 'Incomplete', icon: 'radio-button-unchecked' },
    { value: 'in_progress', label: 'In Progress', icon: 'play-circle-outline' },
    { value: 'completed', label: 'Completed', icon: 'check-circle-outline' },
    { value: 'archived', label: 'Archived', icon: 'archive' },
  ];

  const getStatusColor = (status: TaskStatus): string => {
    return TASK_STATUS_COLORS[status];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Status</Text>

      <View style={styles.statusOptions}>
        {statuses.map((status) => {
          const isSelected = status.value === value;
          const statusColor = getStatusColor(status.value);

          return (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusButton,
              { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
              isSelected && {
                backgroundColor: statusColor,
                borderColor: statusColor,
              },
            ]}
            onPress={() => onChange(status.value)}
            activeOpacity={0.7}
            accessibilityLabel={`${status.label} status`}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Icon
              name={status.icon}
              size={20}
              color={isSelected ? theme.text.inverse : statusColor}
            />
            <Text
              style={[
                styles.statusButtonText,
                { color: theme.text.primary },
                isSelected && { color: theme.text.inverse },
              ]}
            >
              {status.label}
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
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
  },
  statusButtonText: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});

export default StatusSelector;
