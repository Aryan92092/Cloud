# Student Ranking and Result Processing System

> A full-stack academic web application demonstrating the practical application and step-by-step visualization of Design and Analysis of Algorithms (DAA) concepts.

---

## Project Description

The **Student Ranking and Result Processing System** is built as a DAA Laboratory and Academic Capstone project. It allows educators to manage student records, process exam results, visualize sorting and searching algorithms in real-time, and generate ranked merit lists.

The backend provides a REST API using Node.js and Express. The frontend is a React single-page application built with Vite and styled with Tailwind CSS. The system works completely without a database using a built-in in-memory data store, or it can optionally connect to MongoDB Atlas or a local MongoDB instance.

---

## Features

- Dashboard with live statistics and charts
- Complete student CRUD management
- Result processing with six sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap)
- Step-by-step algorithm visualizer with animation
- Algorithm comparison benchmarks
- Linear and Binary search
- Ranked merit list with 1224 competition ranking scheme
- Analytics and performance charts
- Examination configuration and grading scheme editor
- Works without any database (in-memory fallback)

---

## Technology Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Recharts, Lucide React |
| Backend   | Node.js, Express.js                       |
| Database  | Optional MongoDB (Atlas or local) — in-memory JSON store used by default |
| Container | Docker, Docker Compose                    |
| Web Server| Nginx (serves the React build in production) |

---

## Project Architecture

```
student-ranking-system/
+-- backend/              # Express REST API
¦   +-- algorithms/       # Sorting, searching, ranking implementations
¦   +-- controllers/      # Route handler logic
¦   +-- models/           # Data store (Mongoose + in-memory fallback)
¦   +-- routes/           # Express route definitions
¦   +-- seed/             # Data generator
¦   +-- test/             # Algorithm and E2E tests
¦   +-- server.js         # Application entry point
¦   +-- Dockerfile        # Backend Docker image definition
¦   +-- .env.example      # Environment variable template
¦
+-- frontend/             # React + Vite application
¦   +-- src/
¦   ¦   +-- components/   # Reusable UI components
¦   ¦   +-- context/      # React Context (auth, students, toasts)
¦   ¦   +-- pages/        # Full page components
¦   ¦   +-- services/     # API client (api.js)
¦   ¦   +-- algorithms/   # Frontend algorithm visualizations
¦   +-- nginx.conf        # Nginx config (API proxy + SPA routing)
¦   +-- Dockerfile        # Frontend Docker image (build + Nginx)
¦   +-- .dockerignore
¦
+-- docker-compose.yml    # Runs both containers together
+-- .gitignore            # Protects secrets from GitHub
+-- README.md             # This file
```

---

## Local Development (without Docker)

These are the commands to run the project directly on your computer for development.

### Prerequisites
- Node.js 18 or 20 installed

### Step 1 - Install backend dependencies
```bash
cd backend
npm install
```

### Step 2 - Start the backend
```bash
npm start
```
Backend runs at http://localhost:5000

### Step 3 - Install frontend dependencies (new terminal)
```bash
cd frontend
npm install
```

### Step 4 - Start the frontend dev server
```bash
npm run dev
```
Frontend runs at http://localhost:5173

The Vite dev server automatically forwards /api requests to localhost:5000.

---

## Running with Docker (Recommended)

This runs the complete production application in containers. You only need Docker Desktop installed.

### Prerequisites
- Docker Desktop installed and running

### Step 1 - Build both containers
```bash
docker compose build
```
This compiles the React app and prepares the Node.js server. This may take a few minutes the first time.

### Step 2 - Start the application
```bash
docker compose up
```
Or run it in the background (detached mode):
```bash
docker compose up -d
```

### Step 3 - Open the application
Open your browser and go to:
```
http://localhost
```
You do NOT need to type a port number. The app runs on port 80.

### Step 4 - Stop the application
```bash
docker compose down
```

---

## Environment Variables

Environment variables let you configure the application without changing any code.

### How to use them

1. Copy the example file:
```bash
cp backend/.env.example backend/.env
```
2. Open `backend/.env` and fill in any values you want to change.
3. The `.env` file is listed in `.gitignore` so it will never be uploaded to GitHub.

### Available variables

| Variable       | Default       | Description                                          |
|----------------|---------------|------------------------------------------------------|
| `PORT`         | `5000`        | The port the Express server listens on               |
| `NODE_ENV`     | `production`  | Set to `development` for local development           |
| `MONGODB_URI`  | *(empty)*     | Optional MongoDB connection string. Leave blank to use the built-in in-memory store. |

**The application works perfectly without setting any environment variables.**

---

## GitHub Setup

Run these commands once to upload the project to GitHub.

```bash
# 1. Initialise a Git repository in the project folder
git init

# 2. Stage all files (the .gitignore will automatically exclude secrets)
git add .

# 3. Create the first commit
git commit -m "Initial project setup: React + Express + Docker"

# 4. Connect to your GitHub repository
#    Replace the URL with your own repository URL from GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push to GitHub
git push -u origin main
```

> **Important**: Never paste your GitHub password into the terminal. Use a Personal Access Token (PAT) instead. Go to GitHub ? Settings ? Developer Settings ? Personal Access Tokens to create one.

---

## AWS EC2 Deployment

This project is designed to run on an Ubuntu AWS EC2 instance using Docker Compose. The architecture is:

```
Internet
   |
   | port 80
   v
EC2 Ubuntu Server
   |
   | Docker Compose
   +-- frontend container (Nginx on port 80)
   |       |
   |       | /api/* forwarded internally
   |       v
   +-- backend container (Express on port 5000, NOT exposed publicly)
```

### Step 1 - Launch an EC2 instance
- Go to AWS Console ? EC2 ? Launch Instance
- Choose Ubuntu 22.04 LTS (free tier eligible)
- Choose t2.micro (free tier)
- Create or select a key pair (.pem file) — save this file, you cannot recover it
- In Security Groups, allow: SSH (port 22), HTTP (port 80)
- Launch the instance

### Step 2 - Connect to the server
```bash
# Replace your-key.pem and your-ip with your actual values
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 3 - Install Docker on the server
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
# Log out and log back in for the group change to take effect
exit
```

### Step 4 - Upload the project to the server
```bash
# On your local machine, upload the project
scp -i your-key.pem -r ./student-ranking-system ubuntu@YOUR_EC2_PUBLIC_IP:~/
```

Or clone directly from GitHub on the server:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### Step 5 - Run the application
```bash
docker compose build
docker compose up -d
```

### Step 6 - Access the application
Open your browser and go to:
```
http://YOUR_EC2_PUBLIC_IP
```

The application is now live on the internet.

---

## Security Checklist

- [ ] `.env` file is NEVER committed to GitHub
- [ ] AWS `.pem` key file is NEVER committed to GitHub  
- [ ] MongoDB credentials (if any) are ONLY in `.env`, never in code
- [ ] AWS Access Keys are NEVER stored in the repository
- [ ] EC2 Security Group only exposes ports 22 and 80

---

## Running Backend Tests

```bash
cd backend
npm test
```
