const API_URL = 'https://your-backend-url.com/api';

export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
    }
};