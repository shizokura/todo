import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Task, TaskPriority, TaskStatus } from '../models/types';
import { useAppDispatch, useAppSelector, useTheme } from '../utils';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { generateId } from '../utils/dateUtils';
import { validateTask } from '../utils/validation';

import { Button, Input, TextArea } from '../components/common';
import DatePicker from '../components/feature/datetime/DatePicker';
import TimePicker from '../components/feature/datetime/TimePicker';
import CategoryPicker from '../components/feature/categories/CategoryPicker';
import PrioritySelector from '../components/feature/tasks/PrioritySelector';
import StatusSelector from '../components/feature/tasks/StatusSelector';
import { showToast } from '../components/common/Toast';

type RootStackParamList = {
  TaskForm: { taskId?: string };
  TaskList: undefined;
};

type TaskFormRouteProp = RouteProp<RootStackParamList, 'TaskForm'>;
type TaskFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FormData {
  title: string;
  description: string;
  dueDate: number | null;
  dueTime: number | null;
  categoryId: string | undefined;
  priority: TaskPriority;
  status: TaskStatus;
}

const TaskFormScreen: React.FC = () => {
  const route = useRoute<TaskFormRouteProp>();
  const navigation = useNavigation<TaskFormNavigationProp>();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const categories = useAppSelector((state) => state.categories.items);
  const existingTasks = useAppSelector((state) => state.tasks.items);
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: null,
    dueTime: null,
    categoryId: undefined,
    priority: 'none',
    status: 'incomplete',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingTask = existingTasks.find((task) => task.id === taskId);

  useEffect(() => {
    if (isEditing && existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description || '',
        dueDate: existingTask.dueDate || null,
        dueTime: existingTask.dueDate ? existingTask.dueDate : null,
        categoryId: existingTask.categoryId,
        priority: existingTask.priority,
        status: existingTask.status,
      });
    }
  }, [isEditing, existingTask]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Task title must be 200 characters or less';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showToast('Please fix errors before saving', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = Date.now();
      let dueDateTime = formData.dueDate;

      if (formData.dueDate && formData.dueTime) {
        const date = new Date(formData.dueDate);
        const time = new Date(formData.dueTime);
        date.setHours(time.getHours(), time.getMinutes(), 0, 0);
        dueDateTime = date.getTime();
      }

      const taskData: Task = {
        id: isEditing ? taskId : generateId(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: dueDateTime,
        categoryId: formData.categoryId,
        createdAt: isEditing ? existingTask?.createdAt || now : now,
        updatedAt: now,
        order: isEditing ? existingTask?.order || 0 : 0,
      };

      if (isEditing) {
        dispatch(updateTask({ id: taskId, updates: taskData }));
        showToast('Task updated successfully', 'success');
      } else {
        dispatch(addTask(taskData));
        showToast('Task created successfully', 'success');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
      showToast('Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditing, taskId, existingTask, navigation, dispatch]);

  const handleDelete = () => {
    if (isEditing) {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background.default }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <Input
            label="Task Title *"
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            placeholder="Enter task title"
            error={errors.title}
            maxLength={200}
            autoFocus={!isEditing}
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            placeholder="Add a description (optional)"
            error={errors.description}
            maxLength={2000}
            showCharacterCount
            minHeight={120}
          />

          <CategoryPicker
            categories={categories}
            selectedCategoryId={formData.categoryId}
            onSelect={(id) => updateFormData('categoryId', id)}
          />

          <PrioritySelector
            value={formData.priority}
            onChange={(priority) => updateFormData('priority', priority)}
          />

          <StatusSelector
            value={formData.status}
            onChange={(status) => updateFormData('status', status)}
          />

          <DatePicker
            value={formData.dueDate}
            onChange={(date) => updateFormData('dueDate', date)}
          />

          {formData.dueDate && (
            <TimePicker
              value={formData.dueTime}
              onChange={(time) => updateFormData('dueTime', time)}
            />
          )}
        </View>

        <View style={styles.buttonSection}>
          <Button
            title={isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSave}
            loading={isSubmitting}
            fullWidth
          />

          {isEditing && (
            <Button
              title="Delete Task"
              onPress={handleDelete}
              variant="danger"
              fullWidth
              style={styles.deleteButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  buttonSection: {
    gap: SPACING.sm,
  },
  deleteButton: {
    marginTop: SPACING.md,
  },
});

export default TaskFormScreen;
