import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, FONT_SIZES } from '../../../constants/theme';

interface SelectionModeToggleProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onToggle: () => void;
}

const SelectionModeToggle: React.FC<SelectionModeToggleProps> = ({
  isSelectionMode,
  selectedCount,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelectionMode && styles.containerActive,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityLabel={isSelectionMode ? 'Exit selection mode' : 'Enter selection mode'}
      accessibilityRole="switch"
      accessibilityState={{ checked: isSelectionMode }}
    >
      <Icon
        name={isSelectionMode ? 'check-box' : 'check-box-outline-blank'}
        size={20}
        color={isSelectionMode ? COLORS.primary : COLORS.text.secondary}
      />
      {isSelectionMode && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{selectedCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
  },
  containerActive: {
    backgroundColor: `${COLORS.primary}10`,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.inverse,
    fontWeight: '600',
  },
});

export default SelectionModeToggle;
