#!/usr/bin/env python
"""
Script to create sample data for the AsuLinkApp backend
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asulinkapp_backend.settings')
django.setup()

from django.contrib.auth.models import User
from posts.models import Post, Comment, Like
from accounts.models import UserProfile


def create_sample_data():
    print("Creating sample data...")
    
    # Create sample users
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'password123'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'password': 'password123'
        },
        {
            'username': 'alex_wilson',
            'email': 'alex@example.com',
            'first_name': 'Alex',
            'last_name': 'Wilson',
            'password': 'password123'
        }
    ]
    
    users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name']
            }
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"Created user: {user.username}")
        users.append(user)
    
    # Create sample posts
    posts_data = [
        {
            'content': 'Привет всем! Это мой первый пост в AsuLinkApp. Рад быть частью этого сообщества!',
            'author': users[0]
        },
        {
            'content': 'Сегодня отличная погода для прогулки по кампусу. Кто-нибудь хочет присоединиться?',
            'author': users[1]
        },
        {
            'content': 'Изучаю Django REST Framework. Очень мощный инструмент для создания API!',
            'author': users[2]
        },
        {
            'content': 'Завтра важная лекция по программированию. Не забудьте подготовиться!',
            'author': users[0]
        },
        {
            'content': 'Кто-нибудь знает хорошие места для учебы в университете?',
            'author': users[1]
        }
    ]
    
    posts = []
    for post_data in posts_data:
        post, created = Post.objects.get_or_create(
            content=post_data['content'],
            author=post_data['author']
        )
        if created:
            print(f"Created post by {post.author.username}")
        posts.append(post)
    
    # Create sample comments
    comments_data = [
        {
            'content': 'Добро пожаловать!',
            'post': posts[0],
            'author': users[1]
        },
        {
            'content': 'Я тоже готов присоединиться к прогулке!',
            'post': posts[1],
            'author': users[2]
        },
        {
            'content': 'Django действительно отличный фреймворк!',
            'post': posts[2],
            'author': users[0]
        }
    ]
    
    for comment_data in comments_data:
        comment, created = Comment.objects.get_or_create(
            content=comment_data['content'],
            post=comment_data['post'],
            author=comment_data['author']
        )
        if created:
            print(f"Created comment by {comment.author.username}")
    
    # Create some likes
    for i, post in enumerate(posts):
        # Each post gets likes from different users
        for j, user in enumerate(users):
            if i != j:  # Don't let users like their own posts
                like, created = Like.objects.get_or_create(
                    post=post,
                    user=user
                )
                if created:
                    post.likes += 1
        post.save()
    
    print("Sample data created successfully!")
    print(f"Created {User.objects.count()} users")
    print(f"Created {Post.objects.count()} posts")
    print(f"Created {Comment.objects.count()} comments")
    print(f"Created {Like.objects.count()} likes")


if __name__ == '__main__':
    create_sample_data()
