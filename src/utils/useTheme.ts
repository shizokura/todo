import { useAppSelector } from './reduxHooks';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

export const useTheme = () => {
  const theme = useAppSelector(state => state.ui.theme);
  return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
};