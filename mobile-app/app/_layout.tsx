import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { NotesProvider } from '@/contexts/NotesContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = colorScheme ?? 'dark';
  const colors = Colors[theme];

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <NotesProvider>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: '600',
                },
                contentStyle: {
                  backgroundColor: colors.background,
                },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="project/[slug]"
                options={{
                  title: 'Project Details',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="profile"
                options={{
                  title: 'Profile',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  title: 'Settings',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="favorites"
                options={{
                  title: 'Favorites',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="notes"
                options={{
                  title: 'My Notes',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="note/[id]"
                options={{
                  title: 'Note',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="search"
                options={{
                  title: 'Search',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="analytics"
                options={{
                  title: 'Activity',
                  presentation: 'card',
                }}
              />
            </Stack>
          </NotesProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
