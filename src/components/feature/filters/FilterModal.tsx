import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { useTheme } from '../../../utils/useTheme';
import { TaskStatus, TaskPriority } from '../../../models/types';
import { Category } from '../../../models/types';
import Button from '../../common/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  activeFilters: any;
  categories: Category[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  activeFilters,
  categories,
}) => {
  const theme = useTheme();
  const [tempFilters, setTempFilters] = useState(activeFilters);

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'incomplete', label: 'Incomplete' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'none', label: 'None' },
  ];

  const dueDateOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const handleStatusSelect = (status: TaskStatus) => {
    setTempFilters((prev: any) => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  };

  const handlePrioritySelect = (priority: TaskPriority) => {
    setTempFilters((prev: any) => ({
      ...prev,
      priority: prev.priority === priority ? undefined : priority,
    }));
  };

  const handleCategorySelect = (categoryId: string | undefined) => {
    setTempFilters((prev: any) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
    }));
  };

  const handleDueDateSelect = (dueDateRange: string) => {
    setTempFilters((prev: any) => ({
      ...prev,
      dueDateRange: prev.dueDateRange === dueDateRange ? 'all' : dueDateRange,
    }));
  };

  const handleClearAll = () => {
    setTempFilters({
      status: undefined,
      priority: undefined,
      categoryId: undefined,
      dueDateRange: 'all',
    });
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Filter Tasks</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10}>
            <Icon name="close" size={24} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Status</Text>
            <View style={styles.optionGrid}>
              {statusOptions.map((option) => {
                const isSelected = tempFilters.status === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                      isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={() => handleStatusSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text.primary },
                        isSelected && { color: theme.text.inverse, fontWeight: '600' },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Priority</Text>
            <View style={styles.optionGrid}>
              {priorityOptions.map((option) => {
                const isSelected = tempFilters.priority === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                      isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={() => handlePrioritySelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text.primary },
                        isSelected && { color: theme.text.inverse, fontWeight: '600' },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                  !tempFilters.categoryId && { borderColor: theme.primary },
                ]}
                onPress={() => handleCategorySelect(undefined)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: theme.text.primary },
                    !tempFilters.categoryId && { color: theme.primary, fontWeight: '600' },
                  ]}
                >
                  All Categories
                </Text>
              </TouchableOpacity>
              {categories.map((category) => {
                const isSelected = tempFilters.categoryId === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                      isSelected && { borderColor: theme.primary },
                      { backgroundColor: `${category.color}20` },
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <View
                      style={[styles.categoryDot, { backgroundColor: category.color }]}
                    />
                    <Text
                      style={[
                        styles.categoryButtonText,
                        { color: theme.text.primary },
                        isSelected && { color: theme.primary, fontWeight: '600' },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Due Date</Text>
            <View style={styles.optionGrid}>
              {dueDateOptions.map((option) => {
                const isSelected = tempFilters.dueDateRange === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
                      isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                    onPress={() => handleDueDateSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text.primary },
                        isSelected && { color: theme.text.inverse, fontWeight: '600' },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.background.paper === '#F5F5F5' ? '#E0E0E0' : '#2A2A2A' }]}>
          <Button
            title="Clear All"
            onPress={handleClearAll}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
  },
  content: {
    maxHeight: 500,
  },
  filterSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FONT_SIZES.small,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  categoryButtonText: {
    fontSize: FONT_SIZES.small,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});

export default FilterModal;
