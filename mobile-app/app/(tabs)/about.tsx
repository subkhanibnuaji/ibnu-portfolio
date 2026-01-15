import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Loading } from '@/components/Loading';
import { ErrorView } from '@/components/ErrorView';
import { useProfile, useExperience, useEducation, useInterests } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { data: experience, isLoading: expLoading } = useExperience();
  const { data: education, isLoading: eduLoading } = useEducation();
  const { data: interests, isLoading: intLoading } = useInterests();

  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const successColor = useThemeColor({}, 'success');

  if (profileLoading || expLoading || eduLoading) {
    return <Loading fullScreen message="Loading profile..." />;
  }

  if (profileError) {
    return <ErrorView fullScreen message="Failed to load profile" onRetry={refetchProfile} />;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bio Section */}
        <Card variant="elevated" style={styles.bioCard}>
          <View style={styles.bioHeader}>
            <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
              <ThemedText style={styles.avatarText}>IA</ThemedText>
            </View>
            <View style={styles.bioInfo}>
              <ThemedText type="subtitle">{profile?.name}</ThemedText>
              <ThemedText type="muted">{profile?.title}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.bioText}>{profile?.bio}</ThemedText>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={primaryColor} />
            <ThemedText type="muted" style={styles.locationText}>
              {profile?.location}
            </ThemedText>
          </View>
        </Card>

        {/* Experience Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={24} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Experience
            </ThemedText>
          </View>

          {experience?.map((exp, index) => (
            <Card key={exp.id} variant="outlined" style={styles.timelineCard}>
              <View style={styles.timelineDot}>
                <View style={[styles.dot, { backgroundColor: exp.isCurrent ? successColor : primaryColor }]} />
                {index < (experience.length - 1) && <View style={styles.line} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.expHeader}>
                  <ThemedText type="defaultSemiBold">{exp.position}</ThemedText>
                  {exp.isCurrent && <Badge label="Current" variant="success" />}
                </View>
                <ThemedText type="muted">{exp.company}</ThemedText>
                <ThemedText type="small" style={styles.dateRange}>
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </ThemedText>
                <ThemedText type="small" style={styles.expDesc}>
                  {exp.description}
                </ThemedText>
                {exp.highlights.length > 0 && (
                  <View style={styles.highlights}>
                    {exp.highlights.slice(0, 3).map((highlight, idx) => (
                      <View key={idx} style={styles.highlightRow}>
                        <Ionicons name="checkmark-circle" size={14} color={successColor} />
                        <ThemedText type="small" style={styles.highlightText}>
                          {highlight}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={24} color={secondaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Education
            </ThemedText>
          </View>

          {education?.map((edu) => (
            <Card key={edu.id} variant="elevated" style={styles.eduCard}>
              <ThemedText type="defaultSemiBold">{edu.institution}</ThemedText>
              <ThemedText type="muted">{edu.degree} in {edu.field}</ThemedText>
              <ThemedText type="small" style={styles.dateRange}>
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </ThemedText>
              {edu.gpa && (
                <Badge label={`GPA: ${edu.gpa.toFixed(2)}`} variant="primary" style={styles.gpaBadge} />
              )}
              {edu.description && (
                <ThemedText type="small" style={styles.eduDesc}>{edu.description}</ThemedText>
              )}
            </Card>
          ))}
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={24} color="#ef4444" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Interests
            </ThemedText>
          </View>

          {intLoading ? (
            <Loading message="Loading interests..." />
          ) : (
            interests?.map((interest) => (
              <Card key={interest.id} variant="elevated" style={styles.interestCard}>
                <View style={styles.interestHeader}>
                  <View style={[styles.interestIcon, { backgroundColor: `${interest.color}20` }]}>
                    <Ionicons
                      name={
                        interest.icon === 'brain' ? 'hardware-chip' :
                        interest.icon === 'bitcoin' ? 'logo-bitcoin' :
                        interest.icon === 'shield' ? 'shield-checkmark' : 'star'
                      }
                      size={24}
                      color={interest.color}
                    />
                  </View>
                  <ThemedText type="defaultSemiBold">{interest.title}</ThemedText>
                </View>
                <ThemedText type="muted" style={styles.interestDesc}>
                  {interest.description}
                </ThemedText>
                <View style={styles.topicsContainer}>
                  {interest.topics.slice(0, 4).map((topic, idx) => (
                    <Badge key={idx} label={topic.name} variant="default" />
                  ))}
                </View>
              </Card>
            ))
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
  bioCard: {
    marginBottom: 24,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bioInfo: {
    flex: 1,
  },
  bioText: {
    lineHeight: 24,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 12,
  },
  timelineCard: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateRange: {
    marginTop: 4,
    opacity: 0.7,
  },
  expDesc: {
    marginTop: 8,
    lineHeight: 20,
  },
  highlights: {
    marginTop: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightText: {
    marginLeft: 6,
    flex: 1,
  },
  eduCard: {
    marginBottom: 12,
  },
  gpaBadge: {
    marginTop: 8,
  },
  eduDesc: {
    marginTop: 8,
    lineHeight: 20,
  },
  interestCard: {
    marginBottom: 12,
  },
  interestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  interestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  interestDesc: {
    marginBottom: 12,
    lineHeight: 22,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
