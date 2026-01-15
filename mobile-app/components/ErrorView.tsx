import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorView({
  message = 'Something went wrong',
  onRetry,
  fullScreen = false,
}: ErrorViewProps) {
  const errorColor = useThemeColor({}, 'error');

  return (
    <ThemedView style={[styles.container, fullScreen && styles.fullScreen]}>
      <Ionicons name="alert-circle-outline" size={48} color={errorColor} />
      <ThemedText style={styles.message} type="muted">
        {message}
      </ThemedText>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} variant="outline" style={styles.button} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});
