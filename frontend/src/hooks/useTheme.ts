import { theme } from '../styles/theme';
import type { Theme } from '../styles/theme';

export const useTheme = (): Theme => {
  return theme;
};

export default useTheme;

