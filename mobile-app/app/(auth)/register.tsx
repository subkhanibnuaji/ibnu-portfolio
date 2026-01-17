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

export default function RegisterScreen() {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const primaryColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'tabIconDefault')
  const cardColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await signUp(email, password, fullName.trim())

      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert('Registration Failed', error.message || 'Please try again')
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        Alert.alert(
          'Account Created!',
          'Welcome to the app! You are now signed in.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        )
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
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
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: primaryColor + '20' }]}>
              <Ionicons name="person-add" size={48} color={primaryColor} />
            </View>
            <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
            <ThemedText type="muted" style={styles.subtitle}>
              Sign up to get started with your account
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Full Name</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardColor, borderColor: errors.fullName ? '#ef4444' : borderColor },
                ]}
              >
                <Ionicons name="person-outline" size={20} color={mutedColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={mutedColor}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text)
                    clearError('fullName')
                  }}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.fullName && (
                <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Email</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardColor, borderColor: errors.email ? '#ef4444' : borderColor },
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
                    clearError('email')
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Password</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardColor, borderColor: errors.password ? '#ef4444' : borderColor },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={mutedColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Create a password"
                  placeholderTextColor={mutedColor}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                    clearError('password')
                  }}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={mutedColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
              )}
              <View style={styles.passwordRequirements}>
                <PasswordRequirement met={password.length >= 6} text="At least 6 characters" />
                <PasswordRequirement met={/[A-Z]/.test(password)} text="One uppercase letter" />
                <PasswordRequirement met={/[a-z]/.test(password)} text="One lowercase letter" />
                <PasswordRequirement met={/\d/.test(password)} text="One number" />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Confirm Password</ThemedText>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardColor, borderColor: errors.confirmPassword ? '#ef4444' : borderColor },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={mutedColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={mutedColor}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text)
                    clearError('confirmPassword')
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={mutedColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <ThemedText style={styles.errorText}>{errors.confirmPassword}</ThemedText>
              )}
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => {
                setAcceptTerms(!acceptTerms)
                clearError('terms')
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: errors.terms ? '#ef4444' : borderColor },
                  acceptTerms && { backgroundColor: primaryColor, borderColor: primaryColor },
                ]}
              >
                {acceptTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <ThemedText type="muted" style={styles.termsText}>
                I agree to the{' '}
                <ThemedText type="link">Terms of Service</ThemedText> and{' '}
                <ThemedText type="link">Privacy Policy</ThemedText>
              </ThemedText>
            </TouchableOpacity>
            {errors.terms && (
              <ThemedText style={styles.errorText}>{errors.terms}</ThemedText>
            )}

            {/* Register Button */}
            <Button
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.registerButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <ThemedText type="muted">Already have an account? </ThemedText>
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

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={14}
        color={met ? '#10b981' : '#9ca3af'}
      />
      <ThemedText
        type="small"
        style={[styles.requirementText, met && styles.requirementMet]}
      >
        {text}
      </ThemedText>
    </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
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
  eyeButton: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
  },
  passwordRequirements: {
    marginTop: 4,
    gap: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    color: '#9ca3af',
  },
  requirementMet: {
    color: '#10b981',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 8,
    height: 56,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
})
