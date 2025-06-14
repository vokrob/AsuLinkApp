// API service for AsuLinkApp - Works on physical devices and emulators
import { Platform } from 'react-native';

// Simplified API URL configuration - single working address
const API_URL = 'http://192.168.1.73:8000/api';
export const API_BASE_URL = API_URL;

console.log(`🔗 API URL for ${Platform.OS}: ${API_URL}`);

// Token storage
let authToken: string | null = null;

// Request headers
const getHeaders = (includeAuth: boolean = true) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth && authToken) {
        headers['Authorization'] = `Token ${authToken}`;
    }

    return headers;
};

// Login function
export const login = async (username: string, password: string) => {
    try {
        console.log('🔗 Login attempt for user:', username);

        const result = await makeApiRequest('/auth/login/', {
            method: 'POST',
            body: { username, password }
        });

        if (result.success) {
            authToken = result.data.token;
            console.log('✅ Login successful');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Login error';
            console.error('❌ Login error:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Critical login error:', error.message);
        throw new Error(error.message || 'Failed to login. Check credentials and connection.');
    }
};

// МОБИЛЬНАЯ регистрация с кодом (3 шага)
export const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}) => {
    try {
        console.log('🔗 Мобильная регистрация - отправка кода');
        console.log('📝 Email:', userData.email);

        // Шаг 1: Отправляем код на email
        const result = await makeApiRequest('/auth/register/', {
            method: 'POST',
            body: userData
        });

        if (result.success) {
            console.log('✅ Код отправлен на email');
            return {
                ...result.data,
                step: 'verify_code',
                userData: userData // Сохраняем данные для следующего шага
            };
        } else {
            const errorMessage = result.data?.error || 'Ошибка отправки кода';
            console.error('❌ Ошибка отправки кода:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при регистрации:', error.message);

        // Специальная обработка таймаута при регистрации
        if (error.message && error.message.includes('Таймаут при регистрации')) {
            throw new Error('Возможно, регистрация прошла успешно, но ответ не дошел из-за медленного соединения. Проверьте почту - если код пришел, введите его.');
        }

        throw new Error(error.message || 'Не удалось отправить код. Проверьте соединение с сервером.');
    }
};

// Функция проверки статуса email
export const checkEmailStatus = async (email: string) => {
    try {
        console.log('🔍 Проверка статуса email:', email);

        const result = await makeApiRequest(`/auth/check-email-status/?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });

        if (result.success) {
            console.log('✅ Статус email получен');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка проверки статуса';
            console.error('❌ Ошибка проверки статуса:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при проверке статуса:', error.message);
        throw new Error(error.message || 'Не удалось проверить статус email.');
    }
};

// Функция повторной отправки письма с подтверждением
export const resendConfirmation = async (email: string) => {
    try {
        console.log('📧 Повторная отправка подтверждения на:', email);

        const result = await makeApiRequest('/auth/resend-confirmation/', {
            method: 'POST',
            body: { email }
        });

        if (result.success) {
            console.log('✅ Письмо с подтверждением отправлено повторно');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка отправки письма';
            console.error('❌ Ошибка отправки письма:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при отправке письма:', error.message);
        throw new Error(error.message || 'Не удалось отправить письмо с подтверждением.');
    }
};

// Новые функции для 3-шагового процесса регистрации

// Упрощенная функция для выполнения запросов к единственному серверу
const makeApiRequest = async (endpoint: string, options: any = {}) => {
    const { method = 'GET', body, headers = {} } = options;

    // Стандартные заголовки
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
    };

    try {
        const url = `${API_URL}${endpoint}`;
        console.log(`🔗 Запрос: ${method} ${url}`);

        const controller = new AbortController();
        // Увеличиваем таймаут для регистрации (отправка email может занять время)
        const timeoutDuration = endpoint.includes('/auth/register/') ? 30000 : 15000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

        const response = await fetch(url, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log(`📡 Ответ: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Успешный запрос`);
            return { success: true, data, status: response.status };
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.log(`⚠️  Ошибка ${response.status}: ${JSON.stringify(errorData)}`);
            return { success: false, data: errorData, status: response.status };
        }
    } catch (error: any) {
        const errorType = error.name === 'AbortError' ? 'Timeout' : (error.message || error.name);
        console.log(`❌ Ошибка запроса: ${errorType}`);

        // Специальная обработка таймаута при регистрации
        if (error.name === 'AbortError' && endpoint.includes('/auth/register/')) {
            throw new Error('Таймаут при регистрации. Если код пришел на почту, попробуйте ввести его.');
        }

        throw new Error(`Не удалось подключиться к серверу: ${errorType}`);
    }
};

// УПРОЩЕННАЯ функция отправки кода на email
export const sendEmailCode = async (email: string) => {
    try {
        console.log('📧 Отправка кода верификации на email:', email);

        const result = await makeApiRequest('/auth/send-code/', {
            method: 'POST',
            body: { email }
        });

        if (result.success) {
            console.log('✅ Код успешно отправлен на email');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка отправки кода';
            console.error('❌ Ошибка отправки кода:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при отправке кода:', error.message);
        throw new Error(error.message || 'Не удалось отправить код. Проверьте соединение с сервером.');
    }
};

// Функция проверки кода для Django Allauth регистрации
export const verifyEmailCode = async (email: string, code: string) => {
    try {
        console.log('🔍 Проверка кода верификации для Django Allauth:', code);

        const result = await makeApiRequest('/auth/verify-code/', {
            method: 'POST',
            body: { email, code }
        });

        if (result.success) {
            console.log('✅ Код успешно подтвержден');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Неверный код верификации';
            console.error('❌ Ошибка проверки кода:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при проверке кода:', error.message);
        throw new Error(error.message || 'Не удалось проверить код. Попробуйте еще раз.');
    }
};

// Получение информации о текущем пользователе
export const getCurrentUser = async () => {
    try {
        console.log('👤 Получение информации о текущем пользователе');

        const result = await makeApiRequest('/auth/me/', {
            method: 'GET'
        });

        if (result.success) {
            console.log('✅ Информация о пользователе получена');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка получения данных пользователя';
            console.error('❌ Ошибка получения данных пользователя:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка получения данных пользователя:', error.message);
        throw new Error(error.message || 'Не удалось получить данные пользователя');
    }
};

// Проверка роли пользователя по email
export const checkUserRole = async (email: string) => {
    try {
        console.log('🔍 Проверка роли пользователя для email:', email);

        const result = await makeApiRequest('/auth/check-role/', {
            method: 'POST',
            body: { email }
        });

        if (result.success) {
            console.log('✅ Роль пользователя определена:', result.data.role_display);
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка определения роли';
            console.error('❌ Ошибка определения роли:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка определения роли:', error.message);
        throw new Error(error.message || 'Не удалось определить роль пользователя');
    }
};

// УПРОЩЕННАЯ функция завершения регистрации
export const completeProfile = async (profileData: {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
}) => {
    try {
        console.log('👤 Завершение регистрации для:', profileData.username);

        const result = await makeApiRequest('/auth/complete-profile/', {
            method: 'POST',
            body: profileData
        });

        if (result.success) {
            authToken = result.data.token;
            console.log('✅ Регистрация успешно завершена');
            console.log('🔑 Токен получен');
            return result.data;
        } else {
            const errorMessage = result.data?.error || 'Ошибка завершения регистрации';
            console.error('❌ Ошибка завершения регистрации:', errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('❌ Критическая ошибка при завершении регистрации:', error.message);
        throw new Error(error.message || 'Не удалось завершить регистрацию. Попробуйте еще раз.');
    }
};

// Функция выхода
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

// Функция получения постов
export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/posts/`, {
            headers: getHeaders(false),
        });

        if (response.ok) {
            const data = await response.json();
            return data.results || data;
        } else {
            throw new Error('Ошибка получения постов');
        }
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        throw error;
    }
};

// Установка токена
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Получение токена
export const getAuthToken = () => authToken;

// Упрощенная функция тестирования соединения
export const testConnection = async () => {
    console.log('🔍 Тестирование соединения с сервером...');
    console.log(`🔗 URL: ${API_URL}`);

    try {
        const result = await makeApiRequest('/', { method: 'GET' });

        if (result.success) {
            console.log('✅ Соединение с сервером установлено!');
            return { success: true, url: API_URL };
        } else {
            console.log('❌ Сервер не отвечает');
            return { success: false, url: null };
        }
    } catch (error: any) {
        console.error('❌ Ошибка подключения:', error.message);
        return { success: false, url: null };
    }
};