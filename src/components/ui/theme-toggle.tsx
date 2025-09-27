import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleTheme } from '../../store/slices/themeSlice';

export const ThemeToggle = () => {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => dispatch(toggleTheme())}
      className="h-9 w-9 p-0"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};