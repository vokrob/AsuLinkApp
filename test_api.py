#!/usr/bin/env python3
import requests
import json

# Тестирование API для отзывов на события
BASE_URL = "http://192.168.1.73:8000/api"

def login_and_get_token():
    """Логин и получение токена"""
    print("🔐 Попытка входа...")

    # Попробуем войти с тестовыми данными
    login_data = {
        "username": "testuser",  # Тестовый пользователь
        "password": "testpass123"
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"🔐 Логин: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"✅ Токен получен: {token[:20]}..." if token else "❌ Токен не найден")
            return token
        else:
            print(f"❌ Ошибка логина: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Ошибка при логине: {e}")
        return None

def test_events_api_with_auth(token=None):
    """Тестирование API событий с авторизацией"""
    print("🔍 Тестирование API событий с авторизацией...")

    headers = {}
    if token:
        headers['Authorization'] = f'Token {token}'

    # Получаем список событий
    try:
        response = requests.get(f"{BASE_URL}/events/", headers=headers)
        print(f"📋 Список событий: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"   Найдено событий: {len(events)}")
            if events:
                event_id = events[0]['id']
                print(f"   Первое событие ID: {event_id}")
                print(f"   Название: {events[0].get('title', 'Без названия')}")

                # Тестируем получение отзывов для первого события
                reviews_url = f"{BASE_URL}/events/{event_id}/reviews/"
                print(f"🔍 Тестируем URL отзывов: {reviews_url}")

                reviews_response = requests.get(reviews_url, headers=headers)
                print(f"📝 Отзывы события: {reviews_response.status_code}")
                if reviews_response.status_code == 200:
                    reviews = reviews_response.json()
                    print(f"   Найдено отзывов: {len(reviews)}")

                    # Тестируем создание отзыва
                    if token:
                        test_create_review(event_id, token)
                else:
                    print(f"   Ошибка получения отзывов: {reviews_response.text}")

                return event_id
            else:
                print("   Событий не найдено")
                return None
        else:
            print(f"   Ошибка: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Ошибка при тестировании: {e}")
        return None

def test_create_review(event_id, token):
    """Тестирование создания отзыва"""
    print(f"📝 Тестирование создания отзыва для события {event_id}...")

    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }

    review_data = {
        "rating": 5,
        "comment": "Тестовый отзыв из скрипта"
    }

    reviews_url = f"{BASE_URL}/events/{event_id}/reviews/"
    print(f"🔗 POST URL: {reviews_url}")
    print(f"📦 Данные: {review_data}")

    try:
        response = requests.post(reviews_url, json=review_data, headers=headers)
        print(f"📡 Ответ: {response.status_code} {response.reason}")
        print(f"📄 Содержимое ответа: {response.text}")

        if response.status_code == 201:
            print("✅ Отзыв успешно создан!")
        else:
            print(f"❌ Ошибка создания отзыва")

    except Exception as e:
        print(f"❌ Ошибка при создании отзыва: {e}")

def test_url_patterns():
    """Тестирование различных URL паттернов"""
    print("🔍 Тестирование URL паттернов...")

    urls_to_test = [
        f"{BASE_URL}/",
        f"{BASE_URL}/events/",
        f"{BASE_URL}/auth/me/",
    ]

    for url in urls_to_test:
        try:
            response = requests.get(url)
            print(f"📡 {url}: {response.status_code}")
        except Exception as e:
            print(f"❌ {url}: Ошибка - {e}")

if __name__ == "__main__":
    print("🚀 Начинаем тестирование API...")

    # Тестируем базовые URL
    test_url_patterns()

    # Пытаемся войти и получить токен
    token = login_and_get_token()

    # Тестируем API событий
    event_id = test_events_api_with_auth(token)

    # Тестируем конкретное событие, которое мы создали
    if token:
        print(f"\n🔍 Тестирование конкретного события...")
        test_create_review("2db575f4-87b7-4efd-a8c0-c4e8410d91e0", token)

    print("\n✅ Тестирование завершено!")
