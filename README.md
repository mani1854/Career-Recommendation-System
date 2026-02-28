# Career Recommendation System (React + Django)

This project now includes a complete full-stack implementation with:
- **User registration and login**
- **RIASEC-based aptitude/personality questionnaire** (adapted from the notebook)
- **Career recommendation result** after submitting answers

## Project Structure

- `backend/` → Django REST API (auth + questionnaire + scoring)
- `frontend/` → React + Vite single-page application
- `Aptitude based personality test and visualization.ipynb` → source of questionnaire content used in API

## Backend Setup (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

## Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

If needed, set custom API base:

```bash
VITE_API_BASE=http://127.0.0.1:8000/api npm run dev
```

## API Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/assessment/questions/`
- `POST /api/assessment/submit/`
- `GET /api/assessment/latest/`

## Assessment Logic

- Questions are grouped into RIASEC categories: `R, I, A, S, E, C`.
- Each answer uses a 0–4 score (`Strongly Disagree` to `Strongly Agree`).
- Category totals are computed and the **highest total** becomes the dominant personality type.
- Returned result includes:
  - score breakdown across all categories
  - dominant personality description
  - recommended careers
