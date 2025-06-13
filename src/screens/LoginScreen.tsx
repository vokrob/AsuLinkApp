import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { login, register, setAuthToken } from '../services/api';
import { saveData, loadData, KEYS } from '../utils/storage';

const LoginScreen = ({ navigation }: any) => {
    // Mode state
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Login form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Registration form state
    const [email, setEmail] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validation state
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isButtonActive, setIsButtonActive] = useState(false);

    // Validation effect for login mode
    useEffect(() => {
        if (isLoginMode) {
            setIsButtonActive(username.length > 0 && password.length > 0);
        } else {
            // Registration validation
            const isValid = email.length > 0 &&
                           regUsername.length > 0 &&
                           regPassword.length > 0 &&
                           confirmPassword.length > 0 &&
                           regPassword === confirmPassword &&
                           validateEmail(email);
            setIsButtonActive(isValid);
        }
    }, [isLoginMode, username, password, email, regUsername, regPassword, confirmPassword]);

    // Email validation helper
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!isLoginMode) {
            if (!email) {
                newErrors.email = 'Email обязателен';
            } else if (!validateEmail(email)) {
                newErrors.email = 'Неверный формат email';
            }

            if (!regUsername) {
                newErrors.regUsername = 'Имя пользователя обязательно';
            } else if (regUsername.length < 3) {
                newErrors.regUsername = 'Имя пользователя должно содержать минимум 3 символа';
            }

            if (!regPassword) {
                newErrors.regPassword = 'Пароль обязателен';
            } else if (regPassword.length < 6) {
                newErrors.regPassword = 'Пароль должен содержать минимум 6 символов';
            }

            if (!confirmPassword) {
                newErrors.confirmPassword = 'Подтверждение пароля обязательно';
            } else if (regPassword !== confirmPassword) {
                newErrors.confirmPassword = 'Пароли не совпадают';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await login(username, password);

            // Save token to storage
            console.log('💾 Saving auth token...');
            const tokenSaved = await saveData(KEYS.AUTH_TOKEN, response.token);
            if (!tokenSaved) {
                console.warn('⚠️ Failed to save token to storage');
            }
            setAuthToken(response.token);

            // Проверяем, есть ли уже сохраненный профиль
            const existingProfile = await loadData(KEYS.USER_PROFILE, null);

            if (!existingProfile) {
                // Сохраняем профиль только если его еще нет
                console.log('💾 Saving user profile (first time)...');
                const profileSaved = await saveData(KEYS.USER_PROFILE, response.user);
                if (!profileSaved) {
                    console.warn('⚠️ Failed to save user profile to storage');
                }
            } else {
                console.log('ℹ️ Profile already exists, keeping existing data');
            }

            // Автоматически переходим в главное приложение без сообщения
            navigation.replace('Main');

        } catch (error: any) {
            Alert.alert('Ошибка входа', error.message || 'Неправильное имя пользователя или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const userData = {
                username: regUsername,
                email: email,
                password: regPassword
            };

            const response = await register(userData);

            console.log('📧 Ответ сервера:', response);

            // Проверяем, что регистрация прошла успешно и требуется подтверждение кода
            if (response.verification_code_sent || response.email_confirmation_sent || response.requires_verification) {
                // Автоматически переходим на страницу подтверждения кода без показа сообщения
                navigation.navigate('CodeVerification', {
                    email: email,
                    username: regUsername,
                    next_step: response.next_step || 'enter_code'
                });
            } else {
                // Fallback для старого формата
                Alert.alert(
                    'Регистрация завершена!',
                    response.message || 'Проверьте вашу почту для подтверждения email.',
                    [{ text: 'OK' }]
                );
            }

        } catch (error: any) {
            let errorMessage = 'Ошибка при регистрации';
            let showCodeOption = false;

            if (error.message.includes('Network request failed')) {
                errorMessage = 'Ошибка сети: Не удается подключиться к серверу. Проверьте подключение к интернету.';
            } else if (error.message.includes('уже существует')) {
                errorMessage = error.message;
            } else if (error.message.includes('Таймаут при регистрации') ||
                       error.message.includes('регистрация прошла успешно')) {
                errorMessage = error.message;
                showCodeOption = true;
            } else if (error.message) {
                errorMessage = error.message;
            }

            const alertButtons = [{ text: 'OK' }];

            if (showCodeOption) {
                // Автоматически переходим на страницу подтверждения кода
                navigation.navigate('CodeVerification', {
                    email: email,
                    username: regUsername,
                    next_step: 'enter_code'
                });
                return; // Выходим из функции, не показывая Alert
            }

            Alert.alert('Ошибка регистрации', errorMessage, alertButtons);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Восстановить пароль', 'Функция в разработке');
    };



    const renderLoginForm = () => (
        <>
            <TextInput
                placeholder="имя пользователя"
                value={username}
                onChangeText={setUsername}
                style={[styles.input, errors.username && styles.inputError]}
                autoCapitalize="none"
                editable={!isLoading}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
                placeholder="пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, errors.password && styles.inputError]}
                editable={!isLoading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.rememberMeContainer}>
                <Checkbox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    style={styles.checkbox}
                    color="#0c54a0"
                    disabled={isLoading}
                />
                <Text>запомнить меня</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: isButtonActive && !isLoading ? '#2465a9' : '#BBBBBB' }
                ]}
                onPress={handleLogin}
                disabled={!isButtonActive || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>войти в систему</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>восстановить пароль</Text>
            </TouchableOpacity>
        </>
    );

    const renderRegistrationForm = () => (
        <>
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, errors.email && styles.inputError]}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                placeholder="имя пользователя"
                value={regUsername}
                onChangeText={setRegUsername}
                style={[styles.input, errors.regUsername && styles.inputError]}
                autoCapitalize="none"
                editable={!isLoading}
            />
            {errors.regUsername && <Text style={styles.errorText}>{errors.regUsername}</Text>}

            <TextInput
                placeholder="пароль"
                value={regPassword}
                onChangeText={setRegPassword}
                secureTextEntry
                style={[styles.input, errors.regPassword && styles.inputError]}
                editable={!isLoading}
            />
            {errors.regPassword && <Text style={styles.errorText}>{errors.regPassword}</Text>}

            <TextInput
                placeholder="подтвердите пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                editable={!isLoading}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: isButtonActive && !isLoading ? '#2465a9' : '#BBBBBB' }
                ]}
                onPress={handleRegister}
                disabled={!isButtonActive || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>зарегистрироваться</Text>
                )}
            </TouchableOpacity>
        </>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title1}>АЛТАЙСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ</Text>
                <Text style={styles.title2}>
                    {isLoginMode ? 'ВХОД В ЛИЧНЫЙ КАБИНЕТ' : 'РЕГИСТРАЦИЯ'}
                </Text>
                <Text style={styles.title3}>ПРЕПОДАВАТЕЛЯ И СТУДЕНТА</Text>
            </View>

            <View style={styles.middleContainer}>
                {/* Mode Toggle */}
                <View style={styles.modeToggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.modeToggleButton,
                            isLoginMode && styles.modeToggleButtonActive
                        ]}
                        onPress={() => setIsLoginMode(true)}
                        disabled={isLoading}
                    >
                        <Text style={[
                            styles.modeToggleText,
                            isLoginMode && styles.modeToggleTextActive
                        ]}>Вход</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.modeToggleButton,
                            !isLoginMode && styles.modeToggleButtonActive
                        ]}
                        onPress={() => setIsLoginMode(false)}
                        disabled={isLoading}
                    >
                        <Text style={[
                            styles.modeToggleText,
                            !isLoginMode && styles.modeToggleTextActive
                        ]}>Регистрация</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Content */}
                {isLoginMode ? renderLoginForm() : renderRegistrationForm()}
            </View>

            {!isLoginMode && (
                <View style={styles.bottomContainer}>
                    <Text style={styles.hintText}>
                        После регистрации на ваш email будет отправлено письмо с кодом подтверждения.
                    </Text>
                </View>
            )}

            {isLoginMode && (
                <View style={styles.bottomContainer}>
                    <Text style={styles.hintText}>
                        Для восстановления пароля нажмите "восстановить пароль". На ваш email будет отправлена ссылка для сброса пароля.
                    </Text>
                </View>
            )}

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
        justifyContent: 'space-between',
    },
    topContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    middleContainer: {
        flex: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    bottomContainer: {
        flex: 0.2,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    logo: {
        width: 130,
        height: 130,
        resizeMode: 'contain',
        marginBottom: 15,
        alignSelf: 'center',
    },
    title1: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
        color: '#497fb8',
    },
    title2: {
        fontSize: 21,
        marginBottom: 8,
        textAlign: 'center',
        color: '#0c54a0',
        fontWeight: 'bold',
    },
    title3: {
        fontSize: 16,
        marginBottom: 0,
        textAlign: 'center',
        color: '#0c54a0',
    },
    modeToggleContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        padding: 2,
    },
    modeToggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    modeToggleButtonActive: {
        backgroundColor: '#0c54a0',
    },
    modeToggleText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    modeToggleTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 8,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff4444',
        borderWidth: 2,
    },

    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: -5,
        marginBottom: 10,
        marginLeft: 5,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        margin: 8,
    },
    button: {
        backgroundColor: '#2465a9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        minHeight: 50,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: '#0c54a0',
        marginTop: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    hintText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
        lineHeight: 16,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
});

export default LoginScreen;