import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TextInput,
} from 'react-native';
import { verifyEmailCode, resendConfirmation, setAuthToken } from '../services/api';
import { saveData, KEYS } from '../utils/storage';

interface CodeVerificationScreenProps {
    navigation: any;
    route: any;
}

const CodeVerificationScreen: React.FC<CodeVerificationScreenProps> = ({ navigation, route }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 минут в секундах
    
    // Получаем параметры из навигации
    const email = route.params?.email || '';
    const username = route.params?.username || '';
    const nextStep = route.params?.next_step || 'enter_code';
    
    // Refs для полей ввода
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        // Таймер обратного отсчета
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCodeChange = (value: string, index: number) => {
        // Разрешаем только цифры
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Автоматический переход к следующему полю
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Автоматическая отправка при заполнении всех полей
        if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
            handleVerifyCode(newCode.join(''));
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        // Обработка Backspace
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyCode = async (codeToVerify?: string) => {
        const verificationCode = codeToVerify || code.join('');
        
        if (verificationCode.length !== 6) {
            Alert.alert('Ошибка', 'Введите полный 6-значный код');
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔍 Проверка кода:', verificationCode);
            const response = await verifyEmailCode(email, verificationCode);
            
            console.log('✅ Код подтвержден:', response);

            // Сохраняем токен и данные пользователя если они есть
            if (response.token) {
                setAuthToken(response.token);

                // Сохраняем токен в хранилище
                console.log('💾 Saving auth token...');
                const tokenSaved = await saveData(KEYS.AUTH_TOKEN, response.token);
                if (!tokenSaved) {
                    console.warn('⚠️ Failed to save token to storage');
                }

                // Сохраняем данные пользователя если они есть
                if (response.user) {
                    console.log('💾 Saving user profile...');
                    const profileSaved = await saveData(KEYS.USER_PROFILE, response.user);
                    if (!profileSaved) {
                        console.warn('⚠️ Failed to save user profile to storage');
                    }
                }
            }

            // Автоматически переходим на экран заполнения профиля или в главное приложение
            if (response.token) {
                // Если есть токен, переходим на заполнение профиля
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'ProfileSetup',
                        params: {
                            email: email,
                            username: username,
                            token: response.token
                        }
                    }],
                });
            } else {
                // Если токена нет, возвращаемся на экран входа
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }

        } catch (error: any) {
            console.error('❌ Ошибка проверки кода:', error);
            
            let errorMessage = 'Ошибка при проверке кода';
            if (error.message.includes('Неверный код')) {
                errorMessage = error.message;
                // Очищаем поля при неверном коде
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else if (error.message.includes('превышено')) {
                errorMessage = error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Ошибка', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await resendConfirmation(email);
            setTimeLeft(15 * 60); // Сбрасываем таймер
            setCode(['', '', '', '', '', '']); // Очищаем поля
            inputRefs.current[0]?.focus();
            
            Alert.alert(
                'Код отправлен!',
                'Новый код подтверждения отправлен на ваш email.'
            );
        } catch (error: any) {
            Alert.alert('Ошибка', error.message || 'Не удалось отправить код повторно');
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title1}>АЛТАЙСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ</Text>
                <Text style={styles.title2}>ПОДТВЕРЖДЕНИЕ КОДА</Text>
            </View>

            <View style={styles.middleContainer}>
                <Text style={styles.mainMessage}>
                    Введите код подтверждения
                </Text>

                <Text style={styles.instructions}>
                    Проверьте вашу почту и введите 6-значный код подтверждения
                </Text>

                {/* Поля ввода кода */}
                <View style={styles.codeInputContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.codeInput,
                                digit ? styles.codeInputFilled : null
                            ]}
                            value={digit}
                            onChangeText={(value) => handleCodeChange(value, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            textAlign="center"
                            editable={!isLoading}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {/* Таймер */}
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                        {timeLeft > 0 
                            ? `Код действителен: ${formatTime(timeLeft)}`
                            : 'Код истек'
                        }
                    </Text>
                </View>

                {/* Кнопки */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.verifyButton]}
                        onPress={() => handleVerifyCode()}
                        disabled={isLoading || code.join('').length !== 6}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Подтвердить код</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.resendButton]}
                        onPress={handleResendCode}
                        disabled={isResending || timeLeft > 14 * 60} // Можно отправить повторно только через минуту
                    >
                        {isResending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Отправить повторно</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.backButton]}
                        onPress={handleBackToLogin}
                    >
                        <Text style={styles.buttonText}>Назад к входу</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    topContainer: {
        minHeight: 250,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 10,
        alignSelf: 'center',
    },
    title1: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
        color: '#497fb8',
    },
    title2: {
        fontSize: 22,
        marginBottom: 8,
        textAlign: 'center',
        color: '#0c54a0',
        fontWeight: 'bold',
    },

    mainMessage: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },

    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
        lineHeight: 22,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    codeInput: {
        width: 45,
        height: 55,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#fff',
    },
    codeInputFilled: {
        borderColor: '#0c54a0',
        backgroundColor: '#f0f8ff',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    timerText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    buttonContainer: {
        gap: 15,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 50,
        justifyContent: 'center',
    },
    verifyButton: {
        backgroundColor: '#28a745',
    },
    resendButton: {
        backgroundColor: '#007bff',
    },
    backButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CodeVerificationScreen;
