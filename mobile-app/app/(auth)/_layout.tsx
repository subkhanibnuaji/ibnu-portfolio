import { Stack } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function AuthLayout() {
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  )
}
