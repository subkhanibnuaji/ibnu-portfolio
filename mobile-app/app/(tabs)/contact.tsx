import { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubmitContact } from '@/hooks/useApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { SOCIAL_LINKS } from '@/constants/config';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: submitContact, isPending } = useSubmitContact();

  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const mutedColor = useThemeColor({}, 'textSecondary');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    submitContact(formData, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Message Sent!',
          'Thank you for reaching out. I will get back to you soon.',
          [{ text: 'OK' }]
        );
        setFormData({ name: '', email: '', subject: '', message: '' });
      },
      onError: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          'Error',
          'Failed to send message. Please try again later.',
          [{ text: 'OK' }]
        );
      },
    });
  };

  const openLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  const contactMethods = [
    { icon: 'mail', label: 'Email', value: 'contact@ibnuaji.com', action: () => openLink(SOCIAL_LINKS.email) },
    { icon: 'logo-linkedin', label: 'LinkedIn', value: '/in/subkhanibnuaji', action: () => openLink(SOCIAL_LINKS.linkedin) },
    { icon: 'logo-github', label: 'GitHub', value: '@subkhanibnuaji', action: () => openLink(SOCIAL_LINKS.github) },
    { icon: 'logo-twitter', label: 'Twitter', value: '@subkhanibnuaji', action: () => openLink(SOCIAL_LINKS.twitter) },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title">Get in Touch</ThemedText>
            <ThemedText type="muted" style={styles.subtitle}>
              Have a question or want to work together? Feel free to reach out!
            </ThemedText>
          </View>

          {/* Contact Methods */}
          <View style={styles.methodsGrid}>
            {contactMethods.map((method) => (
              <Card
                key={method.label}
                variant="outlined"
                style={styles.methodCard}
                onPress={method.action}
              >
                <Ionicons
                  name={method.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={primaryColor}
                />
                <ThemedText type="small" style={styles.methodLabel}>
                  {method.label}
                </ThemedText>
                <ThemedText type="muted" style={styles.methodValue} numberOfLines={1}>
                  {method.value}
                </ThemedText>
              </Card>
            ))}
          </View>

          {/* Contact Form */}
          <Card variant="elevated" style={styles.formCard}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              Send a Message
            </ThemedText>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="small" style={styles.label}>
                Name *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: cardColor,
                    borderColor: errors.name ? '#ef4444' : borderColor,
                    color: textColor,
                  },
                ]}
                placeholder="Your name"
                placeholderTextColor={mutedColor}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name && (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="small" style={styles.label}>
                Email *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: cardColor,
                    borderColor: errors.email ? '#ef4444' : borderColor,
                    color: textColor,
                  },
                ]}
                placeholder="your.email@example.com"
                placeholderTextColor={mutedColor}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email && (
                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
              )}
            </View>

            {/* Subject Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="small" style={styles.label}>
                Subject
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardColor, borderColor, color: textColor },
                ]}
                placeholder="What is this about?"
                placeholderTextColor={mutedColor}
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />
            </View>

            {/* Message Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="small" style={styles.label}>
                Message *
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: cardColor,
                    borderColor: errors.message ? '#ef4444' : borderColor,
                    color: textColor,
                  },
                ]}
                placeholder="Your message..."
                placeholderTextColor={mutedColor}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={formData.message}
                onChangeText={(text) => {
                  setFormData({ ...formData, message: text });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
              />
              {errors.message && (
                <ThemedText style={styles.errorText}>{errors.message}</ThemedText>
              )}
            </View>

            <Button
              title={isPending ? 'Sending...' : 'Send Message'}
              onPress={handleSubmit}
              loading={isPending}
              disabled={isPending}
              icon={<Ionicons name="send" size={18} color="#fff" />}
            />
          </Card>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  methodLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  methodValue: {
    fontSize: 12,
    marginTop: 4,
  },
  formCard: {
    padding: 20,
  },
  formTitle: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});
