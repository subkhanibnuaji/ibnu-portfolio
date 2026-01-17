import { ScrollView, StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useSummary, useProjects } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useNotes } from '@/contexts/NotesContext';
import { SOCIAL_LINKS } from '@/constants/config';
import * as WebBrowser from 'expo-web-browser';

export default function HomeScreen() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch } = useSummary();
  const { data: featuredProjects, isLoading: projectsLoading } = useProjects({ featured: true, limit: 2 });
  const { isAuthenticated, user } = useAuth();
  const { favorites } = useFavorites();
  const { notes } = useNotes();

  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const accentColor = useThemeColor({}, 'accent');
  const mutedColor = useThemeColor({}, 'tabIconDefault');

  if (summaryLoading) {
    return <Loading fullScreen message="Loading portfolio..." />;
  }

  if (summaryError) {
    return <ErrorView fullScreen message="Failed to load portfolio" onRetry={refetch} />;
  }

  const openLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
              <ThemedText style={styles.avatarText}>IA</ThemedText>
            </View>
          </View>
          <ThemedText type="title" style={styles.name}>
            {summary?.profile.name || 'Subkhan Ibnu Aji'}
          </ThemedText>
          <ThemedText type="muted" style={styles.title}>
            {summary?.profile.title || 'S.Kom., M.B.A.'}
          </ThemedText>
          <ThemedText type="muted" style={styles.tagline}>
            {summary?.profile.tagline || 'Civil Servant | Tech Enthusiast | Crypto Investor'}
          </ThemedText>

          {/* Social Links */}
          <View style={styles.socialLinks}>
            <Pressable onPress={() => openLink(SOCIAL_LINKS.github)} style={styles.socialButton}>
              <Ionicons name="logo-github" size={24} color={primaryColor} />
            </Pressable>
            <Pressable onPress={() => openLink(SOCIAL_LINKS.linkedin)} style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={24} color={primaryColor} />
            </Pressable>
            <Pressable onPress={() => openLink(SOCIAL_LINKS.twitter)} style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={24} color={primaryColor} />
            </Pressable>
          </View>
        </View>

        {/* User Quick Actions (if logged in) */}
        {isAuthenticated && (
          <Card style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={[styles.userAvatar, { backgroundColor: primaryColor + '20' }]}>
                  <ThemedText style={[styles.userAvatarText, { color: primaryColor }]}>
                    {(user?.email || 'U').charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText type="defaultSemiBold">
                    Welcome, {user?.user_metadata?.full_name || 'User'}!
                  </ThemedText>
                  <ThemedText type="muted">{user?.email}</ThemedText>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Ionicons name="chevron-forward" size={20} color={mutedColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.userStats}>
              <TouchableOpacity
                style={styles.userStatItem}
                onPress={() => router.push('/favorites')}
              >
                <Ionicons name="heart" size={20} color="#ef4444" />
                <ThemedText type="small">{favorites.length} Favorites</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userStatItem}
                onPress={() => router.push('/notes')}
              >
                <Ionicons name="document-text" size={20} color="#3b82f6" />
                <ThemedText type="small">{notes.length} Notes</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userStatItem}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="settings" size={20} color="#8b5cf6" />
                <ThemedText type="small">Settings</ThemedText>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Quick Features Banner (if not logged in) */}
        {!isAuthenticated && (
          <Card
            style={styles.loginBanner}
            onPress={() => router.push('/(auth)/login')}
          >
            <View style={styles.loginBannerContent}>
              <View style={[styles.loginIcon, { backgroundColor: primaryColor + '20' }]}>
                <Ionicons name="person-add" size={24} color={primaryColor} />
              </View>
              <View style={styles.loginBannerText}>
                <ThemedText type="defaultSemiBold">Sign in for more features</ThemedText>
                <ThemedText type="muted">Save favorites, create notes & more</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={mutedColor} />
            </View>
          </Card>
        )}

        {/* Stats Section */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Projects', value: summary?.stats.projects || 7, icon: 'folder', color: primaryColor },
            { label: 'Certifications', value: summary?.stats.certifications || 50, icon: 'ribbon', color: secondaryColor },
            { label: 'Experience', value: summary?.stats.experience || 4, icon: 'briefcase', color: accentColor },
            { label: 'Skills', value: summary?.stats.skills || 29, icon: 'code-slash', color: '#10b981' },
          ].map((stat, index) => (
            <Card key={index} variant="elevated" style={styles.statCard}>
              <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={24} color={stat.color} />
              <ThemedText type="title" style={styles.statValue}>
                {stat.value}+
              </ThemedText>
              <ThemedText type="muted">{stat.label}</ThemedText>
            </Card>
          ))}
        </View>

        {/* Featured Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Featured Projects</ThemedText>
            <Link href="/projects" asChild>
              <Pressable>
                <ThemedText type="link">View All</ThemedText>
              </Pressable>
            </Link>
          </View>

          {projectsLoading ? (
            <Loading message="Loading projects..." />
          ) : (
            featuredProjects?.map((project) => (
              <Link key={project.id} href={`/project/${project.slug}`} asChild>
                <Card variant="elevated" style={styles.projectCard} onPress={() => {}}>
                  <View style={styles.projectHeader}>
                    <ThemedText type="defaultSemiBold">{project.title}</ThemedText>
                    <Badge
                      label={project.status.replace('_', ' ')}
                      variant={project.status === 'COMPLETED' ? 'success' : 'warning'}
                    />
                  </View>
                  <ThemedText type="muted" numberOfLines={2} style={styles.projectDesc}>
                    {project.description}
                  </ThemedText>
                  <View style={styles.techStack}>
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <Badge key={idx} label={tech} variant="default" />
                    ))}
                  </View>
                </Card>
              </Link>
            ))
          )}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Explore
          </ThemedText>
          <View style={styles.quickLinks}>
            {[
              { route: '/about', label: 'About Me', icon: 'person', color: primaryColor },
              { route: '/skills', label: 'Skills', icon: 'code-slash', color: secondaryColor },
              { route: '/contact', label: 'Contact', icon: 'mail', color: accentColor },
            ].map((link) => (
              <Link key={link.route} href={link.route as never} asChild>
                <Card variant="outlined" style={styles.quickLinkCard} onPress={() => {}}>
                  <Ionicons name={link.icon as keyof typeof Ionicons.glyphMap} size={28} color={link.color} />
                  <ThemedText type="small" style={styles.quickLinkLabel}>
                    {link.label}
                  </ThemedText>
                </Card>
              </Link>
            ))}
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Features
          </ThemedText>
          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: '#fef3c7' }]}
              onPress={() => router.push('/favorites')}
            >
              <Ionicons name="heart" size={28} color="#f59e0b" />
              <ThemedText style={styles.featureLabel}>Favorites</ThemedText>
              <ThemedText style={styles.featureCount}>{favorites.length}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: '#dbeafe' }]}
              onPress={() => router.push('/notes')}
            >
              <Ionicons name="document-text" size={28} color="#3b82f6" />
              <ThemedText style={styles.featureLabel}>Notes</ThemedText>
              <ThemedText style={styles.featureCount}>{notes.length}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: '#dcfce7' }]}
              onPress={() => router.push('/analytics')}
            >
              <Ionicons name="analytics" size={28} color="#10b981" />
              <ThemedText style={styles.featureLabel}>Activity</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: '#f3e8ff' }]}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={28} color="#8b5cf6" />
              <ThemedText style={styles.featureLabel}>Search</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    textAlign: 'center',
  },
  title: {
    marginTop: 4,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    padding: 16,
    marginBottom: 24,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  userStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  loginBanner: {
    padding: 16,
    marginBottom: 24,
  },
  loginBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loginBannerText: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statValue: {
    marginTop: 8,
    fontSize: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  projectCard: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectDesc: {
    marginBottom: 12,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickLinkCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  quickLinkLabel: {
    marginTop: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featureCount: {
    fontSize: 12,
    color: '#6b7280',
  },
});
