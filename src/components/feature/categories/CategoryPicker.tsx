import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SPACING, FONT_SIZES } from '../../../constants/theme';
import { Category } from '../../../models/types';
import { useTheme } from '../../../utils/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
  placeholder = 'Select category',
  allowClear = true,
}) => {
  const theme = useTheme();
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  const handleClear = () => {
    onSelect(undefined);
  };

  const renderCategoryItem = (category: Category) => {
    const isSelected = category.id === selectedCategoryId;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          { backgroundColor: isSelected ? theme.primary : theme.background.paper, borderColor: isSelected ? theme.primary : theme.text.disabled },
        ]}
        onPress={() => onSelect(category.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.categoryColor,
            { backgroundColor: category.color },
          ]}
        />
        <Text
          style={[
            styles.categoryName,
            { color: isSelected ? theme.text.inverse : theme.text.primary },
          ]}
        >
          {category.name}
        </Text>
        {isSelected && (
          <Icon name="check" size={20} color={theme.text.inverse} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text.primary }]}>Category</Text>

      {selectedCategory ? (
        <View style={[styles.selectedDisplay, { backgroundColor: theme.background.paper, borderColor: theme.primary }]}>
          <View
            style={[
              styles.categoryColorLarge,
              { backgroundColor: selectedCategory.color },
            ]}
          />
          <Text style={[styles.selectedText, { color: theme.text.primary }]}>{selectedCategory.name}</Text>
          {allowClear && (
            <TouchableOpacity onPress={handleClear} hitSlop={8}>
              <Icon name="close" size={20} color={theme.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.placeholderDisplay, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}
          onPress={() => {}}
        >
          <Icon name="folder-outline" size={20} color={theme.text.secondary} />
          <Text style={[styles.placeholderText, { color: theme.text.disabled }]}>{placeholder}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
      >
        {allowClear && (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              { backgroundColor: !selectedCategoryId ? theme.primary : theme.background.paper, borderColor: !selectedCategoryId ? theme.primary : theme.text.disabled },
            ]}
            onPress={() => onSelect(undefined)}
          >
            <Icon name="block" size={20} color={theme.text.secondary} />
            <Text
              style={[
                styles.categoryName,
                { color: !selectedCategoryId ? theme.text.inverse : theme.text.primary },
              ]}
            >
              No Category
            </Text>
          </TouchableOpacity>
        )}
        {categories.map(renderCategoryItem)}
      </ScrollView>
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
  selectedDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  categoryColorLarge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: SPACING.sm,
  },
  selectedText: {
    flex:1,
    fontSize: FONT_SIZES.medium,
  },
  placeholderDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  placeholderText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.sm,
  },
  categoryList: {
    marginTop: SPACING.sm,
  },
  categoryListContent: {
    paddingHorizontal: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  categoryName: {
    fontSize: FONT_SIZES.small,
    marginRight: SPACING.xs,
  },
});

export default CategoryPicker;
