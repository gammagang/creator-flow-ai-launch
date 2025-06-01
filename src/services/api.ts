
import { toast } from "sonner";

const BASE_URL = "https://influencer-flow-ai-be.onrender.com";

// Helper function to get the access token from localStorage
const getAccessToken = (): string | null => {
  try {
    const authData = localStorage.getItem('sb-tysrnidaipchnspynnoz-auth-token');
    if (!authData) return null;
    
    const parsedData = JSON.parse(authData);
    return parsedData.access_token || null;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

// Create headers with authorization
const createHeaders = (): HeadersInit => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = createHeaders();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    toast.error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// API service methods
export const apiService = {
  // GET request
  get: async <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'GET' });
  },
  
  // POST request
  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // PUT request
  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },
  
  // PATCH request
  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

export default apiService;
