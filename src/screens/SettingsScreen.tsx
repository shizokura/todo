import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, SafeAreaView } from 'react-native';
import { useAppSelector, useAppDispatch, useTheme } from '../utils';
import { toggleTheme } from '../store/slices/uiSlice';
import { SPACING, FONT_SIZES } from '../constants/theme';

const SettingsScreen: React.FC = () => {
  const theme = useAppSelector(state => state.ui.theme);
  const colors = useTheme();
  const dispatch = useAppDispatch();

  const isDarkMode = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.background.paper }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>Enable dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={() => dispatch(toggleTheme())}
              trackColor={{ false: '#BDBDBD', true: colors.primary }}
              thumbColor={colors.text.inverse}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>About</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.background.paper }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Version</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: FONT_SIZES.small,
  },
});

export default SettingsScreen;
