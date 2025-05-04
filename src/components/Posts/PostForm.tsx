import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface PostFormProps {
  onSubmit: (content: string, imageUri?: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [newsText, setNewsText] = useState('');
  const [pickedImage, setPickedImage] = useState<string | undefined>();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Нет доступа к галерее!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Напишите новость..."
        value={newsText}
        onChangeText={setNewsText}
        multiline
      />
      <View style={styles.imageRow}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <AntDesign name="picture" size={24} color="#2874A6" />
          <Text style={{ marginLeft: 5, color: '#2874A6' }}>Фото</Text>
        </TouchableOpacity>
        {pickedImage && (
          <Image source={{ uri: pickedImage }} style={styles.miniImage} />
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.publishButton,
          (!newsText.trim() && !pickedImage) ? styles.publishButtonDisabled : null
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
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 7,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F8',
    padding: 6,
    borderRadius: 6,
  },
  miniImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
    resizeMode: 'contain',
    backgroundColor: '#e1e1e1'
  },
  publishButton: {
    backgroundColor: '#2874A6',
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#AAC9DB',
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostForm; 