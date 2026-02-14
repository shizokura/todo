import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Task } from '../models/types';
import { useAppSelector, useTheme } from '../utils';
import { RootStackNavigation } from '../navigation/AppNavigator';
import EmptyState from '../components/common/EmptyState';
import { TaskItem } from './TaskListScreen';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const theme = useTheme();
  const tasks = useAppSelector((state) => state.tasks.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const performSearch = useCallback((query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filtered);

    if (query.length >= 2 && !searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev].slice(0, 10));
    }
  }, [tasks, searchHistory]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    performSearch(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderSearchResult = ({ item }: { item: Task }) => (
    <TaskItem task={item} onPress={() => {}} />
  );

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.historyItem, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#F0F0F0' : '#3A3A3A' }]}
      onPress={() => handleSearch(item)}
    >
      <Icon name="history" size={20} color={theme.text.secondary} />
      <Text style={[styles.historyText, { color: theme.text.primary }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background.default }]}>
      <View style={[styles.searchBar, { backgroundColor: theme.background.paper, borderColor: theme.text.disabled }]}>
        <Icon name="search" size={24} color={theme.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text.primary }]}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search tasks..."
          placeholderTextColor={theme.text.disabled}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Icon name="close" size={24} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length < 2 && searchHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: theme.text.secondary }]}>Recent Searches</Text>
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `history-${index}`}
          />
        </View>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <EmptyState
          title="No Results"
          message={`No tasks found matching "${searchQuery}"`}
        />
      )}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    margin: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.sm,
  },
  historySection: {
    padding: SPACING.md,
  },
  historyTitle: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  historyText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
  },
});

export default SearchScreen;
