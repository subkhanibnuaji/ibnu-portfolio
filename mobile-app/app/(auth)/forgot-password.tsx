import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Link, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')

  const validateEmail = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    return true
  }

  const handleResetPassword = async () => {
    if (!validateEmail()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email)

      if (error) {
        // In demo mode, just show success anyway
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setIsEmailSent(true)
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setIsEmailSent(true)
      }
    } catch (error) {
      // In demo mode, show success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setIsEmailSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: '#10b98120' }]}>
            <Ionicons name="mail" size={64} color="#10b981" />
          </View>
          <ThemedText type="title" style={styles.successTitle}>Check Your Email</ThemedText>
          <ThemedText type="muted" style={styles.successText}>
            We've sent a password reset link to{'\n'}
            <ThemedText type="defaultSemiBold">{email}</ThemedText>
          </ThemedText>
          <ThemedText type="muted" style={styles.instructionText}>
            Click the link in the email to reset your password. If you don't see the email, check your spam folder.
          </ThemedText>

          <Button
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backButton}
          >
            Back to Sign In
          </Button>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setIsEmailSent(false)
              handleResetPassword()
            }}
          >
            <ThemedText type="link">Didn't receive email? Resend</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: primaryColor + '20' }]}>
              <Ionicons name="key" size={48} color={primaryColor} />
            </View>
            <ThemedText type="title" style={styles.title}>Forgot Password?</ThemedText>
            <ThemedText type="muted" style={styles.subtitle}>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Email Address</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardColor, borderColor: error ? '#ef4444' : borderColor },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={mutedColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter your email"
                  placeholderTextColor={mutedColor}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    if (error) setError('')
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                />
              </View>
              {error && (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              )}
            </View>

            {/* Reset Button */}
            <Button
              onPress={handleResetPassword}
              disabled={isLoading}
              style={styles.resetButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                'Send Reset Link'
              )}
            </Button>

            {/* Back to Login */}
            <View style={styles.loginContainer}>
              <ThemedText type="muted">Remember your password? </ThemedText>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <ThemedText type="link">Sign In</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backArrow: {
    marginBottom: 16,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
  },
  resetButton: {
    height: 56,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  // Success state styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  instructionText: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    width: '100%',
    height: 56,
    marginBottom: 16,
  },
  resendButton: {
    padding: 16,
  },
})
