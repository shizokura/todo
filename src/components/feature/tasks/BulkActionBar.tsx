import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, FONT_SIZES } from '../../../constants/theme';
import { Task, TaskStatus, TaskPriority } from '../../../models/types';
import { Category } from '../../../models/types';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkComplete: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkChangeCategory?: (categoryId: string) => void;
  onBulkChangePriority?: (priority: TaskPriority) => void;
  onBulkChangeStatus?: (status: TaskStatus) => void;
  categories?: Category[];
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
  onBulkArchive,
  onBulkDelete,
  onBulkChangeCategory,
  onBulkChangePriority,
  categories,
}) => {
  const allSelected = selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  if (!hasSelection) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionText}>
          {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity
          onPress={allSelected ? onDeselectAll : onSelectAll}
          hitSlop={10}
        >
          <Text style={styles.toggleText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={onBulkComplete}
          accessibilityLabel="Mark all selected as complete"
        >
          <Icon name="check-circle" size={20} color={COLORS.text.inverse} />
          <Text style={styles.actionButtonText}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={onBulkArchive}
          accessibilityLabel="Archive all selected"
        >
          <Icon name="archive" size={20} color={COLORS.text.inverse} />
          <Text style={styles.actionButtonText}>Archive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onBulkDelete}
          accessibilityLabel="Delete all selected"
        >
          <Icon name="delete" size={20} color={COLORS.text.inverse} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.paper,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text.disabled,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  selectionText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  toggleText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  archiveButton: {
    backgroundColor: COLORS.warning,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.inverse,
    fontWeight: '600',
  },
});

export default BulkActionBar;
