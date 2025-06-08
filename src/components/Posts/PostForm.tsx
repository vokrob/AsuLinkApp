import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';

interface PostFormProps {
  onSubmit: (content: string, imageUri?: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const { theme } = useTheme();
  const [newsText, setNewsText] = useState('');
  const [pickedImage, setPickedImage] = useState<string | undefined>();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Нет доступа к галерее!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length)
      setPickedImage(result.assets[0].uri);
  };

  const handleAddPost = () => {
    if (!newsText.trim() && !pickedImage) {
      Alert.alert('Пожалуйста, добавьте текст или фотографию.');
      return;
    }

    onSubmit(newsText, pickedImage);
    setNewsText('');
    setPickedImage(undefined);
  };

  return (
    <View style={[styles.formContainer, {
      backgroundColor: theme.card
    }]}>
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.background,
          color: theme.text,
          borderColor: theme.border
        }]}
        placeholder="Напишите новость..."
        placeholderTextColor={theme.placeholderText}
        value={newsText}
        onChangeText={setNewsText}
        multiline
      />
      <View style={styles.imageRow}>
        <TouchableOpacity
          style={[styles.imagePickerButton, {
            backgroundColor: theme.primary + '20'
          }]}
          onPress={pickImage}
        >
          <AntDesign name="picture" size={24} color={theme.primary} />
          <Text style={{ marginLeft: 5, color: theme.primary }}>Фото</Text>
        </TouchableOpacity>
        {pickedImage && (
          <Image source={{ uri: pickedImage }} style={[styles.miniImage, {
            backgroundColor: theme.border
          }]} />
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.publishButton,
          { backgroundColor: theme.primary },
          (!newsText.trim() && !pickedImage) ? [styles.publishButtonDisabled, {
            backgroundColor: theme.primary + '70'
          }] : null
        ]}
        onPress={handleAddPost}
        disabled={!newsText.trim() && !pickedImage}
      >
        <Text style={styles.publishButtonText}>Опубликовать</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    padding: 8,
    borderRadius: 5,
    marginBottom: 7,
    fontSize: 15,
    borderWidth: 1,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
  },
  miniImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  publishButton: {
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  publishButtonDisabled: {
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostForm; 
