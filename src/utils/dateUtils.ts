export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDate: number): boolean => {
  return dueDate < Date.now();
};

export const getDaysUntilDue = (dueDate: number): number => {
  const now = Date.now();
  const diff = dueDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getDueDateLabel = (dueDate: number): string => {
  const days = getDaysUntilDue(dueDate);
  
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days`;
  return formatDate(dueDate);
};
