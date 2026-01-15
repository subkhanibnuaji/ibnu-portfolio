import { View, StyleSheet, type ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
  const colors = {
    default: useThemeColor({}, 'border'),
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    primary: useThemeColor({}, 'primary'),
    secondary: useThemeColor({}, 'secondary'),
  };

  const textColors = {
    default: useThemeColor({}, 'text'),
    success: '#ffffff',
    warning: '#ffffff',
    error: '#ffffff',
    primary: '#ffffff',
    secondary: '#ffffff',
  };

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: colors[variant] },
        style,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: textColors[variant] },
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  text: {
    fontWeight: '500',
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
});
