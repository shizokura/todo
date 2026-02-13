export const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  success: '#4CAF50',
  
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  priority: {
    high: '#F44336',
    medium: '#FF9800',
    low: '#2196F3',
    none: '#BDBDBD',
  },
};

export const TASK_STATUS_COLORS = {
  incomplete: '#BDBDBD',
  in_progress: '#2196F3',
  completed: '#4CAF50',
  archived: '#757575',
};

export const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal', color: '#2196F3' },
  { id: 'work', name: 'Work', color: '#4CAF50' },
  { id: 'shopping', name: 'Shopping', color: '#FF9800' },
  { id: 'health', name: 'Health', color: '#E91E63' },
  { id: 'others', name: 'Others', color: '#9E9E9E' },
];

export const PRIORITY_LEVELS = ['high', 'medium', 'low', 'none'] as const;

export const TASK_STATUS = ['incomplete', 'in_progress', 'completed', 'archived'] as const;

export const VIEW_MODES = ['list', 'kanban'] as const;

export const FONT_SIZES = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 24,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const ANIMATIONS = {
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};
