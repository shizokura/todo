import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import { isOverdue, getDaysUntilDue, formatDate, formatDateTime } from '../../../utils/dateUtils';

interface DueDateDisplayProps {
  dueDate: number | undefined;
  showTime?: boolean;
  compact?: boolean;
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({
  dueDate,
  showTime = false,
  compact = false,
}) => {
  const theme = useTheme();

  if (!dueDate) return null;

  const overdue = isOverdue(dueDate);
  const daysUntilDue = getDaysUntilDue(dueDate);
  const isToday = daysUntilDue === 0;
  const isTomorrow = daysUntilDue === 1;

  const getDisplayText = (): string => {
    if (overdue) return 'Overdue';
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    if (daysUntilDue <= 7) return `${daysUntilDue} days`;
    return formatDate(dueDate);
  };

  const getTextColor = () => {
    if (overdue) return theme.error;
    if (isToday) return theme.warning;
    return theme.success;
  };

  const getIconName = () => {
    if (overdue) return 'warning';
    if (isToday) return 'today';
    if (isTomorrow) return 'event';
    return 'event';
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer]}>
        <Icon
          name={getIconName()}
          size={16}
          color={getTextColor()}
        />
        <Text style={[styles.compactText, { color: getTextColor() }]}>
          {getDisplayText()}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name={getIconName()}
          size={20}
          color={getTextColor()}
        />
        <Text style={[styles.label, { color: getTextColor() }]}>
          {getDisplayText()}
        </Text>
        {overdue && (
          <View style={[styles.overdueBadge, { backgroundColor: theme.error }]}>
            <Text style={[styles.overdueBadgeText, { color: theme.text.inverse }]}>!</Text>
          </View>
        )}
      </View>
      <Text style={[styles.dateTimeText, { color: theme.text.secondary }]}>
        {showTime ? formatDateTime(dueDate) : formatDate(dueDate)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  overdueBadge: {
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  overdueBadgeText: {
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
  },
  dateTimeText: {
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.md + 20,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
});

export default DueDateDisplay;
