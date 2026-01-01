Prime Task - Full Stack Task Management Application🚀 Project OverviewPrime Task is a comprehensive full-stack web application for task management, built with modern technologies. It allows users to create, manage, and track their tasks with features like user authentication, task prioritization, status tracking, and profile management.🛠️ Technology StackBackend:Runtime: Node.jsFramework: Express.jsDatabase: MongoDB with Mongoose ODMAuthentication: JWT (JSON Web Tokens) with bcrypt for password hashingSecurity: Helmet for security headers, CORS, rate limitingValidation: Express-validatorLogging: MorganFrontend:Framework: React 19 with ViteState Management: Redux ToolkitRouting: React Router DOMStyling: Tailwind CSSForms: React Hook Form with Zod validationAnimations: Framer MotionHTTP Client: Axios✨ Key FeaturesUser Management: Registration, login, JWT-based authentication, and protected profile management (username, email, bio, phone).Task Management: Full CRUD operations with properties like Title, Description, Status (pending, in-progress, completed), Priority (low, medium, high), and Due Date.Security: Implemented password hashing, rate limiting, and input sanitization.User Isolation: Tasks are isolated per specific user.📂 Project StructurePlaintextPrime-trade-task/
├── backend/
│   ├── controller/      # Auth and Task logic
│   ├── middleware/      # JWT and Validation
│   ├── model/           # User and Task schemas
│   └── routes/          # API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application views
│   │   ├── store/       # Redux slices
│   │   └── utils/       # API and toast helpers
└── Prime Task.postman_collection.json  # API testing
📡 API EndpointsMethodEndpointDescriptionPOST/api/auth/registerUser registrationPOST/api/auth/loginUser loginGET/api/auth/profileGet user profileGET/api/taskGet all user tasksPOST/api/taskCreate new task⚙️ Getting StartedPrerequisites: Node.js (v14+), MongoDB database.1. Clone the repository:Bashgit clone <repository-url>
cd prime-trade-task
2. Backend Setup:Bashcd backend
npm install
# Create .env file with MONGO_URI, JWT_SECRET, and PORT
npm run dev
3. Frontend Setup:Bashcd ../frontend
npm install
npm run dev
4. Access Application:Frontend: http://localhost:5173Backend: http://localhost:5000📜 LicenseThis project is licensed under the MIT License.
