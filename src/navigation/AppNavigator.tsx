import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import SearchScreen from '../screens/SearchScreen';
import ArchivedTasksScreen from '../screens/ArchivedTasksScreen';
import { useTheme } from '../utils/useTheme';

export type RootStackParamList = {
  Tabs: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string };
  Search: undefined;
  Archived: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        id: 'todo-stack',
        headerStyle: {
          backgroundColor: theme.background.paper,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.taskId ? 'Edit Task' : 'New Task',
        })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="Archived"
        component={ArchivedTasksScreen}
        options={{ title: 'Archived Tasks' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
