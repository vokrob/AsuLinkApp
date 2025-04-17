import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostPreview = ({ post }: { post: { id: number; title: string; image: string; } }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: post.image }} style={styles.image} />
            <Text style={styles.title}>{post.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create(
    {
        container: {
            margin: 10,
        },
        image: {
            width: '100%',
            height: 200,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
        },
    }
);

export default PostPreview;