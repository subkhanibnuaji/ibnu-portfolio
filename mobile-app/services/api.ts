import { API_BASE_URL, API_ENDPOINTS } from '@/constants/config';
import type {
  ApiResponse,
  Profile,
  Project,
  Experience,
  Education,
  Skill,
  Certification,
  Interest,
  Summary,
  ContactForm,
} from '@/types';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Summary - for initial app load
  async getSummary(): Promise<Summary> {
    const response = await this.fetch<Summary>(API_ENDPOINTS.summary);
    return response.data;
  }

  // Profile
  async getProfile(): Promise<Profile> {
    const response = await this.fetch<Profile>(API_ENDPOINTS.profile);
    return response.data;
  }

  // Projects
  async getProjects(params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Project[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.projects}?${query}` : API_ENDPOINTS.projects;

    const response = await this.fetch<Project[]>(endpoint);
    return response.data;
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.slug === slug) || null;
  }

  // Experience
  async getExperience(): Promise<Experience[]> {
    const response = await this.fetch<Experience[]>(API_ENDPOINTS.experience);
    return response.data;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    const response = await this.fetch<Education[]>(API_ENDPOINTS.education);
    return response.data;
  }

  // Skills
  async getSkills(category?: string): Promise<Skill[]> {
    const endpoint = category
      ? `${API_ENDPOINTS.skills}?category=${category}`
      : API_ENDPOINTS.skills;

    const response = await this.fetch<Skill[]>(endpoint);
    return response.data;
  }

  // Certifications
  async getCertifications(params?: {
    category?: string;
    limit?: number;
  }): Promise<Certification[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    const endpoint = query
      ? `${API_ENDPOINTS.certifications}?${query}`
      : API_ENDPOINTS.certifications;

    const response = await this.fetch<Certification[]>(endpoint);
    return response.data;
  }

  // Interests
  async getInterests(): Promise<Interest[]> {
    const response = await this.fetch<Interest[]>(API_ENDPOINTS.interests);
    return response.data;
  }

  // Contact
  async submitContact(data: ContactForm): Promise<{ message: string }> {
    const response = await this.fetch<{ message: string }>(API_ENDPOINTS.contact, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || { message: response.message || 'Success' };
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
