# Job & Internship Tracker

A full-stack web application to manage job and internship applications, organize career-related tasks, and analyze job opportunities using AI.

## Features

- User registration and login
- Add and manage job and internship applications
- Track application statuses
- Create tasks and mark them as completed
- Dashboard to view applications and pending tasks
- AI-powered job description analysis using Google Gemini API
- Skill matching to identify matching and missing skills
- AI-generated recommendations based on skill gaps
- AI-generated interview questions based on job descriptions

## Tech Stack

- **Frontend:** React.js, JavaScript, CSS, Vite
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **AI Integration:** Google Gemini API (gemini-2.5-flash)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swastika-paul/ai-job-internship-tracker.git
cd ai-job-internship-tracker
```

### 2. Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your actual credentials.

Start the backend server:

```bash
npm run dev
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## AI Job Description Analyzer

The AI-powered analyzer helps users understand how well their skills match a job opportunity.

- Paste a job description to analyze a job opportunity.
- Identify required skills and compare them with your existing skills.
- Calculate skill match percentage.
- Identify matching and missing skills.
- Receive AI-generated recommendations to improve skill gaps.
- Generate interview questions based on the job description.

## Future Improvements

- Application deadline reminders
- Calendar integration
- Personalized career insights

## Author

**Swastika Paul**

- GitHub: https://github.com/swastika-paul
- LinkedIn: https://www.linkedin.com/in/swastika-paul-05186a381
