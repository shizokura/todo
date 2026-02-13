import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useAppSelector, useAppDispatch } from '../utils/reduxHooks';
import { toggleTheme } from '../store/slices/uiSlice';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const SettingsScreen: React.FC = () => {
  const theme = useAppSelector(state => state.ui.theme);
  const dispatch = useAppDispatch();

  const isDarkMode = theme === 'dark';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={(value) => {
                if (value) {
                  dispatch(toggleTheme());
                }
              }}
              trackColor={{ false: '#BDBDBD', true: COLORS.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZES.large,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text.secondary,
  },
});

export default SettingsScreen;
