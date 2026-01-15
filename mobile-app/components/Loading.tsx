import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  const primaryColor = useThemeColor({}, 'primary');

  if (fullScreen) {
    return (
      <ThemedView style={styles.fullScreen}>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={styles.message} type="muted">
          {message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={primaryColor} />
      <ThemedText style={styles.message} type="muted">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
  },
});
