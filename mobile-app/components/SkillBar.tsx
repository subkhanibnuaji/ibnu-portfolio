import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import { useEffect } from 'react';

interface SkillBarProps {
  name: string;
  proficiency: number;
  delay?: number;
}

export function SkillBar({ name, proficiency, delay = 0 }: SkillBarProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'border');
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(proficiency, { duration: 1000 }));
  }, [proficiency, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="small">{name}</ThemedText>
        <ThemedText type="muted">{proficiency}%</ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.fill, { backgroundColor: primaryColor }, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
