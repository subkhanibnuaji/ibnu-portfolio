import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { SkillBar } from '@/components/SkillBar';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useSkills, useCertifications } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/Badge';

const SKILL_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'programming', label: 'Languages', icon: 'code' },
  { id: 'frameworks', label: 'Frameworks', icon: 'layers' },
  { id: 'ai-ml', label: 'AI/ML', icon: 'hardware-chip' },
  { id: 'blockchain', label: 'Blockchain', icon: 'logo-bitcoin' },
  { id: 'automation', label: 'RPA', icon: 'cog' },
  { id: 'devops', label: 'DevOps', icon: 'server' },
];

export default function SkillsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
    refetch,
  } = useSkills(selectedCategory === 'all' ? undefined : selectedCategory);
  const { data: certifications, isLoading: certsLoading } = useCertifications({ limit: 10 });

  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  if (skillsLoading) {
    return <Loading fullScreen message="Loading skills..." />;
  }

  if (skillsError) {
    return <ErrorView fullScreen message="Failed to load skills" onRetry={refetch} />;
  }

  // Group skills by category for display
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const getCategoryLabel = (categoryId: string) => {
    const category = SKILL_CATEGORIES.find(c => c.id === categoryId);
    return category?.label || categoryId;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {SKILL_CATEGORIES.map((category) => (
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
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={selectedCategory === category.id ? '#fff' : primaryColor}
                style={styles.filterIcon}
              />
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Skills by Category */}
        {selectedCategory === 'all' ? (
          // Show all categories
          Object.entries(groupedSkills || {}).map(([categoryId, categorySkills]) => (
            <View key={categoryId} style={styles.categorySection}>
              <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>
                {getCategoryLabel(categoryId)}
              </ThemedText>
              <Card variant="elevated">
                {categorySkills?.map((skill, index) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    proficiency={skill.proficiency}
                    delay={index * 100}
                  />
                ))}
              </Card>
            </View>
          ))
        ) : (
          // Show selected category
          <Card variant="elevated">
            {skills?.map((skill, index) => (
              <SkillBar
                key={skill.id}
                name={skill.name}
                proficiency={skill.proficiency}
                delay={index * 100}
              />
            ))}
          </Card>
        )}

        {/* Certifications Section */}
        <View style={styles.certSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon-outline" size={24} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Certifications
            </ThemedText>
          </View>

          {certsLoading ? (
            <Loading message="Loading certifications..." />
          ) : (
            <View style={styles.certGrid}>
              {certifications?.map((cert) => (
                <Card key={cert.id} variant="outlined" style={styles.certCard}>
                  <ThemedText type="small" numberOfLines={2} style={styles.certName}>
                    {cert.name}
                  </ThemedText>
                  <ThemedText type="muted" style={styles.certIssuer}>
                    {cert.issuer}
                  </ThemedText>
                  <Badge label={cert.category} variant="default" style={styles.certBadge} />
                </Card>
              ))}
            </View>
          )}

          <ThemedText type="muted" style={styles.certNote}>
            50+ certifications from Harvard, Stanford, Google, McKinsey, and more...
          </ThemedText>
        </View>
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
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  certSection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 12,
  },
  certGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  certCard: {
    width: '47%',
    padding: 12,
  },
  certName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  certIssuer: {
    fontSize: 12,
    marginBottom: 8,
  },
  certBadge: {
    alignSelf: 'flex-start',
  },
  certNote: {
    textAlign: 'center',
    marginTop: 16,
  },
});
