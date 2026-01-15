import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ContactForm } from '@/types';

// Query Keys
export const queryKeys = {
  summary: ['summary'] as const,
  profile: ['profile'] as const,
  projects: (params?: { category?: string; featured?: boolean }) =>
    ['projects', params] as const,
  experience: ['experience'] as const,
  education: ['education'] as const,
  skills: (category?: string) => ['skills', category] as const,
  certifications: (params?: { category?: string }) =>
    ['certifications', params] as const,
  interests: ['interests'] as const,
};

// Summary Hook
export function useSummary() {
  return useQuery({
    queryKey: queryKeys.summary,
    queryFn: () => api.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Profile Hook
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

// Projects Hook
export function useProjects(params?: { category?: string; featured?: boolean; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.projects(params),
    queryFn: () => api.getProjects(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Experience Hook
export function useExperience() {
  return useQuery({
    queryKey: queryKeys.experience,
    queryFn: () => api.getExperience(),
    staleTime: 5 * 60 * 1000,
  });
}

// Education Hook
export function useEducation() {
  return useQuery({
    queryKey: queryKeys.education,
    queryFn: () => api.getEducation(),
    staleTime: 5 * 60 * 1000,
  });
}

// Skills Hook
export function useSkills(category?: string) {
  return useQuery({
    queryKey: queryKeys.skills(category),
    queryFn: () => api.getSkills(category),
    staleTime: 5 * 60 * 1000,
  });
}

// Certifications Hook
export function useCertifications(params?: { category?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.certifications(params),
    queryFn: () => api.getCertifications(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Interests Hook
export function useInterests() {
  return useQuery({
    queryKey: queryKeys.interests,
    queryFn: () => api.getInterests(),
    staleTime: 5 * 60 * 1000,
  });
}

// Contact Mutation Hook
export function useSubmitContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactForm) => api.submitContact(data),
    onSuccess: () => {
      // Optionally invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
