// Network utilities for IP address detection and server connection
import { Platform } from 'react-native';

/**
 * Gets list of possible IP addresses for development server connection
 */
export const getPossibleServerIPs = (): string[] => {
    const ips: string[] = [];

    if (Platform.OS === 'web') {
        // Expo Web in browser - localhost only
        ips.push('127.0.0.1');
        ips.push('localhost');
    } else if (Platform.OS === 'android') {
        // For Android Expo emulator: localhost first, then standard emulator
        ips.push('127.0.0.1');  // Expo emulator often works with localhost
        ips.push('localhost');
        ips.push('10.0.2.2');   // Standard Android emulator

        // Common IP addresses in local networks for physical devices
        ips.push('192.168.1.100');
        ips.push('192.168.0.100');
        ips.push('192.168.155.1');
        ips.push('10.0.0.100');
        ips.push('172.16.0.100');
    } else if (Platform.OS === 'ios') {
        // For iOS simulator
        ips.push('127.0.0.1');
        ips.push('localhost');

        // For physical iOS devices
        ips.push('192.168.1.100');
        ips.push('192.168.0.100');
        ips.push('10.0.0.100');
    } else {
        // For other platforms
        ips.push('127.0.0.1');
        ips.push('localhost');
    }

    return ips;
};

/**
 * Создает список URL для тестирования подключения к API
 */
export const getApiTestUrls = (port: number = 8000, apiPath: string = '/api'): string[] => {
    const urls: string[] = [];

    // Для Expo эмулятора приоритет localhost
    if (Platform.OS === 'web' || Platform.OS === 'android') {
        urls.push(`http://127.0.0.1:${port}${apiPath}`);
        urls.push(`http://localhost:${port}${apiPath}`);
    }

    // Добавляем ваш реальный IP для физических устройств
    urls.push('http://192.168.1.73:8000/api');

    // Добавляем остальные локальные IP адреса
    const ips = getPossibleServerIPs();
    urls.push(...ips.map(ip => `http://${ip}:${port}${apiPath}`));

    // ngrok только как резерв (если нужен доступ из интернета)
    // urls.push('https://your-ngrok-url.ngrok-free.app/api');

    return [...new Set(urls)]; // Убираем дубликаты
};

/**
 * Тестирует подключение к указанному URL
 */
export const testUrlConnection = async (url: string, timeout: number = 5000): Promise<{
    success: boolean;
    status?: number;
    data?: any;
    error?: string;
}> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                status: response.status,
                data
            };
        } else {
            return {
                success: false,
                status: response.status,
                error: `HTTP ${response.status}`
            };
        }
    } catch (error: any) {
        const errorType = error.name === 'AbortError' ? 'Timeout' : (error.name || 'NetworkError');
        return {
            success: false,
            error: errorType
        };
    }
};

/**
 * Находит первый рабочий URL из списка
 */
export const findWorkingApiUrl = async (
    urls: string[], 
    timeout: number = 5000
): Promise<{
    success: boolean;
    workingUrl?: string;
    testedUrls: Array<{ url: string; result: any }>;
}> => {
    const testedUrls: Array<{ url: string; result: any }> = [];
    
    console.log(`Тестирование ${urls.length} URL...`);

    for (const url of urls) {
        console.log(`   Проверяю: ${url}`);
        const result = await testUrlConnection(url, timeout);
        testedUrls.push({ url, result });

        if (result.success) {
            console.log(`   Найден рабочий URL: ${url}`);
            return {
                success: true,
                workingUrl: url,
                testedUrls
            };
        } else {
            console.log(`   ${url}: ${result.error}`);
        }
    }

    console.log('Ни один URL не работает');
    return {
        success: false,
        testedUrls
    };
};

/**
 * Получает инструкции по настройке сети для физических устройств
 */
export const getNetworkSetupInstructions = (): string[] => {
    return [
        '🔧 НАСТРОЙКА ДЛЯ ФИЗИЧЕСКОГО УСТРОЙСТВА:',
        '',
        '🌐 ВАРИАНТ 1: ngrok (рекомендуется):',
        '1. Запустите Django: python manage.py runserver 0.0.0.0:8000',
        '2. Запустите ngrok: ngrok http 8000',
        '3. Используйте ngrok URL в приложении',
        '',
        '🏠 ВАРИАНТ 2: Локальная сеть:',
        '1. Запустите Django сервер:',
        '   python manage.py runserver 0.0.0.0:8000',
        '',
        '2. Убедитесь, что компьютер и телефон в одной Wi-Fi сети',
        '',
        '3. Узнайте IP адрес компьютера:',
        '   Windows: ipconfig',
        '   Mac/Linux: ifconfig',
        '',
        '4. Отключите Windows Firewall или добавьте исключение для порта 8000',
        '',
        '5. Проверьте доступность через браузер телефона:',
        '   http://[IP-адрес]:8000/api/',
        '',
        '6. Если не работает, попробуйте:',
        '   - Перезапустить Wi-Fi на телефоне',
        '   - Использовать мобильную точку доступа',
        '   - Проверить настройки роутера',
    ];
};
