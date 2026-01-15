import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useProjects } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'government', label: 'Government' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'web3', label: 'Web3' },
  { id: 'research', label: 'Research' },
];

export default function ProjectsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useProjects(
    selectedCategory === 'all' ? undefined : { category: selectedCategory }
  );

  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  if (isLoading) {
    return <Loading fullScreen message="Loading projects..." />;
  }

  if (error) {
    return <ErrorView fullScreen message="Failed to load projects" onRetry={refetch} />;
  }

  const getStatusColor = (status: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government':
        return 'business';
      case 'enterprise':
        return 'briefcase';
      case 'web3':
        return 'logo-bitcoin';
      case 'research':
        return 'flask';
      default:
        return 'folder';
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedCategory === category.id ? primaryColor : 'transparent',
                  borderColor: selectedCategory === category.id ? primaryColor : borderColor,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  { color: selectedCategory === category.id ? '#fff' : undefined },
                ]}
              >
                {category.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Projects List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {projects?.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color={borderColor} />
            <ThemedText type="muted" style={styles.emptyText}>
              No projects found in this category
            </ThemedText>
          </View>
        ) : (
          projects?.map((project) => (
            <Link key={project.id} href={`/project/${project.slug}`} asChild>
              <Card variant="elevated" style={styles.projectCard} onPress={() => {}}>
                <View style={styles.projectHeader}>
                  <View style={styles.categoryIcon}>
                    <Ionicons
                      name={getCategoryIcon(project.category) as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={primaryColor}
                    />
                  </View>
                  <View style={styles.projectTitleContainer}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {project.title}
                    </ThemedText>
                    {project.featured && (
                      <Ionicons name="star" size={16} color="#f59e0b" style={styles.starIcon} />
                    )}
                  </View>
                </View>

                <ThemedText type="muted" numberOfLines={3} style={styles.description}>
                  {project.description}
                </ThemedText>

                <View style={styles.projectMeta}>
                  <Badge
                    label={project.status.replace('_', ' ')}
                    variant={getStatusColor(project.status) as 'success' | 'warning' | 'primary' | 'default'}
                  />
                  <Badge label={project.category} variant="secondary" />
                </View>

                <View style={styles.techStack}>
                  {project.technologies.slice(0, 5).map((tech, idx) => (
                    <Badge key={idx} label={tech} variant="default" />
                  ))}
                  {project.technologies.length > 5 && (
                    <Badge label={`+${project.technologies.length - 5}`} variant="default" />
                  )}
                </View>
              </Card>
            </Link>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  projectCard: {
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 22,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
  },
});
