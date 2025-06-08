const API_URL = 'http://127.0.0.1:8000/api';

// Storage for auth token
let authToken: string | null = null;

// Helper function to get headers with auth token
const getHeaders = (includeAuth: boolean = true) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth && authToken) {
        headers['Authorization'] = `Token ${authToken}`;
    }

    return headers;
};

// Authentication functions
export const login = async (username: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            return data;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

export const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}) => {
    try {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            return data;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        if (authToken) {
            await fetch(`${API_URL}/auth/logout/`, {
                method: 'POST',
                headers: getHeaders(),
            });
        }
        authToken = null;
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        authToken = null;
    }
};

// Posts functions
export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/posts/`, {
            headers: getHeaders(false), // Posts can be viewed without auth
        });

        if (response.ok) {
            const data = await response.json();
            return data.results || data; // Handle paginated response
        } else {
            throw new Error('Failed to fetch posts');
        }
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        throw error;
    }
};

export const createPost = async (content: string, image?: string) => {
    try {
        const formData = new FormData();
        formData.append('content', content);

        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`${API_URL}/posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`,
                // Don't set Content-Type for FormData
            },
            body: formData,
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        throw error;
    }
};

export const likePost = async (postId: string) => {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/like/`, {
            method: 'POST',
            headers: getHeaders(),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to like post');
        }
    } catch (error) {
        console.error('Ошибка при лайке поста:', error);
        throw error;
    }
};

// Comments functions
export const fetchComments = async (postId: string) => {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/comments/`, {
            headers: getHeaders(false),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch comments');
        }
    } catch (error) {
        console.error('Ошибка при получении комментариев:', error);
        throw error;
    }
};

export const createComment = async (postId: string, content: string) => {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/comments/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to create comment');
        }
    } catch (error) {
        console.error('Ошибка при создании комментария:', error);
        throw error;
    }
};

// User profile functions
export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/profile/`, {
            headers: getHeaders(),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error;
    }
};

// Set auth token (for when app starts and token is loaded from storage)
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Get current auth token
export const getAuthToken = () => authToken;