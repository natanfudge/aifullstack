const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface SignupData {
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface GeneratePostData {
  topic: string
  style: string
}

interface Post {
  id: number
  title: string
  content: string
  userId: number
  isDraft: boolean
  createdAt: string
  updatedAt: string
}

interface SavePostData {
  title: string
  content: string
  isDraft: boolean
}

interface UpdatePostData extends SavePostData {}

interface AuthResponse {
  token: string
  user: {
    email: string
    id: number
  }
}

// Helper function to log requests for debugging
const logRequest = (method: string, url: string, data?: any) => {
  console.log(`API Request: ${method} ${url}`, data ? { data } : '');
};

// Helper function to log responses for debugging
const logResponse = (method: string, url: string, response: Response, data?: any) => {
  console.log(`API Response: ${method} ${url}`, { 
    status: response.status,
    ok: response.ok,
    data
  });
};

export const api = {
  auth: {
    signup: async (data: SignupData): Promise<AuthResponse> => {
      const url = `${API_BASE_URL}/api/auth/signup`;
      logRequest('POST', url, data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('POST', url, response, error);
        throw new Error(error.error || 'Failed to sign up');
      }

      const result = await response.json();
      logResponse('POST', url, response, result);
      return result;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
      const url = `${API_BASE_URL}/api/auth/login`;
      logRequest('POST', url, data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('POST', url, response, error);
        throw new Error(error.error || 'Failed to login');
      }

      const result = await response.json();
      logResponse('POST', url, response, result);
      return result;
    },
  },

  posts: {
    generate: async (data: GeneratePostData): Promise<Post> => {
      const url = `${API_BASE_URL}/api/generate`;
      logRequest('POST', url, data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('POST', url, response, error);
        throw new Error(error.error || 'Failed to generate post');
      }

      const result = await response.json();
      logResponse('POST', url, response, result);
      return result;
    },

    getAll: async (): Promise<Post[]> => {
      const url = `${API_BASE_URL}/api/posts`;
      logRequest('GET', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        logResponse('GET', url, response, error);
        throw new Error(error.error || 'Failed to fetch posts');
      }

      const result = await response.json();
      logResponse('GET', url, response, result);
      return result;
    },

    save: async (data: SavePostData): Promise<Post> => {
      const url = `${API_BASE_URL}/api/posts`;
      logRequest('POST', url, data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('POST', url, response, error);
        throw new Error(error.error || 'Failed to save post');
      }

      const result = await response.json();
      logResponse('POST', url, response, result);
      return result;
    },

    update: async (id: number, data: UpdatePostData): Promise<Post> => {
      const url = `${API_BASE_URL}/api/posts/${id}`;
      logRequest('PUT', url, data);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('PUT', url, response, error);
        throw new Error(error.error || 'Failed to update post');
      }

      const result = await response.json();
      logResponse('PUT', url, response, result);
      return result;
    },

    delete: async (id: number): Promise<void> => {
      const url = `${API_BASE_URL}/api/posts/${id}`;
      logRequest('DELETE', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('DELETE', url, response, error);
        throw new Error(error.error || 'Failed to delete post');
      }
      
      const result = await response.json();
      logResponse('DELETE', url, response, result);
    },

    getById: async (id: number): Promise<Post> => {
      const url = `${API_BASE_URL}/api/posts/${id}`;
      logRequest('GET', url);
      
      const response = await fetch(url, {
        cache: 'no-store'
      });

      if (!response.ok) {
        const error = await response.json();
        logResponse('GET', url, response, error);
        throw new Error(error.error || 'Failed to fetch post');
      }

      const result = await response.json();
      logResponse('GET', url, response, result);
      return result;
    },
  },
} 