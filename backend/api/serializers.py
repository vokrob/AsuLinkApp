from rest_framework import serializers
from django.contrib.auth.models import User
from posts.models import Post, Comment, Like
from accounts.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'role', 'role_display', 'avatar', 'bio', 'birth_date', 'avatar_url', 'full_name',
            # Поля для студентов
            'faculty', 'group', 'course',
            # Поля для преподавателей
            'department', 'position'
        ]

    def get_role_display(self, obj):
        """Возвращает человекочитаемое название роли"""
        return dict(UserProfile.ROLE_CHOICES).get(obj.role, obj.role)


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'full_name']

    def get_full_name(self, obj):
        """Возвращает полное имя пользователя"""
        return obj.get_full_name() or obj.username


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content', 'image', 'created_at', 
            'updated_at', 'likes', 'views', 'comments', 
            'comments_count', 'is_liked'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'likes', 'views']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(post=obj, user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'content', 'image', 'created_at', 'author']
        read_only_fields = ['id', 'created_at', 'author']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def to_representation(self, instance):
        # Return full post data after creation
        return PostSerializer(instance, context=self.context).data


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        validated_data['post'] = self.context['post']
        return super().create(validated_data)
