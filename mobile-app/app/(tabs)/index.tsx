import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useSummary, useProjects } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SOCIAL_LINKS } from '@/constants/config';
import * as WebBrowser from 'expo-web-browser';

export default function HomeScreen() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch } = useSummary();
  const { data: featuredProjects, isLoading: projectsLoading } = useProjects({ featured: true, limit: 2 });

  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const accentColor = useThemeColor({}, 'accent');

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
    marginBottom: 32,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
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
});
