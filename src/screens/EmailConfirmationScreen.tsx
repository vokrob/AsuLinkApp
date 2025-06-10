import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { checkEmailStatus, resendConfirmation } from '../services/api';

interface EmailConfirmationScreenProps {
    navigation: any;
    route: any;
}

const EmailConfirmationScreen: React.FC<EmailConfirmationScreenProps> = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [emailStatus, setEmailStatus] = useState<any>(null);
    
    // Получаем email из параметров навигации
    const email = route.params?.email || '';
    const username = route.params?.username || '';

    useEffect(() => {
        if (email) {
            checkStatus();
            // Проверяем статус каждые 10 секунд
            const interval = setInterval(checkStatus, 10000);
            return () => clearInterval(interval);
        }
    }, [email]);

    const checkStatus = async () => {
        if (!email) return;
        
        try {
            setIsChecking(true);
            const status = await checkEmailStatus(email);
            setEmailStatus(status);
            
            // Если email подтвержден, переходим на экран входа
            if (status.email_confirmed && status.can_login) {
                Alert.alert(
                    '✅ Email подтвержден!',
                    'Ваш email успешно подтвержден. Теперь вы можете войти в приложение.',
                    [
                        {
                            text: 'Войти',
                            onPress: () => navigation.replace('Login')
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Ошибка проверки статуса:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) return;
        
        try {
            setIsLoading(true);
            await resendConfirmation(email);
            Alert.alert(
                '📧 Письмо отправлено',
                'Новое письмо с подтверждением отправлено на ваш email. Проверьте почту.',
                [{ text: 'OK' }]
            );
        } catch (error: any) {
            Alert.alert(
                'Ошибка',
                error.message || 'Не удалось отправить письмо. Попробуйте позже.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigation.replace('Login');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title1}>АЛТАЙСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ</Text>
                <Text style={styles.title2}>ПОДТВЕРЖДЕНИЕ EMAIL</Text>
            </View>

            <View style={styles.middleContainer}>
                <View style={styles.emailIcon}>
                    <Text style={styles.emailIconText}>📧</Text>
                </View>

                <Text style={styles.mainMessage}>
                    Письмо с подтверждением отправлено!
                </Text>

                <View style={styles.emailInfo}>
                    <Text style={styles.emailLabel}>Email:</Text>
                    <Text style={styles.emailValue}>{email}</Text>
                    {username && (
                        <>
                            <Text style={styles.emailLabel}>Username:</Text>
                            <Text style={styles.emailValue}>{username}</Text>
                        </>
                    )}
                </View>

                <Text style={styles.instructions}>
                    1. Проверьте вашу почту (включая папку "Спам")
                    {'\n'}2. Найдите письмо от AsuLinkApp
                    {'\n'}3. Нажмите на ссылку подтверждения в письме
                    {'\n'}4. Вернитесь в приложение для входа
                </Text>

                {emailStatus && (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusTitle}>Статус:</Text>
                        <Text style={[
                            styles.statusText,
                            emailStatus.email_confirmed ? styles.statusConfirmed : styles.statusPending
                        ]}>
                            {emailStatus.email_confirmed ? '✅ Email подтвержден' : '⏳ Ожидание подтверждения'}
                        </Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.resendButton]}
                        onPress={handleResendEmail}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>📧 Отправить повторно</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.checkButton]}
                        onPress={checkStatus}
                        disabled={isChecking}
                    >
                        {isChecking ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>🔄 Проверить статус</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.backButton]}
                        onPress={handleBackToLogin}
                    >
                        <Text style={styles.buttonText}>← Назад к входу</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.hintText}>
                    Если письмо не приходит в течение нескольких минут, проверьте папку "Спам" 
                    или нажмите "Отправить повторно".
                </Text>
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
        minHeight: 200,
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
    bottomContainer: {
        minHeight: 80,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title1: {
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
        color: '#497fb8',
    },
    title2: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
        color: '#0c54a0',
        fontWeight: 'bold',
    },
    emailIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    emailIconText: {
        fontSize: 40,
    },
    mainMessage: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    emailInfo: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#2465a9',
    },
    emailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    emailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        textAlign: 'left',
        marginBottom: 20,
    },
    statusContainer: {
        backgroundColor: '#e8f5e8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 16,
    },
    statusConfirmed: {
        color: '#2e7d32',
    },
    statusPending: {
        color: '#f57c00',
    },
    buttonContainer: {
        gap: 15,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    resendButton: {
        backgroundColor: '#FF9800',
    },
    checkButton: {
        backgroundColor: '#2196F3',
    },
    backButton: {
        backgroundColor: '#757575',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hintText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
        lineHeight: 16,
    },
});

export default EmailConfirmationScreen;
