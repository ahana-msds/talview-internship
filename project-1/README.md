# React Dashboard Project
A comprehensive Single Page Application (SPA) built with React, TypeScript, and Vite. This project demonstrates modern web development practices including authentication, global state management, API integration, and modular styling.
##  Features
### 1. Authentication System
- **Multiple Providers**: Supports Google, GitHub, and Email/Password login via **Firebase Authentication**.
- **Guest Access**: Simulated guest login for quick access.
- **Protected Routes**: Dashboard is inaccessible without logging in.
- **Global State**: Managed via `AuthContext` to persist user sessions.
### 2. Dynamic Dashboard
A responsive grid layout hosting multiple interactive feature widgets:
- ** Todo List**: 
  - Full CRUD capabilities (Create, Read, Update, Delete).
  - Interactive UI with edit modes and deletion confirmation.
  
- ** Product API Fetcher**: 
  - Fetches real product data from [FakeStoreAPI](https://fakestoreapi.com/).
  - **Manual Trigger**: optimized to fetch only on user request (Button Click).
  - Displays product images, titles, and prices in a clean list.
- ** GitHub API Explorer** (Conditional):
  - *Only visible when logged in via GitHub.*
  - Search any GitHub username to view their profile, avatar, bio, and stats (Repos/Followers).
### 3. Theming System
- **Theme Switcher**: Change the look and feel instantly from the Navbar.
- **Themes Available**:
  - **H&M Minimal** (Default): Clean, monochrome, sharp edges.
  - **Ocean**: Calming blue/teal palette with rounded corners.
  - **Forest**: Earthy green and brown tones.
##  Tech Stack
- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: **CSS Modules** for component-level isolation + Global Variables for theming.
- **Backend/Auth**: [Firebase v12](https://firebase.google.com/)
##  Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   - This project uses Firebase. You need to set up your keys.
   - Create a file named `.env` in the root directory.
   - Copy the contents from `.env.example` and replace the placeholders with your actual Firebase config keys.
   
   *Example `.env` content:*
   ```env
   VITE_FIREBASE_API_KEY=your_real_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   ...
   ```
4. **Run Development Server**
   ```bash
   npm run dev
   ```
5. **Build for Production**
   ```bash
   npm run build
   ```
##  Project Structure & File Explanations
Here is a detailed breakdown of what each file in the project does:
```text
/
├── package.json              # Project configuration: lists dependencies and scripts (dev, build).
├── .env                      # [SECRET] Contains real API keys (Ignored by Git).
├── .env.example              # Template file showing which keys are needed (Safe to share).
├── .gitignore                # Specifies which files Git should ignore (e.g., node_modules, .env).
├── index.html                # Main HTML entry point. The React app runs inside the <div id="root">.
├── vite.config.ts            # Configuration for the Vite build tool.
│
└── src/
    ├── main.tsx              # Application Entry Point. Mounts the React App to the DOM.
    ├── App.tsx               # Root Component. Sets up Routing and Context Providers (Auth, Theme).
    ├── index.css             # Global Styles. Contains CSS Variables for Themes (colors, fonts).
    │
    ├── components/           # Reusable UI Components
    │   ├── Navbar.tsx        # Top Navigation: Shows Logo, User Name, Theme Switcher, Logout.
    │   └── Navbar.module.css # Styling for the Navbar.
    │
    ├── contexts/             # Global Logic (State Management)
    │   ├── AuthContext.tsx   # Manages User Login/Logout state and Firebase Integration.
    │   └── ThemeContext.tsx  # Manages the active Theme (Default, Ocean, Forest).
    │
    ├── features/             # Independent Logic Modules (Widgets)
    │   ├── TodoList.tsx            # Todo Logic: Add, Edit, Delete tasks.
    │   ├── TodoList.module.css     # Styling for Todo widget.
    │   ├── ProductFetcher.tsx      # Fetches/Displays products from FakeStoreAPI.
    │   ├── ProductFetcher.module.css # Styling for Product widget.
    │   ├── GithubFetcher.tsx       # Fetches/Displays GitHub User Profile (Conditional).
    │   └── GithubFetcher.module.css  # Styling for GitHub widget.
    │
    └── pages/                # Main Screen Views
        ├── LoginPage.tsx     # Login Screen: Email/Pass, Social Login buttons.
        ├── SignupPage.tsx    # Registration Screen: Create new account.
        ├── Auth.module.css   # Shared styling for Login and Signup pages.
        ├── DashboardPage.tsx # Main App Screen: Grid layout holding all 'features'.
        └── DashboardPage.module.css # Styling for the Dashboard layout.
```
##  Key Learnings & Implementation Details
- **Modular CSS**: We moved from inline styles to `.module.css` files to keep code clean and prevent style conflicts.
- **Context API vs Props**: Used Context for Auth and Theme to avoid "prop drilling" across the application.
- **Environment Variables**: Secured sensitive Firebase keys using `.env` files, ensuring they aren't exposed in the public codebase.
