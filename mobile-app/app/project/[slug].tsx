import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useProjects } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

export default function ProjectDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: projects, isLoading, error, refetch } = useProjects();

  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const successColor = useThemeColor({}, 'success');

  const project = projects?.find(p => p.slug === slug);

  if (isLoading) {
    return <Loading fullScreen message="Loading project..." />;
  }

  if (error || !project) {
    return (
      <ErrorView
        fullScreen
        message={error ? 'Failed to load project' : 'Project not found'}
        onRetry={refetch}
      />
    );
  }

  const openLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'primary' | 'default' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'PLANNING':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: project.title,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>
                {project.title}
              </ThemedText>
              {project.featured && (
                <Ionicons name="star" size={20} color="#f59e0b" />
              )}
            </View>
            <View style={styles.badges}>
              <Badge
                label={project.status.replace('_', ' ')}
                variant={getStatusColor(project.status)}
                size="md"
              />
              <Badge label={project.category} variant="secondary" size="md" />
            </View>
          </View>
        </View>

        {/* Description */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color={primaryColor} />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Description
            </ThemedText>
          </View>
          <ThemedText style={styles.description}>{project.description}</ThemedText>
          {project.longDesc && (
            <ThemedText type="muted" style={styles.longDesc}>
              {project.longDesc}
            </ThemedText>
          )}
        </Card>

        {/* Impact */}
        {project.impact && (
          <Card variant="outlined" style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <Ionicons name="trending-up" size={24} color={successColor} />
              <ThemedText type="defaultSemiBold" style={styles.impactTitle}>
                Impact
              </ThemedText>
            </View>
            <ThemedText style={styles.impactText}>{project.impact}</ThemedText>
          </Card>
        )}

        {/* Technologies */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash-outline" size={20} color={primaryColor} />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Technologies
            </ThemedText>
          </View>
          <View style={styles.techGrid}>
            {project.technologies.map((tech, index) => (
              <Badge key={index} label={tech} variant="primary" size="md" />
            ))}
          </View>
        </Card>

        {/* Features */}
        {project.features.length > 0 && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={20} color={secondaryColor} />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Key Features
              </ThemedText>
            </View>
            {project.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={successColor} />
                <ThemedText style={styles.featureText}>{feature}</ThemedText>
              </View>
            ))}
          </Card>
        )}

        {/* Links */}
        <View style={styles.linksContainer}>
          {project.liveUrl && (
            <Button
              title="View Live"
              onPress={() => openLink(project.liveUrl!)}
              variant="primary"
              icon={<Ionicons name="globe-outline" size={18} color="#fff" />}
              style={styles.linkButton}
            />
          )}
          {project.githubUrl && (
            <Button
              title="View Source"
              onPress={() => openLink(project.githubUrl!)}
              variant="outline"
              icon={<Ionicons name="logo-github" size={18} color={primaryColor} />}
              style={styles.linkButton}
            />
          )}
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
  header: {
    marginBottom: 20,
  },
  headerTop: {
    gap: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  description: {
    lineHeight: 24,
  },
  longDesc: {
    marginTop: 12,
    lineHeight: 22,
  },
  impactCard: {
    marginBottom: 16,
    borderColor: '#10b981',
    borderWidth: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  impactTitle: {
    marginLeft: 8,
  },
  impactText: {
    lineHeight: 22,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 22,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  linkButton: {
    flex: 1,
  },
});
