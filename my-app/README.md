
# TaskFlow Hub

A modern, full-stack React application with Firebase authentication, todo management, and API integrations.

## Features

- **Authentication System**
  - Email/Password login
  - Google OAuth
  - GitHub OAuth
  - Guest login
  - User registration

- **Todo List**
  - Add, edit, and delete tasks
  - Mark tasks as complete
  - Real-time updates

- **Product API Demo**
  - Fetch products from external API
  - Display product cards with details

- **GitHub User Finder** (Only available with GitHub login)
  - Search GitHub users
  - Display user profile and stats

- **Theme System**
  - H&M Classic (Black & Red)
  - Ocean Blue
  - Sunset Orange

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication methods:
   - Email/Password
   - Google
   - GitHub
4. Copy your Firebase configuration
5. Replace the config in `src/config/firebase.js`

### 3. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard features
│   └── layout/            # Layout components
├── config/                # Configuration files
├── styles/                # CSS stylesheets
├── App.jsx                # Main app component
└── index.jsx              # Entry point
```

## Technologies Used

- React 18
- Firebase Authentication
- FakeStore API
- GitHub API
- CSS3 with CSS Variables
- Responsive Design

## License

MIT
```

---

All files are now properly separated and organized! Remember to:
1. Replace the Firebase configuration with your actual credentials
2. Install dependencies with `npm install`
3. Run with `npm start`

The project is fully modular, clean, and ready for development!