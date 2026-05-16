# DevDuel ⚔️

DevDuel is a real-time, competitive coding battle platform where developers face off to solve algorithmic challenges as quickly as possible.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Monaco Editor
- **Backend**: Java Spring Boot, Spring Security, Spring WebSockets (STOMP)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

---

## Prerequisites

Before running the application, ensure you have the following installed on your machine:
1. **Node.js** (v18+ recommended)
2. **Java Development Kit (JDK)** (v17 or v21)
3. **Maven** (Usually bundled with IntelliJ or installable via Chocolatey/Homebrew)
4. **PostgreSQL** (Running on port `5432`)

---

## 1. Setting up the Database

1. Open your PostgreSQL client (pgAdmin or psql terminal).
2. Create a new database for the application:
   ```sql
   CREATE DATABASE devduel;
   ```
3. *(Optional)* If your local postgres credentials are not `postgres` / `password`, you will need to update the `backend/src/main/resources/application.properties` file to match your username and password.

---

## 2. Running the Backend (Spring Boot)

The backend runs on **Port 8080**.

**Using Terminal:**
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using the included Maven Wrapper:
   
   **Windows:**
   ```bash
   .\mvnw spring-boot:run
   ```
   **Mac/Linux:**
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Note: The first time you run this, Hibernate will automatically connect to your PostgreSQL database and generate all the required tables).*

**Using an IDE (IntelliJ IDEA / Eclipse):**
1. Open the `backend` folder as a project in your IDE.
2. Allow Maven to download the dependencies.
3. Locate `DevduelApplication.java` in `src/main/java/com/devduel/backend/` and click the green "Run" button.

---

## 3. Running the Frontend (React)

The frontend runs on **Port 5173** (Vite's default).

1. Open a *new* terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

---

## Default Admin Account
Since the `AdminDashboard` requires an admin account, you can manually promote a user in your database. 
1. Register a normal user account via the frontend UI.
2. Run the following SQL command in your PostgreSQL client:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'YourUsername';
   ```

## Troubleshooting
- **CORS Errors**: Ensure the backend is running on `localhost:8080` and the frontend on `localhost:5173`. The Spring Security configuration explicitly allows traffic from port 5173.
- **WebSocket Connection Failed**: Ensure the Spring Boot server is fully booted before loading the `BattleRoom` page.
