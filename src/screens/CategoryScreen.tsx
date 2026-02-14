import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useAppSelector, useTheme } from '../utils';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Category } from '../models/types';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const theme = useTheme();
  return (
    <View style={[styles.categoryItem, { backgroundColor: theme.background.paper }]}>
      <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
      <Text style={[styles.categoryName, { color: theme.text.primary }]}>{category.name}</Text>
    </View>
  );
};

const CategoryScreen: React.FC = () => {
  const categories = useAppSelector(state => state.categories.items);
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.default }]}>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem category={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});

export default CategoryScreen;
