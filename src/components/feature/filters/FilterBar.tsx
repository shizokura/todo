import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import { TaskStatus, TaskPriority } from '../../../models/types';
import { Category } from '../../../models/types';

interface FilterBarProps {
  activeFilters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    categoryId?: string;
    dueDateRange?: 'today' | 'week' | 'month' | 'all';
  };
  onClearFilters: () => void;
  onOpenFilterModal: () => void;
  categories?: Category[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onClearFilters,
  onOpenFilterModal,
  categories,
}) => {
  const theme = useTheme();

  const getActiveFilterCount = () => {
    let count =0;
    if (activeFilters.status) count++;
    if (activeFilters.priority) count++;
    if (activeFilters.categoryId) count++;
    if (activeFilters.dueDateRange && activeFilters.dueDateRange !== 'all') count++;
    return count;
  };

  const getFilterLabel = () => {
    const filters: string[] = [];
    if (activeFilters.status) {
      const statusLabels: Record<TaskStatus, string> = {
        incomplete: 'Incomplete',
        in_progress: 'In Progress',
        completed: 'Completed',
        archived: 'Archived',
      };
      filters.push(statusLabels[activeFilters.status]);
    }
    if (activeFilters.priority) {
      filters.push(`${activeFilters.priority.charAt(0).toUpperCase() + activeFilters.priority.slice(1)} Priority`);
    }
    if (activeFilters.categoryId && categories) {
      const category = categories.find((c) => c.id === activeFilters.categoryId);
      if (category) filters.push(category.name);
    }
    if (activeFilters.dueDateRange && activeFilters.dueDateRange !== 'all') {
      const rangeLabels: Record<string, string> = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
      };
      filters.push(rangeLabels[activeFilters.dueDateRange]);
    }
    return filters.join(', ');
  };

  const activeCount = getActiveFilterCount();
  const hasActiveFilters = activeCount > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
          hasActiveFilters && { borderColor: theme.primary, backgroundColor: `${theme.primary}10` },
        ]}
        onPress={onOpenFilterModal}
      >
        <Icon name="filter-list" size={20} color={hasActiveFilters ? theme.primary : theme.text.secondary} />
        {hasActiveFilters && (
          <View style={[styles.filterCountBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.filterCountText, { color: theme.text.inverse }]}>{activeCount}</Text>
          </View>
        )}
        <Text style={[styles.filterButtonText, { color: hasActiveFilters ? theme.primary : theme.text.primary }, hasActiveFilters && { fontWeight: '600' }]}>
          {hasActiveFilters ? getFilterLabel() : 'Filter'}
        </Text>
        <Icon name="chevron-right" size={20} color={theme.text.secondary} />
      </TouchableOpacity>

      {hasActiveFilters && (
        <TouchableOpacity onPress={onClearFilters} hitSlop={10}>
          <Icon name="close" size={20} color={theme.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flex: 1,
  },
  filterCountBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterButtonText: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.sm,
  },
});

export default FilterBar;
