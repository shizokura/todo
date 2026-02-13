import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppSelector } from '../utils/reduxHooks';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { Category } from '../models/types';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  return (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
      <Text style={styles.categoryName}>{category.name}</Text>
    </View>
  );
};

const CategoryScreen: React.FC = () => {
  const categories = useAppSelector(state => state.categories.items);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem category={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  listContent: {
    padding: SPACING.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
  },
  categoryName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
});

export default CategoryScreen;
