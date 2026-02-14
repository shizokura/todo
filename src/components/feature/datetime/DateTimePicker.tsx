import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePickerAndroid from '@react-native-community/datetimepicker/android';
import { DateTimePicker as DateTimePickerIOS, DateTimePickerEvent } from '@react-native-community/datetimepicker/ios';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DateTimePickerProps {
  value: number | null;
  onChange: (datetime: number | null) => void;
  showQuickOptions?: boolean;
  minDate?: Date;
  maxDate?: Date;
  mode?: 'date' | 'datetime' | 'time';
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  showQuickOptions = true,
  minDate,
  maxDate,
  mode = 'datetime',
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const formatDateTime = (timestamp: number | null): string => {
    if (!timestamp) return `Select ${mode === 'time' ? 'time' : 'date'}`;
    const date = new Date(timestamp);

    if (mode === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    if (mode === 'date') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(9,0,0,0);
    onChange(date.getTime());
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleOpenPicker = () => {
    setTempDate(value ? new Date(value) : new Date());
    setShowPicker(true);
  };

  const handleAndroidDatePick = async () => {
    try {
      const { action, year, month, day } = await DateTimePickerAndroid.open({
        value: tempDate,
        minDate: minDate,
        maxDate: maxDate,
        mode: 'default',
      });

      if (action !== DateTimePickerAndroid.dismissedAction) {
        const newDate = new Date(year, month, day);
        newDate.setHours(tempDate.getHours(), tempDate.getMinutes());
        onChange(newDate.getTime());
      }
    } catch (error) {
      console.error('Error opening date picker:', error);
    }
  };

  const renderIOSPicker = () => (
    <Modal
      visible={showPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPicker(false)}
    >
      <TouchableOpacity style={styles.iosModalContainer} activeOpacity={1} onPress={() => setShowPicker(false)}>
        <View style={[styles.iosModalContent, { backgroundColor: theme.background.default }]} activeOpacity={1}>
          <View style={[styles.iosModalHeader, { borderBottomColor: theme.text.disabled }]}>
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <Text style={[styles.iosModalButtonText, { color: theme.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.iosModalTitle, { color: theme.text.primary }]}>
              {mode === 'time' ? 'Select Time' : 'Select Date'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                onChange(tempDate.getTime());
                setShowPicker(false);
              }}
            >
              <Text style={[styles.iosModalButtonConfirm, { color: theme.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerIOS
            value={tempDate}
            mode={mode === 'datetime' ? 'datetime' : mode}
            onChange={(event: DateTimePickerEvent, date) => {
              if (Platform.OS === 'ios') {
                setTempDate(date);
              }
            }}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
          <View style={styles.iosModalSafeArea} />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>
        {mode === 'time' ? 'Time' : mode === 'date' ? 'Date' : 'Date & Time'}
      </Text>

      <TouchableOpacity
        style={[styles.displayContainer, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}
        onPress={Platform.OS === 'ios' ? handleOpenPicker : handleAndroidDatePick}
        activeOpacity={0.7}
      >
        <Icon
          name={mode === 'time' ? 'schedule' : mode === 'date' ? 'calendar-today' : 'event'}
          size={24}
          color={theme.primary}
        />
        <Text style={[styles.displayText, { color: theme.text.primary }]}>{formatDateTime(value)}</Text>
        {value && (
          <TouchableOpacity onPress={handleClear} hitSlop={8}>
            <Icon name="close" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showQuickOptions && mode !== 'time' && (
        <View style={styles.quickOptions}>
          <QuickDateOption label="Today" onPress={() => handleQuickDate(0)} />
          <QuickDateOption label="Tomorrow" onPress={() => handleQuickDate(1)} />
          <QuickDateOption label="Next Week" onPress={() => handleQuickDate(7)} />
        </View>
      )}

      {Platform.OS === 'ios' && renderIOSPicker()}
    </View>
  );
};

interface QuickDateOptionProps {
  label: string;
  onPress: () => void;
}

const QuickDateOption: React.FC<QuickDateOptionProps> = ({ label, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.quickOption, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.quickOptionText, { color: theme.text.primary }]}>{label}</Text>
    </TouchableOpacity>
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
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  displayText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.sm,
  },
  quickOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  quickOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  quickOptionText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
  iosModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosModalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 0,
  },
  iosModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  iosModalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  iosModalButtonText: {
    fontSize: FONT_SIZES.medium,
  },
  iosModalButtonConfirm: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  iosModalSafeArea: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
  },
});

export default DateTimePicker;
