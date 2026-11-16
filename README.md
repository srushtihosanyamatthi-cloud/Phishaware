# Phishing Awareness Quiz

A responsive full-stack learning application for practicing how to recognize phishing. Quiz questions, answer feedback, completed attempts, learner progress, and lesson content are stored in MongoDB. The included examples are fictional and use harmless `.test` domains.

## Features

- React and React Router frontend with responsive home, account, dashboard, quiz, results, and learning-resource pages.
- Express REST API with MongoDB/Mongoose models for users, quizzes, results, and lessons.
- Account registration and login with bcrypt password hashes and signed bearer tokens.
- Server-evaluated answers, saved after every question; quiz attempts can resume in the same browser session.
- Dashboard statistics, recent history, missed warning-sign tracking, and recommendations derived from saved results.
- Helmet security headers, API rate limits, CORS allow-list, request-size limit, input checks, and consistent error responses.
- Quiz question and lesson examples are inserted into MongoDB on API startup. They are stored in the database—not served from a frontend mock-data file.

## Requirements

- Node.js 20 or newer and npm.
- MongoDB Community Server running locally, or a MongoDB Atlas connection string.

## Run locally

1. Start MongoDB. For a local installation, the default connection string is `mongodb://127.0.0.1:27017/phishing-awareness-quiz`.
2. Copy `backend/.env.example` to `backend/.env`. The example uses a local MongoDB URL; if you use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Replace `JWT_SECRET` with a private random value of at least 32 characters. Keep `.env` out of source control. The ZIP intentionally does not include a real `.env` file so database credentials and signing secrets are not shared.
3. Install the API dependencies and start the API:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

   The API starts at `http://localhost:5000`. Check `http://localhost:5000/api/health`.
4. In a separate terminal, install the frontend dependencies and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open the Vite URL (normally `http://localhost:5173`). To use a non-default API URL, set `VITE_API_URL` in `frontend/.env` before starting Vite.

The API will fail clearly if MongoDB is unreachable or the required JWT secret is missing. On startup, it upserts the sample quiz and lessons by slug, so restarting does not duplicate them. Existing learner accounts and results remain in MongoDB.

## REST API

All endpoints are prefixed with `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | API health |
| GET | `/quizzes` | List quizzes |
| GET | `/quizzes/:id` | Read a quiz without its answer key |
| POST | `/quizzes/submit` | Save and evaluate one answer (bearer token required) |
| POST | `/users/register` | Register with name, email, and a 10+ character password |
| POST | `/users/login` | Sign in |
| GET | `/users/:id` | Get the signed-in user's profile |
| GET | `/progress/:userId` | Dashboard statistics and recent attempts |
| GET | `/progress/:userId/history` | Completed quiz history |
| GET | `/progress/:userId/recommendations` | Lessons based on saved missed signs |
| GET | `/progress/attempts/:id` | Read the signed-in user's attempt and answer review |
| GET | `/lessons` | List learning resources |
| GET | `/lessons/:id` | Read lesson content |

Protected endpoints require `Authorization: Bearer <token>`. `POST /quizzes/submit` accepts `{ "quizId": "...", "questionId": "...", "selectedAnswer": "...", "attemptId": "..." }`; omit `attemptId` for the first answer. Its response returns feedback and an attempt ID to send with subsequent answers. The backend marks an attempt complete when every question has been answered.

## Production and GitHub deployment

- Deploy the frontend and API as separate services; configure `VITE_API_URL` to the deployed API's `/api` URL and `CLIENT_ORIGIN` to the exact deployed frontend origin.
- Set `MONGODB_URI`, a strong private `JWT_SECRET`, `CLIENT_ORIGIN`, and `NODE_ENV=production` in the API host's secret/environment settings. Never commit `.env` or put MongoDB/JWT secrets in frontend variables.
- Build the frontend with `npm run build` in `frontend`; serve the generated `frontend/dist` using a static host.
- Run the backend with `npm start` in `backend`. Use a managed MongoDB deployment with network access restricted to the API host.
- Add CI checks for frontend build and backend syntax/tests, and configure SPA route fallback to `index.html` on the static host.

## Safety note

All practice messages and links are fictional. The quiz does not ask learners for email passwords, one-time codes, or other real credentials. Account passwords are used only for application sign-in and are stored as bcrypt hashes.
