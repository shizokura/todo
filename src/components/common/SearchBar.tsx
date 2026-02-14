import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACING, FONT_SIZES } from '../../constants/theme';
import { useTheme } from '../../utils/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  showHistory?: boolean;
  history?: string[];
  onHistoryItemPress?: (item: string) => void;
  minSearchLength?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  containerStyle,
  showHistory = true,
  history = [],
  onHistoryItemPress,
  minSearchLength = 2,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const showClearButton = value.length > 0;
  const showHistoryList = isFocused && showHistory && value.length === 0 && history.length > 0;

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
    onClear?.();
  };

  const handleHistoryItemPress = (item: string) => {
    onChangeText(item);
    setIsFocused(false);
    onHistoryItemPress?.(item);
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.historyItem, { borderBottomColor: theme.background.paper === '#F5F5F5' ? '#F0F0F0' : '#3A3A3A' }]}
      onPress={() => handleHistoryItemPress(item)}
    >
      <Icon name="history" size={20} color={theme.text.secondary} />
      <Text style={[styles.historyText, { color: theme.text.primary }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background.paper, borderColor: theme.text.disabled },
          isFocused && { borderColor: theme.primary },
        ]}
      >
        <Icon name="search" size={24} color={theme.text.secondary} />

        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.text.primary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          accessibilityLabel="Search"
          accessibilityRole="search"
        />

        {showClearButton && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Icon name="close" size={24} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {showHistoryList && (
        <View style={[styles.historyList, { backgroundColor: theme.background.default, borderColor: theme.text.disabled }]}>
          <FlatList
            data={history.slice(0, 10)}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `history-${index}`}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <Text style={[styles.historyHeader, { color: theme.text.secondary }]}>Recent Searches</Text>
            }
          />
        </View>
      )}

      {value.length > 0 && value.length < minSearchLength && (
        <Text style={[styles.hintText, { color: theme.text.secondary }]}>
          Type at least {minSearchLength} characters to search
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
    zIndex: 10,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  historyList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 9,
    maxHeight: 300,
  },
  historyHeader: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  historyText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    marginLeft: SPACING.md,
  },
  hintText: {
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.sm,
    marginLeft: SPACING.sm + 28,
  },
});

export default SearchBar;