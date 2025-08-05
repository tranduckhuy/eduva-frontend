<div align="center">
  <br />  
  <a href="https://student.eduva.tech/">
    <img src="frontend/public/images/logo.png" alt="EDUVA Logo" width="200"/>
  </a>
  <br/>
  <strong>EDUVA - A comprehensive educational platform for schools, teachers, and students</strong>
</div>

## 📋 Table of Contents

-   [About Project](#about-project)
-   [Built With](#built-with)
-   [Getting Started](#getting-started)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Available Scripts](#available-scripts)
-   [Project Structure](#project-structure)
-   [Environment Variables](#environment-variables)
-   [Contributing](#contributing)
-   [License](#license)

## About Project

EDUVA is a modern, comprehensive educational management platform designed to streamline the learning experience for schools, teachers, and students. Built with Angular 18 and modern web technologies, it provides a robust, scalable solution for educational institutions.

### Key Features:

-   **Lesson Viewing**: Watch and learn from educational content with video, PDF, and document support
-   **Question & Comment System**: Ask questions and participate in discussions about lessons
-   **Profile Management**: Update and manage personal information and settings
-   **Real-time Communication**: Live updates and notifications

## 🛠 Built With

### Frontend Framework

-   **[Angular 18](https://angular.io/)** - Modern web application framework
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI/UX Libraries

-   **[PrimeNG](https://primeng.org/)** - Rich UI component library
-   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
-   **[FontAwesome](https://fontawesome.com/)** - Icon library

### Media & Content

-   **[CKEditor 5](https://ckeditor.com/)** - Rich text editor
-   **[VideoGular](https://videogular.com/)** - Video player
-   **[Plyr](https://plyr.io/)** - Media player
-   **[ngx-extended-pdf-viewer](https://www.npmjs.com/package/ngx-extended-pdf-viewer)** - PDF viewer

### Backend Integration

-   **[Supabase](https://supabase.com/)** - Backend as a Service
-   **[SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr)** - Real-time communication

### Development Tools

-   **[Vitest](https://vitest.dev/)** - Unit testing framework
-   **[Prettier](https://prettier.io/)** - Code formatter
-   **[Custom Webpack](https://github.com/angular-builders/custom-webpack)** - Custom build configuration

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **yarn** package manager
-   **Git** for version control

### System Requirements

-   Modern web browser (Chrome, Firefox, Safari, Edge)
-   Minimum 4GB RAM recommended
-   Stable internet connection for backend services

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/qcode95/eduva-landing.git
    cd eduva-frontend
    ```

2. **Navigate to frontend directory**

    ```bash
    cd frontend
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Set up environment variables**

    ```bash
    # Copy environment template
    cp .env.example .env

    # Edit environment file with your configuration
    # Required environment variables:
    # - BASE_API_URL: Your backend API URL
    # - BASE_HUB_URL: SignalR hub URL
    # - CLIENT_URL: Frontend application URL
    # - SUPABASE_URL: Supabase project URL (for image storage)
    # - SUPABASE_KEY: Supabase anonymous key (for image storage)
    ```

5. **Start development server**

    ```bash
    npm start
    ```

6. **Open your browser**
   Navigate to `http://localhost:4200`

## 🎮 Usage

### For Students

-   **Watch Lessons**: View and learn from educational content
-   **Ask Questions**: Submit questions about lessons and topics
-   **Comment on Questions**: Participate in discussions by commenting on questions
-   **Profile Management**: Update and manage personal profile information

## 🔧 Available Scripts

```bash
# Development
npm start                  # Start development server
npm start:staging          # Start with staging configuration

# Building
npm run build              # Build for production
npm run build:staging      # Build for staging
npm run build:dev          # Build for development
npm run watch              # Build with watch mode

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:ui            # Run tests with UI
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Core functionality (auth, guards, interceptors)
│   │   │   ├── auth/          # Authentication services and models
│   │   │   ├── guards/        # Route guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── layout/        # Layout components
│   │   ├── features/          # Feature modules
│   │   │   ├── classes/       # Class management
│   │   │   ├── classroom-detail/ # Classroom details
│   │   │   ├── home/          # Home page
│   │   │   ├── profile/       # User profile
│   │   │   ├── settings/      # Settings and configuration
│   │   │   └── watch-lessons/ # Lesson viewing
│   │   └── shared/            # Shared components and services
│   │       ├── components/    # Reusable UI components
│   │       ├── models/        # Data models and interfaces
│   │       ├── services/      # Shared services
│   │       └── utils/         # Utility functions
│   ├── assets/                # Static assets
│   └── environments/          # Environment configurations
├── public/                    # Public assets
└── package.json              # Dependencies and scripts
```

## 🔐 Environment Variables

The project uses `.env` files for environment configuration. The `.env` file is gitignored for security.

### Required Variables

```bash
# API Configuration
BASE_API_URL=your_backend_api_url
BASE_HUB_URL=your_signalr_hub_url
CLIENT_URL=your_frontend_url

# Supabase Storage
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Setup Instructions

1. Create `.env` file
2. Copy `.env.example` to `.env`
3. Fill in your actual values

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

-   Follow Angular style guide
-   Write unit tests for new features
-   Ensure code passes linting
-   Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for better education</p>
  <p>© 2025 EDUVA. All rights reserved.</p>
</div>
