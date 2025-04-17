import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import CheckBox, { Checkbox } from 'expo-checkbox';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(
        () => { setIsButtonActive(username.length > 0 && password.length > 0); },
        [username, password]
    );

    const handleLogin = () => {
        if (username === 'borkov.43052' && password === '12345') {
            navigation.replace('Feed');
        } else {
            Alert.alert('Ошибка', 'Неправильное имя пользователя или пароль');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('восстановить пароль', 'Функция в разработке');
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title1}>АЛТАЙСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ</Text>
                <Text style={styles.title2}>ВХОД В ЛИЧНЫЙ КАБИНЕТ</Text>
                <Text style={styles.title3}>ПРЕПОДАВАТЕЛЯ И СТУДЕНТА</Text>
            </View>

            <View style={styles.middleContainer}>
                <TextInput
                    placeholder="имя пользователя"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <View style={styles.rememberMeContainer}>
                    <Checkbox
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        style={styles.checkbox}
                        color="#0c54a0"
                    />
                    <Text>запомнить меня</Text>
                </View>
                <TouchableOpacity
                    style={
                        [
                            styles.button,
                            { backgroundColor: isButtonActive ? '#2465a9' : '#BBBBBB' }
                        ]
                    }
                    onPress={handleLogin}
                    disabled={!isButtonActive}
                >
                    <Text style={styles.buttonText}>войти в систему</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>восстановить пароль</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.hintText}>
                    Имя пользователя может быть в виде логин, домен\логин или login@domain.asu.ru.{'\n'}
                    Для студентов используется домен STUD.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        topContainer: {
            height: 250,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 50
        },
        middleContainer: {
            height: 500,
            justifyContent: 'center',
            paddingHorizontal: 20
        },
        bottomContainer: {
            height: 125,
            justifyContent: 'flex-end',
            paddingHorizontal: 50,
            paddingBottom: 50
        },
        logo: {
            width: 150,
            height: 150,
            resizeMode: 'contain',
            marginBottom: 10,
            alignSelf: 'center',
        },
        title1: {
            fontSize: 14,
            marginBottom: 10,
            textAlign: 'center',
            color: '#497fb8',
        },
        title2: {
            fontSize: 26,
            marginBottom: 10,
            textAlign: 'center',
            color: '#0c54a0',
        },
        title3: {
            fontSize: 20,
            marginBottom: 50,
            textAlign: 'center',
            color: '#0c54a0',
        },
        input: {
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 15,
            marginVertical: 10,
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
            marginTop: 10
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold'
        },
        forgotPasswordText: {
            color: '#0c54a0',
            marginTop: 10,
            textAlign: 'center'
        },
        hintText: {
            fontSize: 12,
            color: 'gray',
            textAlign: 'center',
            marginTop: 20
        }
    }
);

export default LoginScreen;