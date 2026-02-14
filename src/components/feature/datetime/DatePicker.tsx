import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface QuickDateButtonProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const QuickDateButton: React.FC<QuickDateButtonProps> = ({ label, onPress, isActive }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }, isActive && { backgroundColor: theme.primary, borderColor: theme.primary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: theme.text.primary }, isActive && { color: theme.text.inverse }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface DatePickerProps {
  value: number | null;
  onChange: (date: number | null) => void;
  showQuickOptions?: boolean;
  minDate?: number;
  maxDate?: number;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  showQuickOptions = true,
  minDate,
  maxDate,
}) => {
  const theme = useTheme();

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'Select date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onChange(today.getTime());
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    onChange(tomorrow.getTime());
  };

  const handleNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    onChange(nextWeek.getTime());
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleNativeDatePick = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const min = minDate ? new Date(minDate) : new Date(2020, 0, 1);
    const max = maxDate ? new Date(maxDate) : new Date(2030, 11, 31);

    onChange(today.getTime());
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Due Date</Text>

      <View style={[styles.dateDisplay, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}>
        <Text style={[styles.dateText, { color: theme.text.primary }]}>{formatDate(value)}</Text>
        {value && (
          <TouchableOpacity onPress={handleClear} hitSlop={8}>
            <Icon name="close" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {showQuickOptions && (
        <View style={styles.quickOptions}>
          <QuickDateButton label="Today" onPress={handleToday} />
          <QuickDateButton label="Tomorrow" onPress={handleTomorrow} />
          <QuickDateButton label="Next Week" onPress={handleNextWeek} />
        </View>
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
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  dateText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
  },
  quickOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
});

export default DatePicker;
