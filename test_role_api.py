import requests
import json

def test_role_api():
    url = 'http://192.168.1.73:8000/api/auth/check-role/'

    # Тест 1: Email преподавателя
    print("🧪 Тест 1: Email преподавателя")
    response = requests.post(url, json={'email': 'rem6637@gmail.com'})
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

    # Тест 2: Email студента
    print("🧪 Тест 2: Email студента")
    response = requests.post(url, json={'email': 'student@example.com'})
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

    # Тест 3: Другой email студента
    print("🧪 Тест 3: Другой email студента")
    response = requests.post(url, json={'email': 'vokrob.dev@gmail.com'})
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

    # Тест 4: Пустой email
    print("🧪 Тест 4: Пустой email")
    response = requests.post(url, json={'email': ''})
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    test_role_api()
