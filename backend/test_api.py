#!/usr/bin/env python
"""
Simple script to test the AsuLinkApp API endpoints
"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_api():
    print("Testing AsuLinkApp API...")
    print("=" * 50)
    
    # Test 1: Get posts (no authentication required)
    print("1. Testing GET /api/posts/")
    try:
        response = requests.get(f"{BASE_URL}/posts/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            posts_count = len(data.get('results', data))
            print(f"✅ Success! Found {posts_count} posts")
            if posts_count > 0:
                first_post = data.get('results', data)[0] if data.get('results') else data[0]
                print(f"First post: {first_post.get('content', '')[:50]}...")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # Test 2: Register new user
    print("2. Testing POST /api/auth/register/")
    test_user = {
        'username': 'testuser123',
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            token = data.get('token')
            print(f"✅ Success! User registered, token: {token[:20]}...")
            
            # Test 3: Create a post with authentication
            print("\n3. Testing POST /api/posts/ (authenticated)")
            post_data = {
                'content': 'This is a test post created via API!'
            }
            
            headers = {
                'Authorization': f'Token {token}',
                'Content-Type': 'application/json'
            }
            
            post_response = requests.post(
                f"{BASE_URL}/posts/",
                json=post_data,
                headers=headers
            )
            
            print(f"Status: {post_response.status_code}")
            if post_response.status_code == 201:
                post_data = post_response.json()
                post_id = post_data.get('id')
                print(f"✅ Success! Post created with ID: {post_id}")
                
                # Test 4: Like the post
                print("\n4. Testing POST /api/posts/{id}/like/")
                like_response = requests.post(
                    f"{BASE_URL}/posts/{post_id}/like/",
                    headers=headers
                )
                
                print(f"Status: {like_response.status_code}")
                if like_response.status_code == 200:
                    like_data = like_response.json()
                    print(f"✅ Success! Post liked: {like_data}")
                else:
                    print(f"❌ Failed: {like_response.text}")
                
            else:
                print(f"❌ Failed to create post: {post_response.text}")
                
        elif response.status_code == 400:
            error_data = response.json()
            if 'Username already exists' in error_data.get('error', ''):
                print("⚠️  User already exists, trying to login...")
                
                # Test login instead
                login_response = requests.post(
                    f"{BASE_URL}/auth/login/",
                    json={'username': test_user['username'], 'password': test_user['password']},
                    headers={'Content-Type': 'application/json'}
                )
                
                if login_response.status_code == 200:
                    data = login_response.json()
                    token = data.get('token')
                    print(f"✅ Login successful! Token: {token[:20]}...")
                else:
                    print(f"❌ Login failed: {login_response.text}")
            else:
                print(f"❌ Registration failed: {error_data}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # Test 5: Get user profile (requires authentication)
    print("5. Testing GET /api/profile/ (requires auth)")
    print("This test requires a valid token from previous tests")
    
    print("\n" + "=" * 50)
    print("API testing completed!")
    print("\nTo run more comprehensive tests:")
    print("cd backend && python manage.py test")


if __name__ == '__main__':
    test_api()
