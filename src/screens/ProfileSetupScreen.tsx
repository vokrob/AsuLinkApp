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
    TextInput,
} from 'react-native';
import { saveData, KEYS } from '../utils/storage';
import { checkUserRole } from '../services/api';

interface ProfileSetupScreenProps {
    navigation: any;
    route: any;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation, route }) => {
    // Общие поля
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');

    // Поля для студентов
    const [faculty, setFaculty] = useState('');
    const [group, setGroup] = useState('');

    // Поля для преподавателей
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');

    // Состояние
    const [userRole, setUserRole] = useState<'student' | 'professor' | 'admin' | null>(null);
    const [roleDisplay, setRoleDisplay] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);

    // Получаем данные из предыдущего экрана
    const email = route.params?.email || '';
    const username = route.params?.username || '';
    const token = route.params?.token || '';

    // Validation state
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isButtonActive, setIsButtonActive] = useState(false);

    // Определение роли при монтировании компонента
    useEffect(() => {
        const loadUserRole = async () => {
            setIsLoadingUserData(true);

            try {
                const roleData = await checkUserRole(email);

                setUserRole(roleData.role);
                setRoleDisplay(roleData.role_display);

                console.log(`👤 Определена роль для ${email}: ${roleData.role_display}`);
            } catch (error: any) {
                console.error('❌ Ошибка определения роли:', error.message);
                // Устанавливаем роль студента по умолчанию
                setUserRole('student');
                setRoleDisplay('Студент');
                Alert.alert('Предупреждение', 'Не удалось определить роль. Установлена роль "Студент".');
            } finally {
                setIsLoadingUserData(false);
            }
        };

        if (email) {
            loadUserRole();
        } else {
            setIsLoadingUserData(false);
        }
    }, [email]);

    // Validation effect
    useEffect(() => {
        let isValid = firstName.trim().length > 0 &&
                     lastName.trim().length > 0 &&
                     middleName.trim().length > 0;

        if (userRole === 'student') {
            isValid = isValid && faculty.trim().length > 0 && group.trim().length > 0;
        } else if (userRole === 'professor') {
            isValid = isValid && department.trim().length > 0 && position.trim().length > 0;
        }

        setIsButtonActive(isValid);
    }, [firstName, lastName, middleName, faculty, group, department, position, userRole]);

    // Form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        // Общие поля
        if (!firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = 'Имя должно содержать минимум 2 символа';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        } else if (lastName.trim().length < 2) {
            newErrors.lastName = 'Фамилия должна содержать минимум 2 символа';
        }

        if (!middleName.trim()) {
            newErrors.middleName = 'Отчество обязательно';
        } else if (middleName.trim().length < 2) {
            newErrors.middleName = 'Отчество должно содержать минимум 2 символа';
        }

        // Валидация для студентов
        if (userRole === 'student') {
            if (!faculty.trim()) {
                newErrors.faculty = 'Факультет обязателен';
            } else if (faculty.trim().length < 2) {
                newErrors.faculty = 'Факультет должен содержать минимум 2 символа';
            }

            if (!group.trim()) {
                newErrors.group = 'Группа обязательна';
            } else if (group.trim().length < 2) {
                newErrors.group = 'Группа должна содержать минимум 2 символа';
            }
        }

        // Валидация для преподавателей
        if (userRole === 'professor') {
            if (!department.trim()) {
                newErrors.department = 'Кафедра обязательна';
            } else if (department.trim().length < 2) {
                newErrors.department = 'Кафедра должна содержать минимум 2 символа';
            }

            if (!position.trim()) {
                newErrors.position = 'Должность обязательна';
            } else if (position.trim().length < 2) {
                newErrors.position = 'Должность должна содержать минимум 2 символа';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const profileData: any = {
                id: '1',
                name: `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`,
                avatar: require('../../assets/Avatar.jpg'),
                email: email,
                role: userRole || 'student',
                username: username,
            };

            // Добавляем поля в зависимости от роли
            if (userRole === 'student') {
                profileData.faculty = faculty.trim();
                profileData.group = group.trim();
            } else if (userRole === 'professor') {
                profileData.department = department.trim();
                profileData.position = position.trim();
            }

            // Сохраняем профиль локально
            console.log('💾 Saving profile data...');
            console.log(`👤 Роль: ${userRole} (${roleDisplay})`);
            const profileSaved = await saveData(KEYS.USER_PROFILE, profileData);
            if (!profileSaved) {
                console.warn('⚠️ Failed to save profile to storage');
            }

            // Переходим в главное приложение
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });

        } catch (error: any) {
            Alert.alert('Ошибка', error.message || 'Не удалось сохранить профиль');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Пропустить заполнение?',
            'Вы можете заполнить профиль позже в настройках приложения.',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Пропустить',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        });
                    }
                }
            ]
        );
    };

    if (isLoadingUserData) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0c54a0" />
                <Text style={styles.loadingText}>Загрузка данных пользователя...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title1}>АЛТАЙСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ</Text>
                <Text style={styles.title2}>ЗАПОЛНЕНИЕ ПРОФИЛЯ</Text>
                <Text style={styles.title3}>ПРЕПОДАВАТЕЛЯ И СТУДЕНТА</Text>
            </View>

            <View style={styles.middleContainer}>
                <Text style={styles.welcomeMessage}>
                    Добро пожаловать в AsuLinkApp!
                </Text>

                {roleDisplay && (
                    <Text style={styles.roleInfo}>
                        Ваша роль: {roleDisplay}
                    </Text>
                )}

                <Text style={styles.instructions}>
                    Заполните основную информацию профиля для завершения регистрации
                </Text>

                {/* Общие поля */}
                <TextInput
                    placeholder="Фамилия"
                    value={lastName}
                    onChangeText={setLastName}
                    style={[styles.input, errors.lastName && styles.inputError]}
                    editable={!isLoading}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                <TextInput
                    placeholder="Имя"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={[styles.input, errors.firstName && styles.inputError]}
                    editable={!isLoading}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                <TextInput
                    placeholder="Отчество"
                    value={middleName}
                    onChangeText={setMiddleName}
                    style={[styles.input, errors.middleName && styles.inputError]}
                    editable={!isLoading}
                />
                {errors.middleName && <Text style={styles.errorText}>{errors.middleName}</Text>}

                {/* Поля для студентов */}
                {userRole === 'student' && (
                    <>
                        <TextInput
                            placeholder="Факультет"
                            value={faculty}
                            onChangeText={setFaculty}
                            style={[styles.input, errors.faculty && styles.inputError]}
                            editable={!isLoading}
                        />
                        {errors.faculty && <Text style={styles.errorText}>{errors.faculty}</Text>}

                        <TextInput
                            placeholder="Группа"
                            value={group}
                            onChangeText={setGroup}
                            style={[styles.input, errors.group && styles.inputError]}
                            editable={!isLoading}
                        />
                        {errors.group && <Text style={styles.errorText}>{errors.group}</Text>}
                    </>
                )}

                {/* Поля для преподавателей */}
                {userRole === 'professor' && (
                    <>
                        <TextInput
                            placeholder="Кафедра"
                            value={department}
                            onChangeText={setDepartment}
                            style={[styles.input, errors.department && styles.inputError]}
                            editable={!isLoading}
                        />
                        {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

                        <TextInput
                            placeholder="Должность"
                            value={position}
                            onChangeText={setPosition}
                            style={[styles.input, errors.position && styles.inputError]}
                            editable={!isLoading}
                        />
                        {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}
                    </>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.saveButton,
                            { backgroundColor: isButtonActive && !isLoading ? '#28a745' : '#BBBBBB' }
                        ]}
                        onPress={handleSaveProfile}
                        disabled={!isButtonActive || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Сохранить и продолжить</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.skipButton]}
                        onPress={handleSkip}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>Пропустить</Text>
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
        flex: 0.7,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logo: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
        marginBottom: 12,
        alignSelf: 'center',
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
    title3: {
        fontSize: 15,
        marginBottom: 0,
        textAlign: 'center',
        color: '#0c54a0',
    },
    welcomeMessage: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    roleInfo: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
        color: '#0c54a0',
        backgroundColor: '#e6f2ff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
        lineHeight: 22,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
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
    buttonContainer: {
        marginTop: 20,
        gap: 15,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 50,
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    skipButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileSetupScreen;
