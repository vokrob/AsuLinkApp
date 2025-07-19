# <img src="assets/app-logo.png" width="32" align="top"> AsuLinkApp

## Description

Mobile application for students and faculty of Altai State University. Enables communication, news viewing, event participation, and classroom finding.

## Technology Stack

- React Native with TypeScript
- Django + SQLite
- Django Allauth

## Installation Instructions

Backend setup:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Application setup:
```bash
npm install
npm start
```

For testing on physical device, change IP in `src/services/api.ts`

## Usage Instructions

1. Register and confirm email
2. Complete student or faculty profile
3. Browse news feed and create posts
4. Participate in university events
5. Use map to find classrooms
